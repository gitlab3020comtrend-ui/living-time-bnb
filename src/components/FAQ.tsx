'use client';
import { useState } from 'react';
import FadeIn from './FadeIn';

interface FAQItem {
  q: string;
  a: string;
}

const faqData: Record<'zh' | 'en', FAQItem[]> = {
  zh: [
    { q: '入住與退房時間？', a: '入住時間為下午 3:00 後，退房時間為上午 11:00 前。如需提早入住或延後退房，請事先聯繫我們，將視房況安排。' },
    { q: '可以攜帶寵物嗎？', a: '歡迎攜帶寵物入住，請於訂房時事先告知。酌收清潔費 NT$ 300，請自備寵物用品並注意環境清潔。' },
    { q: '有提供停車場嗎？', a: '有的，民宿提供免費專屬停車場，可容納約 6-8 台車輛。包棟旅客不需擔心停車問題。' },
    { q: '早餐如何供應？', a: '我們每天提供手作早餐，使用宜蘭在地食材。供餐時間為上午 8:00 至 9:30。如有飲食限制請提前告知。' },
    { q: '如何取消訂房？', a: '入住日 7 天前可全額退費，3-6 天前退還 50%，2 天內恕不退費。如遇颱風等不可抗力因素，可全額退費或改期。' },
    { q: '附近有什麼景點？', a: '步行 5 分鐘可達安農溪分洪堰風景區。車程 10 分鐘內有梅花湖、冬山河生態綠舟。羅東夜市約 12 分鐘車程。更多景點請參閱住宿須知頁面。' },
    { q: '有提供接站服務嗎？', a: '有的，如搭乘火車至羅東站，請於訂房時告知到站時間，我們提供免費接站服務。' },
    { q: '包棟有什麼優惠？', a: '包棟價 NT$ 16,800/晚（原價 NT$ 19,200），含 6 間客房、所有公共空間、庭園與廚房使用權，最多可容納 18 人。' },
  ],
  en: [
    { q: 'Check-in and check-out times?', a: 'Check-in is after 3:00 PM, check-out before 11:00 AM. Early check-in or late check-out may be arranged upon request, subject to availability.' },
    { q: 'Are pets allowed?', a: 'Yes! Pets are welcome with prior notice. A cleaning fee of NT$ 300 applies. Please bring your own pet supplies.' },
    { q: 'Is parking available?', a: 'Yes, we offer free private parking for 6-8 vehicles. Whole-house guests have ample parking space.' },
    { q: 'What about breakfast?', a: 'We serve homemade breakfast daily using local Yilan ingredients, from 8:00 to 9:30 AM. Please let us know about any dietary restrictions.' },
    { q: 'What is the cancellation policy?', a: 'Full refund 7+ days before check-in, 50% refund 3-6 days before, no refund within 2 days. Force majeure events allow full refund or rescheduling.' },
    { q: 'What attractions are nearby?', a: 'Annong River Park is a 5-minute walk. Meihua Lake and Dongshan River Eco Park are within 10 minutes by car. Luodong Night Market is 12 minutes away.' },
    { q: 'Do you offer pickup service?', a: 'Yes! Free pickup from Luodong Station is available. Please provide your arrival time when booking.' },
    { q: 'What does whole-house rental include?', a: 'NT$ 16,800/night (regular NT$ 19,200) includes all 6 rooms, common areas, garden, and kitchen access for up to 18 guests.' },
  ],
};

interface Props {
  locale: 'zh' | 'en';
  title: string;
  subtitle: string;
}

export default function FAQ({ locale, title, subtitle }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const items = faqData[locale];

  return (
    <section className="py-28 px-6 bg-sand/30">
      <FadeIn className="text-center">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </FadeIn>
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, i) => (
          <FadeIn key={i} delay={i * 50}>
            <div className="bg-white rounded-sm border border-sand overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-sand/20 transition"
              >
                <span className="text-base font-bold tracking-wider pr-4">{item.q}</span>
                <span className={`text-primary/40 transition-transform ${openIdx === i ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5">
                  <p className="text-base leading-7 tracking-wider text-primary/70">{item.a}</p>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
