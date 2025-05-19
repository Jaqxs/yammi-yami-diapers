import Script from "next/script"

export function AnalyticsHeadScript() {
  return (
    <>
      {/* Google tag (gtag.js) - Exactly as provided by user */}
      <Script strategy="beforeInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-DWP5DBLY4P" />
      <Script
        id="google-analytics-head"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', 'G-DWP5DBLY4P');
          `,
        }}
      />
    </>
  )
}
