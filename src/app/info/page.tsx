'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import LineFloatingButton from '@/components/LineFloatingButton';
import { useLocale } from '@/lib/useLocale';

export default function InfoPage() {
  const { locale, setLocale, t } = useLocale();
  const info = t.info;

  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
      <div className="pt-24 pb-20 px-5">
        <FadeIn className="text-center mb-16">
          <h1 className="section-title">{info.title}</h1>
          <p className="section-subtitle">{info.subtitle}</p>
        </FadeIn>

        <div className="max-w-3xl mx-auto space-y-16">

          {/* Check-in/out */}
          <FadeIn>
            <div className="bg-white border border-sand rounded-md p-6 md:p-8">
              <h2 className="text-xl font-bold tracking-wider mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">1</span>
                {info.checkInOut}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-sand/50 p-5 rounded-md text-center">
                  <p className="text-base text-primary/50 mb-1">CHECK IN</p>
                  <p className="text-xl font-bold tracking-wider">{info.checkInTime}</p>
                </div>
                <div className="bg-sand/50 p-5 rounded-md text-center">
                  <p className="text-base text-primary/50 mb-1">CHECK OUT</p>
                  <p className="text-xl font-bold tracking-wider">{info.checkOutTime}</p>
                </div>
              </div>
              <p className="text-base text-primary/50 tracking-wider">{info.earlyCheckin}</p>
            </div>
          </FadeIn>

          {/* Cancellation Policy */}
          <FadeIn>
            <div className="bg-white border border-sand rounded-md p-6 md:p-8">
              <h2 className="text-xl font-bold tracking-wider mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">2</span>
                {info.cancelPolicy}
              </h2>
              <div className="space-y-4">
                {info.cancelRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                    <p className="text-base tracking-wider leading-7 opacity-80">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* House Rules */}
          <FadeIn>
            <div className="bg-white border border-sand rounded-md p-6 md:p-8">
              <h2 className="text-xl font-bold tracking-wider mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">3</span>
                {info.houseRules}
              </h2>
              <div className="space-y-4">
                {info.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-2.5 shrink-0" />
                    <p className="text-base tracking-wider leading-7 opacity-80">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Directions */}
          <FadeIn>
            <div className="bg-white border border-sand rounded-md p-6 md:p-8">
              <h2 className="text-xl font-bold tracking-wider mb-2 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">4</span>
                {info.directions}
              </h2>
              <p className="text-base text-primary/50 tracking-wider mb-6 ml-11">{info.directionsSubtitle}</p>
              <div className="space-y-6">
                {info.transport.map((t, i) => (
                  <div key={i} className="border-l-2 border-accent/30 pl-5">
                    <p className="font-bold text-base tracking-wider mb-1">{t.mode}</p>
                    <p className="text-base tracking-wider leading-7 opacity-70">{t.detail}</p>
                    <p className="text-base text-accent mt-1 tracking-wider">{t.time}</p>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="mt-8 aspect-video bg-sand rounded-md overflow-hidden shadow-sm">
                <iframe
                  src="https://maps.google.com/maps?q=宜蘭縣冬山鄉柯林一路379號&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </FadeIn>

          {/* Nearby Attractions */}
          <FadeIn>
            <div>
              <h2 className="text-xl font-bold tracking-wider mb-2 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">5</span>
                {info.attractions}
              </h2>
              <p className="text-base text-primary/50 tracking-wider mb-6 ml-11">{info.attractionsSubtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.spots.map((spot: { name: string; distance: string; desc: string; url?: string }, i: number) => (
                  <FadeIn key={i} delay={i * 60}>
                    <a
                      href={spot.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-sand rounded-md p-5 hover:shadow-md hover:border-accent/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold text-base tracking-wider group-hover:text-accent transition-colors">{spot.name}</p>
                        <span className="text-base text-accent bg-accent/10 px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">{spot.distance}</span>
                      </div>
                      <p className="text-base text-primary/60 tracking-wider">{spot.desc}</p>
                      <p className="text-base text-accent/60 mt-2 flex items-center gap-1 group-hover:text-accent transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        {locale === 'zh' ? '查看詳情' : 'Learn more'}
                      </p>
                    </a>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
      <Footer t={t.footer} />
      <LineFloatingButton />
    </>
  );
}
