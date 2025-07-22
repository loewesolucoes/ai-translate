// src/app/manifest.ts

import type { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    "id": "ai-translate",
    "name": process.env.NEXT_PUBLIC_TITLE,
    "short_name": process.env.NEXT_PUBLIC_TITLE,
    "start_url": `${process.env.BASE_PATH}/`,
    "icons": [
      {
        "src": `${process.env.BASE_PATH}/android-icon-192x192.png`,
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": `${process.env.BASE_PATH}/android-icon-512x512.png`,
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "theme_color": "#007BFF",
    "background_color": "#007BFF",
    "display": "standalone",
    "lang": "pt-br",
  };
}