'use client';
import { useState, FormEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { useLocale } from '@/lib/useLocale';

export default function ContactPage() {
  const { locale, setLocale, t } = useLocale();
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) setSuccess(true);
  }

  if (success) return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
      <div className="pt-32 pb-20 text-center"><FadeIn><p className="text-lg tracking-wider">{t.contact.success}</p></FadeIn></div>
      <Footer t={t.footer} />
    </>
  );

  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
      <div className="pt-24 pb-20 px-6">
        <FadeIn className="text-center mb-12">
          <h1 className="section-title">{t.contact.title}</h1>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </FadeIn>
        <FadeIn className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="text-base tracking-wider block mb-2">{t.contact.name}</label><input name="name" className="input-field" required /></div>
            <div><label className="text-base tracking-wider block mb-2">{t.contact.email}</label><input name="email" type="email" className="input-field" required /></div>
            <div><label className="text-base tracking-wider block mb-2">{t.contact.message}</label><textarea name="message" rows={5} className="input-field" required /></div>
            <button type="submit" className="btn-primary w-full text-center">{t.contact.submit}</button>
          </form>
        </FadeIn>

        {/* Contact Info & Map */}
        <FadeIn className="max-w-xl mx-auto mt-16">
          <div className="space-y-3 text-center mb-8">
            <p className="text-base tracking-wider"><span className="opacity-50">{t.contact.address}：</span>{t.contact.addressValue}</p>
          </div>
          <div className="aspect-video bg-sand rounded-sm overflow-hidden shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=宜蘭縣冬山鄉柯林一路379號&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </FadeIn>
      </div>
      <Footer t={t.footer} />
    </>
  );
}
