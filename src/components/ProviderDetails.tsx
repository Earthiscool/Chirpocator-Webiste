import Link from 'next/link'

import type {Provider} from '@/sanity/types'

import {ArrowRight} from './icons'
import {RichText} from './RichText'

/** Shared provider profile body: who they help → how they work → services → credentials. */
export function ProviderDetails({p}: {p: Provider}) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-8 lg:col-span-7">
        {!!p.bestFit?.length && (
          <section>
            <h2 className="eyebrow mb-4 text-gold-700">Best fit for</h2>
            <ul className="divide-y divide-line border-y border-line">
              {p.bestFit.map((b) => (
                <li key={b} className="py-3 text-lg text-navy-900">
                  {b}
                </li>
              ))}
            </ul>
          </section>
        )}
        {p.approach && (
          <section>
            <h2 className="eyebrow mb-4 text-gold-700">Approach</h2>
            <p className="lede text-navy-900">{p.approach}</p>
          </section>
        )}
        {!!p.bio?.length && <RichText value={p.bio} />}
        {p.personal && (
          <section className="border-l border-gold-400 pl-6">
            <h2 className="eyebrow mb-2 text-gold-700">Beyond the clinic</h2>
            <p className="text-navy-900">{p.personal}</p>
          </section>
        )}
      </div>
      <aside className="space-y-8 lg:col-span-5">
        {!!p.services?.length && (
          <div className="border-t-2 border-teal-500 pt-5">
            <h2 className="eyebrow text-navy-900">Services offered</h2>
            <ul className="mt-4 divide-y divide-line">
              {p.services.map((s) => (
                <li key={s._id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-center justify-between gap-4 py-3 text-navy-900 hover:text-teal-700"
                  >
                    {s.title}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!!p.credentialGroups?.length && (
          <div className="border-t border-line pt-5">
            <h2 className="eyebrow text-navy-900">Credentials &amp; experience</h2>
            <dl className="mt-5 space-y-5">
              {p.credentialGroups.map((g) => (
                <div key={g._key}>
                  <dt className="text-sm font-semibold text-gold-700">{g.label}</dt>
                  <dd className="mt-1.5">
                    <ul className="space-y-1 text-[0.95rem] text-navy-900">
                      {g.items?.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </aside>
    </div>
  )
}
