'use client';
import { useState } from 'react';
import { Locale, localeNames } from '@/lib/i18n';

interface Props {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  t: { home: string; rooms: string; booking: string; contact: string; admin: string; info?: string; order?: string };
}

export default function Navbar({ locale, onLocaleChange, t }: Props) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/', label: t.home },
    { href: '/rooms', label: t.rooms },
    { href: '/booking', label: t.booking },
    { href: '/order', label: t.order || (locale === 'zh' ? '查詢訂單' : 'My Order') },
    { href: '/info', label: t.info || (locale === 'zh' ? '住宿須知' : 'Info') },
    { href: '/contact', label: t.contact },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-cream/95 backdrop-blur-md shadow-sm text-dark">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16 md:h-16">
        <a href="/" className="text-xl md:text-lg tracking-[0.4em] font-bold text-dark hover:text-accent transition-colors">
          {locale === 'zh' ? '生活時光' : 'Living Time'}
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-base tracking-[0.15em] text-dark/70 hover:text-accent transition-colors">
              {l.label}
            </a>
          ))}
          <button onClick={() => onLocaleChange(locale === 'zh' ? 'en' : 'zh')}
            className="text-sm border border-dark/20 px-3 py-1.5 rounded-md text-dark/60 hover:border-accent hover:text-accent transition-colors">
            {localeNames[locale === 'zh' ? 'en' : 'zh']}
          </button>
        </div>
        <button className="md:hidden text-3xl text-dark/70 w-12 h-12 flex items-center justify-center" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      </div>
      {open && (
        <div className="md:hidden bg-cream border-t border-sand px-6 pb-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-4 text-xl tracking-wider text-dark/80 hover:text-accent border-b border-sand/50 last:border-0">{l.label}</a>
          ))}
          <button onClick={() => { onLocaleChange(locale === 'zh' ? 'en' : 'zh'); setOpen(false); }}
            className="mt-5 text-lg border border-dark/20 px-5 py-3.5 rounded-md text-dark/60 w-full">
            {localeNames[locale === 'zh' ? 'en' : 'zh']}
          </button>
        </div>
      )}
    </nav>
  );
}
