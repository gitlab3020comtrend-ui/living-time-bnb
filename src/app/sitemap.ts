import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://livingtime.tw';
  const now = new Date().toISOString();

  return [
    { url: `${base}/bnb`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/bnb/rooms`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/bnb/booking`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/bnb/info`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/bnb/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
