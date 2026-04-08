'use client';
import { useState } from 'react';
import FadeIn from './FadeIn';

interface Review {
  name: string;
  date: string;
  rating: number;
  text: { zh: string; en: string };
  source: string;
}

const reviews: Review[] = [
  {
    name: '林小姐',
    date: '2026-03',
    rating: 5,
    text: {
      zh: '環境非常安靜，早上被鳥叫聲叫醒。閣樓套房的窗景超美，可以看到安農溪和遠山。老闆親切又用心，早餐好吃，推薦給想放鬆的人！',
      en: 'Incredibly peaceful. Woke up to birdsong. The loft suite has stunning views of Annong River and distant mountains. Wonderful host and delicious breakfast!',
    },
    source: 'Google',
  },
  {
    name: 'Jason W.',
    date: '2026-02',
    rating: 5,
    text: {
      zh: '帶全家來包棟過年，小朋友超開心可以在庭園玩。房間乾淨舒適，整體氛圍很日式很放鬆。冬山河離這裡也很近，行程安排很方便。',
      en: 'Booked the whole house for Chinese New Year. Kids loved the garden. Rooms were clean and cozy with a lovely Japanese aesthetic. Very close to Dongshan River.',
    },
    source: 'Google',
  },
  {
    name: '陳先生',
    date: '2026-01',
    rating: 5,
    text: {
      zh: '和室房很有特色，榻榻米躺著很舒服。附近很多田園風景可以散步拍照，非常療癒。民宿主人很親切，給了很多在地美食推薦。',
      en: 'The tatami room is amazing. Very comfortable sleeping on tatami mats. Beautiful countryside walks nearby. The host gave great local food tips.',
    },
    source: 'Google',
  },
  {
    name: 'Emily C.',
    date: '2025-12',
    rating: 4,
    text: {
      zh: '兩人套房空間適中，很適合情侶小旅行。唯一小建議是隔音可以再加強，但整體住宿體驗很好。會再回來的！',
      en: 'Double suite is perfect for a couple\'s getaway. Only minor note is soundproofing could be better, but overall a wonderful stay. Will return!',
    },
    source: 'Booking.com',
  },
  {
    name: '黃太太',
    date: '2025-11',
    rating: 5,
    text: {
      zh: '第二次來了，還是一樣舒適。這次住4人套房A，空間很大，兩張雙人床都很好睡。冬山真的是個放慢腳步的好地方。',
      en: 'Second visit and still love it. Stayed in Quad Suite A this time — spacious room with two comfortable double beds. Dongshan is the perfect place to slow down.',
    },
    source: 'Google',
  },
  {
    name: 'David L.',
    date: '2025-10',
    rating: 5,
    text: {
      zh: '出差宜蘭時住了閣樓雅房，雖然是共用衛浴但很乾淨。環境安靜很好入睡，CP值很高。下次出差還會再來。',
      en: 'Stayed in the loft standard for a business trip. Shared bathroom was very clean. Quiet and great value. Will definitely stay again on my next trip.',
    },
    source: 'Google',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-accent tracking-wider">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

interface Props {
  locale: 'zh' | 'en';
  title: string;
  subtitle: string;
}

export default function ReviewWall({ locale, title, subtitle }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-28 px-6">
      <FadeIn className="text-center">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </FadeIn>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((r, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-base tracking-wider">{r.name}</p>
                  <p className="text-base text-primary/40">{r.date}</p>
                </div>
                <span className="text-base text-primary/40 bg-sand px-2 py-1 rounded-sm">{r.source}</span>
              </div>
              <Stars count={r.rating} />
              <p className="text-base leading-7 tracking-wider mt-3 opacity-80 flex-1">
                {r.text[locale]}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      {reviews.length > 3 && (
        <FadeIn className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-outline"
          >
            {showAll
              ? (locale === 'zh' ? '收起' : 'Show Less')
              : (locale === 'zh' ? '查看更多評價' : 'View More Reviews')
            }
          </button>
        </FadeIn>
      )}

      {/* Google Review CTA */}
      <FadeIn className="text-center mt-6">
        <a
          href="https://www.google.com/maps/place/宜蘭縣冬山鄉柯林一路379號"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-primary/50 hover:text-primary transition-colors tracking-wider"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          {locale === 'zh' ? '在 Google 地圖上查看更多評論' : 'See more reviews on Google Maps'}
        </a>
      </FadeIn>
    </section>
  );
}
