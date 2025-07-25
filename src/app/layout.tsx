import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.scss";
import Script from "next/script";

const font = Poppins({ weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

const basePath = process.env.BASE_PATH || ''

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/apple-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon-16x16.png`} />
        <link rel="manifest" href={`${basePath}/manifest.webmanifest`} />
        <link rel="mask-icon" href={`${basePath}/logo.svg`} color="#007BFF" />
        <meta name="msapplication-TileColor" content="#007BFF" />
        <meta name="theme-color" content="#007BFF" />
        <Script id="gtm" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-54VR7557');
          `}
        </Script>
      </head>
      <body className={font.className}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-54VR7557" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {children}
      </body>
    </html>
  );
}


export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: process.env.NEXT_PUBLIC_TITLE,
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
    creator: process.env.NEXT_PUBLIC_CREATOR,
    applicationName: process.env.NEXT_PUBLIC_TITLE,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: process.env.NEXT_PUBLIC_TITLE,
      startupImage: process.env.NEXT_PUBLIC_IMAGE,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_TITLE,
      description: process.env.NEXT_PUBLIC_DESCRIPTION,
      type: "website",
      url: process.env.NEXT_PUBLIC_URL,
      images: process.env.NEXT_PUBLIC_IMAGE,
    },
    twitter: {
      title: process.env.NEXT_PUBLIC_TITLE,
      description: process.env.NEXT_PUBLIC_DESCRIPTION,
      card: "summary_large_image",
      site: process.env.NEXT_PUBLIC_URL,
      images: process.env.NEXT_PUBLIC_IMAGE,
    },
  }
}