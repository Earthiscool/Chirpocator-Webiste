// Tiny helpers for writing Portable Text by hand in seed content.
let counter = 0
export const key = () => `k${(++counter).toString(36)}${Math.random().toString(36).slice(2, 7)}`

/** Parse [label](href) and **bold** inside a string into spans + markDefs. */
function spans(text) {
  const markDefs = []
  const children = []
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    if (m.index > last) children.push({_type: 'span', _key: key(), text: text.slice(last, m.index), marks: []})
    if (m[1]) {
      const k = key()
      markDefs.push({_type: 'link', _key: k, href: m[2]})
      children.push({_type: 'span', _key: key(), text: m[1], marks: [k]})
    } else {
      children.push({_type: 'span', _key: key(), text: m[3], marks: ['strong']})
    }
    last = re.lastIndex
  }
  if (last < text.length) children.push({_type: 'span', _key: key(), text: text.slice(last), marks: []})
  return {markDefs, children}
}

export const block = (text, style = 'normal', listItem) => ({
  _type: 'block',
  _key: key(),
  style,
  ...spans(text),
  ...(listItem ? {listItem, level: 1} : {}),
})

export const p = (text) => block(text)
export const h2 = (text) => block(text, 'h2')
export const h3 = (text) => block(text, 'h3')
export const ul = (items) => items.map((t) => block(t, 'normal', 'bullet'))
export const ol = (items) => items.map((t) => block(t, 'normal', 'number'))
export const callout = (title, body) => ({_type: 'callout', _key: key(), title, body})

/** Portable text from a mix of strings (paragraphs) and blocks/arrays. */
export const pt = (...items) => items.flat().map((i) => (typeof i === 'string' ? p(i) : i))

/** Give every object in an array a _key. */
export const keyed = (arr) => arr.map((o) => (typeof o === 'object' ? {_key: key(), ...o} : o))
export const items = (pairs) => pairs.map(([title, body]) => ({_key: key(), _type: 'titledItem', title, body}))
export const ref = (id) => ({_type: 'reference', _ref: id, _key: key()})
export const ref1 = (id) => ({_type: 'reference', _ref: id})
export const cta = (label, href) => ({_type: 'cta', label, href})
export const ctaRef = (label, id) => ({_type: 'cta', label, internal: ref1(id)})
export const seo = (title, description) => ({_type: 'seo', title, description})
