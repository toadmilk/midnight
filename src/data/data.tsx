import { Metadata } from 'next';

export const DATA = {
    appName: 'Midnight',
  description: "Chat with your scripts, fine-tune the output, and create short-form content in minutes.",
  url: 'https://midnightai.vercel.app',
    uploadThingUrl: 'https://utfs.io/f/',
};

export function constructMetaData({
  title = DATA.appName,
  description = DATA.description,
  image = "/logo.svg",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: DATA.url,
      siteName: DATA.appName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1080,
          height: 1080,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      cardType: "summary_large_image",
      images: [image],
    },
    icons,
    metadataBase: new URL(DATA.url),
    themeColor: "#000000",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    })
  }
}