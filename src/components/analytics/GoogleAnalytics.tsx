import Script from 'next/script'

/**
 * GA4, loaded only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * IP-anonymized, no ad personalization signals; events never carry form or chat content.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  )
}
