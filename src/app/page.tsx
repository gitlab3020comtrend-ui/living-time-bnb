'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBackground from '@/components/HeroBackground';
import RoomPlaceholder from '@/components/RoomPlaceholder';
import FadeIn from '@/components/FadeIn';
import ReviewWall from '@/components/ReviewWall';
import Amenities from '@/components/Amenities';
import FAQ from '@/components/FAQ';
import ScrollToTop from '@/components/ScrollToTop';
import LineFloatingButton from '@/components/LineFloatingButton';
import { rooms } from '@/lib/rooms';
import { useLocale } from '@/lib/useLocale';

export default function Home() {
  const { locale, setLocale, t } = useLocale();
  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{ background: '#A07850' }}>
        <HeroBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-lg md:text-base tracking-[0.5em] mb-4 opacity-0 animate-[fadeSlideUp_1s_0.3s_forwards]">{t.hero.subtitle}</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[0.4em] mb-6 opacity-0 animate-[fadeSlideUp_1s_0.6s_forwards]">{t.hero.title}</h1>
          <div className="w-16 h-[1px] bg-accent mx-auto mb-6 opacity-0 animate-[fadeIn_1s_1s_forwards]" />
          <p className="text-lg md:text-lg tracking-wider opacity-0 mb-10 animate-[fadeSlideUp_1s_1.2s_forwards]">{t.hero.description}</p>
          <a href="/rooms" className="btn-primary opacity-0 animate-[fadeSlideUp_1s_1.5s_forwards]">{t.hero.cta}</a>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-[1px] h-12 bg-accent opacity-40 animate-pulse" />
        </div>
      </section>
      {/* About */}
      <section className="py-28 px-6">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h2 className="section-title">{t.about.title}</h2>
          <div className="divider" />
          <p className="text-lg md:text-lg leading-8 tracking-wider opacity-80">{t.about.description}</p>
        </FadeIn>
      </section>
      {/* Room Preview */}
      <section className="py-28 px-6 bg-white">
        <FadeIn><h2 className="section-title">{t.rooms.title}</h2><p className="section-subtitle">{t.rooms.subtitle}</p></FadeIn>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, idx) => (
            <FadeIn key={room.id} delay={idx * 100} direction="up">
              <a href={`/rooms#${room.id}`} className="group cursor-pointer block">
                <div className="aspect-[4/3] overflow-hidden mb-4 rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                    <RoomPlaceholder name={room.name[locale]} variant={idx} />
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-wider mb-1 group-hover:text-primary transition-colors">{room.name[locale]}</h3>
                <p className="text-lg text-primary tracking-wider">NT$ {room.price.toLocaleString()} {t.rooms.perNight} · {room.capacity}{t.rooms.person}</p>
              </a>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={600} className="text-center mt-14">
          <a href="/booking" className="btn-outline">{t.booking.title}</a>
        </FadeIn>
      </section>
      {/* Amenities */}
      <Amenities title={t.amenities.title} subtitle={t.amenities.subtitle} items={t.amenities.items as unknown as {icon: string; label: string; desc: string}[]} />

      {/* Reviews */}
      <ReviewWall locale={locale} title={t.reviews.title} subtitle={t.reviews.subtitle} />

      {/* FAQ */}
      <FAQ locale={locale} title={t.faq.title} subtitle={t.faq.subtitle} />

      {/* Map */}
      <section className="py-28 px-6 bg-white">
        <FadeIn className="max-w-4xl mx-auto text-center">
          <h2 className="section-title">{t.contact.title}</h2>
          <div className="divider" />
          <p className="text-base tracking-wider opacity-70 mb-8">{t.contact.addressValue}</p>
          <div className="aspect-video bg-sand rounded-sm overflow-hidden shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=宜蘭縣冬山鄉柯林一路379號&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </FadeIn>
      </section>
      <Footer t={t.footer} />
      <ScrollToTop />
      <LineFloatingButton />
    </>
  );
}
