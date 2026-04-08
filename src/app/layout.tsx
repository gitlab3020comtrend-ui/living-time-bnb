import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '生活時光 Living Time | 宜蘭冬山民宿',
  description: '宜蘭冬山柯林，安農溪畔的靜謐民宿。6間日式簡約客房，讓旅人在自然中找到放鬆。線上訂房、包棟服務。',
  keywords: '宜蘭民宿, 冬山民宿, 安農溪民宿, 宜蘭住宿, 包棟民宿, 日式民宿, Living Time, 生活時光',
  openGraph: {
    title: '生活時光 Living Time | 宜蘭冬山民宿',
    description: '宜蘭冬山柯林，安農溪畔的靜謐民宿。6間日式簡約客房，讓旅人在自然中找到放鬆。',
    type: 'website',
    locale: 'zh_TW',
    siteName: '生活時光民宿',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://livingtime.tw' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: '生活時光民宿 Living Time B&B',
  description: '宜蘭冬山柯林，安農溪畔的靜謐民宿。6間日式簡約客房。',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '柯林一路379號',
    addressLocality: '冬山鄉',
    addressRegion: '宜蘭縣',
    postalCode: '269',
    addressCountry: 'TW',
  },
  telephone: '+886-912-345-678',
  priceRange: 'NT$ 2,200 - NT$ 16,800',
  starRating: { '@type': 'Rating', ratingValue: '4.8' },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Breakfast Included', value: true },
  ],
  checkinTime: '15:00',
  checkoutTime: '11:00',
  numberOfRooms: 6,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
