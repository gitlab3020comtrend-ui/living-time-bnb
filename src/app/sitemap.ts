import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://livingtime.tw';
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/rooms`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/order`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/info`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
