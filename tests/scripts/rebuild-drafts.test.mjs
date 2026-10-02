import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {mkdtemp, mkdir, readFile, writeFile, readdir, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {test} from 'node:test'

// Run the actual script with an offline SDK substitute in a disposable directory.
// The fake API deliberately returns an edited revision on a post-create read.
const sdk = `
import {readFileSync, writeFileSync} from 'node:fs'
const path = process.env.DRAFT_TEST_STATE
const state = JSON.parse(readFileSync(path, 'utf8'))
const save = () => writeFileSync(path, JSON.stringify(state))
export function createClient() {
  return {
    fetch: async () => state.published,
    getDocuments: async (ids) => ids.map(id => {
      if (state.created) return {_id: id, _rev: 'later-editor-revision'}
      return state.current.find(doc => doc._id === id) || null
    }),
    transaction() {
      const operations = []
      return {
        create(doc) { operations.push({create: doc}); return this },
        delete(condition) { operations.push({delete: condition}); return this },
        async commit(options) {
          state.commits.push({options, operations})
          if (operations.some(op => op.create)) {
            if (!options.returnDocuments || options.returnFirst !== false)
              throw Error('Creation must return all transaction documents')
            state.created = operations.map(op => ({...op.create, _rev: 'creation-revision'}))
            save()
            return state.created
          }
          if (state.race) state.current[0]._rev = 'concurrent-editor-revision'
          state.current = state.current.filter(doc => !operations.some(op =>
            op.delete.query.includes(JSON.stringify(doc._id)) &&
            op.delete.query.includes(JSON.stringify(doc._rev))))
          save()
          return {transactionId: 'offline-fixture'}
        },
      }
    },
  }
}
`

async function fixture(t, patch = {}) {
  const root = await mkdtemp(join(tmpdir(), 'iwc-draft-test-'))
  t.after(() => rm(root, {recursive: true, force: true}))
  await mkdir(join(root, 'scripts'))
  await mkdir(join(root, 'content'))
  const source = await readFile(new URL('../../scripts/rebuild-drafts.mjs', import.meta.url), 'utf8')
  await writeFile(join(root, 'scripts/run.mjs'), source.replace("from '@sanity/client'", "from './sdk.mjs'"))
  await writeFile(join(root, 'scripts/sdk.mjs'), sdk)
  await writeFile(
    join(root, 'content/redesign-review.json'),
    JSON.stringify({
      'service-one': {
        title: 'Review title',
        approachImage: {alt: 'Reviewed alt'},
        pageHeadings: {definition: 'Specific heading'},
        nextSteps: [{_key: 'one', title: 'Consultation', cta: {label: 'Request', href: '/book'}}],
      },
    }),
  )
  const stateFile = join(root, 'state.json')
  const published = [
    {
      _id: 'service-one',
      _type: 'service',
      _rev: 'published-revision',
      title: 'Published title',
      slug: {current: 'existing-slug'},
      approachImage: {asset: {_ref: 'existing-asset'}, crop: {top: 0.1}},
    },
  ]
  await writeFile(stateFile, JSON.stringify({published, current: [], commits: [], ...patch}))
  return {
    root,
    state: async () => JSON.parse(await readFile(stateFile, 'utf8')),
    run(args = [], token = 'offline-editor-token') {
      return execFileSync(process.execPath, [join(root, 'scripts/run.mjs'), ...args], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {...process.env, SANITY_API_WRITE_TOKEN: token, DRAFT_TEST_STATE: stateFile},
      })
    },
    async backup() {
      const dir = join(root, 'tmp/rebuild-backups')
      const [file] = await readdir(dir)
      return JSON.parse(await readFile(join(dir, file), 'utf8'))
    },
    async rollbackFile() {
      const path = join(root, 'backup.json')
      await writeFile(path, JSON.stringify({created: [{_id: 'drafts.service-one', _rev: 'creation-revision'}]}))
      return '--rollback=' + path
    },
  }
}

test('default mode only reports the read-only plan', async (t) => {
  const f = await fixture(t)
  assert.match(f.run(), /read-only plan/)
  assert.deepEqual((await f.state()).commits, [])
  assert.equal((await readdir(f.root)).includes('tmp'), false)
})

test('mutation mode requires an editor token', async (t) => {
  const f = await fixture(t)
  assert.throws(() => f.run(['--apply-drafts'], ''), /editor token is required/)
  assert.deepEqual((await f.state()).commits, [])
})

test('existing client drafts prevent creation', async (t) => {
  const f = await fixture(t, {current: [{_id: 'drafts.service-one', _rev: 'client-revision'}]})
  assert.throws(() => f.run(['--apply-drafts']), /Refusing to overwrite any draft/)
  assert.deepEqual((await f.state()).commits, [])
})

test('creation preserves source data and backs up the transaction revision', async (t) => {
  const f = await fixture(t)
  f.run(['--apply-drafts'])
  const state = await f.state()
  const backup = await f.backup()
  assert.equal(backup.created[0]._rev, 'creation-revision')
  assert.equal(backup.published[0].title, 'Published title')
  const doc = state.commits[0].operations[0].create
  assert.equal(doc._id, 'drafts.service-one')
  assert.equal(doc.title, 'Review title')
  assert.equal(doc.slug.current, 'existing-slug')
  assert.deepEqual(doc.approachImage.crop, {top: 0.1})
  assert.equal(doc.approachImage.asset._ref, 'existing-asset')
  assert.equal(doc.pageHeadings._type, 'pageHeadings')
  assert.equal(doc.nextSteps[0].cta._type, 'cta')
  assert.equal(doc.editorialReview.status, 'working')
})

test('rollback deletes only the exact newly created draft revision', async (t) => {
  const f = await fixture(t, {current: [{_id: 'drafts.service-one', _rev: 'creation-revision'}]})
  assert.match(f.run([await f.rollbackFile()]), /Published records untouched/)
  const state = await f.state()
  assert.deepEqual(state.current, [])
  assert.match(state.commits[0].operations[0].delete.query, /_rev == "creation-revision"/)
  assert.equal(state.published[0].title, 'Published title')
})

test('rollback refuses a previously edited draft', async (t) => {
  const f = await fixture(t, {current: [{_id: 'drafts.service-one', _rev: 'client-revision'}]})
  const arg = await f.rollbackFile()
  assert.throws(() => f.run([arg]), /Refusing to delete client edits/)
  assert.equal((await f.state()).current[0]._rev, 'client-revision')
  assert.deepEqual((await f.state()).commits, [])
})

test('rollback preserves edits that race with its initial read', async (t) => {
  const f = await fixture(t, {race: true, current: [{_id: 'drafts.service-one', _rev: 'creation-revision'}]})
  const arg = await f.rollbackFile()
  assert.throws(() => f.run([arg]), /changed during rollback and was preserved/)
  assert.equal((await f.state()).current[0]._rev, 'concurrent-editor-revision')
})
