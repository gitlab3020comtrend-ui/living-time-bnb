'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import RoomPlaceholder from '@/components/RoomPlaceholder';
import { rooms, wholeHouse } from '@/lib/rooms';
import { useLocale } from '@/lib/useLocale';

export default function RoomsPage() {
  const { locale, setLocale, t } = useLocale();
  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
      <div className="pt-24 pb-20 px-6">
        <FadeIn className="text-center mb-16">
          <h1 className="section-title">{t.rooms.title}</h1>
          <p className="section-subtitle">{t.rooms.subtitle}</p>
        </FadeIn>
        <div className="max-w-5xl mx-auto space-y-20">
          {rooms.map((room, idx) => (
            <FadeIn key={room.id} direction={idx % 2 === 0 ? 'left' : 'right'}>
              <div id={room.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                <div className="w-full md:w-1/2 aspect-[4/3] rounded-sm overflow-hidden shadow-md">
                  <RoomPlaceholder name={room.name[locale]} variant={idx} />
                </div>
                <div className="w-full md:w-1/2">
                  <h2 className="text-2xl font-bold tracking-wider mb-3">{room.name[locale]}</h2>
                  <p className="text-lg md:text-base leading-7 tracking-wider opacity-70 mb-4">{room.description[locale]}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features[locale].map((f) => (
                      <span key={f} className="text-lg md:text-base px-3 py-1.5 bg-sand rounded-full tracking-wider">{f}</span>
                    ))}
                  </div>
                  <p className="text-primary font-bold tracking-wider mb-4">
                    NT$ {room.price.toLocaleString()} {t.rooms.perNight} · {room.capacity}{t.rooms.person}
                  </p>
                  <a href="/bnb/booking" className="btn-primary">{t.rooms.bookNow}</a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Whole House Section */}
        <div className="max-w-5xl mx-auto mt-24">
          <FadeIn className="text-center mb-12">
            <h2 className="section-title">{t.rooms.wholeHouseTitle}</h2>
            <p className="section-subtitle">{t.rooms.wholeHouseSubtitle}</p>
          </FadeIn>
          <FadeIn>
            <div className="border border-primary/20 rounded-sm p-8 md:p-12 bg-sand/50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold tracking-wider mb-3">{wholeHouse.name[locale]}</h3>
                <p className="text-lg md:text-base leading-7 tracking-wider opacity-70 max-w-2xl mx-auto">{wholeHouse.description[locale]}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {wholeHouse.features[locale].map((f) => (
                  <span key={f} className="text-lg md:text-base px-3 py-1.5 bg-white/80 rounded-full tracking-wider">{f}</span>
                ))}
              </div>
              <div className="text-center">
                <p className="text-primary text-2xl font-bold tracking-wider mb-1">
                  NT$ {wholeHouse.price.toLocaleString()} {t.rooms.perNight}
                </p>
                <p className="text-base opacity-50 tracking-wider mb-6">{t.rooms.wholeHouseDiscount}</p>
                <a href="/bnb/booking" className="btn-primary">{t.rooms.wholeHouseBook}</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
      <Footer t={t.footer} />
    </>
  );
}
