'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import BookingCalendar from '@/components/BookingCalendar';
import BookingSteps from '@/components/BookingSteps';
import PriceSummary from '@/components/PriceSummary';
import { rooms, wholeHouse } from '@/lib/rooms';
import { useLocale } from '@/lib/useLocale';

// Client-side price calculation (mirrors server pricing.ts)
function isWeekend(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay() === 5 || d.getDay() === 6;
}

function getNights(checkIn: string, checkOut: string) {
  const nights: string[] = [];
  const cur = new Date(checkIn + 'T00:00:00');
  const end = new Date(checkOut + 'T00:00:00');
  while (cur < end) {
    nights.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return nights;
}

function calcPrice(roomId: string, checkIn: string, checkOut: string) {
  const isWH = roomId === 'whole-house';
  const room = isWH ? wholeHouse : rooms.find(r => r.id === roomId);
  if (!room) return null;
  const nights = getNights(checkIn, checkOut);
  const nightCount = nights.length;
  const basePrice = room.price;
  const baseCost = basePrice * nightCount;
  const weekendNights = nights.filter(isWeekend).length;
  const weekendSurcharge = isWH ? 2000 : 500;
  const weekendTotal = weekendNights * weekendSurcharge;
  const cleaningFee = isWH ? 800 : 300;
  return {
    roomName: room.name.zh,
    basePrice, nightCount, baseCost,
    weekendNights, weekendSurcharge, weekendTotal,
    cleaningFee, total: baseCost + weekendTotal + cleaningFee,
  };
}

export default function BookingPage() {
  const { locale, setLocale, t } = useLocale();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<'room' | 'whole-house'>('room');
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam === 'whole-house') {
      setMode('whole-house');
    } else if (roomParam && rooms.some(r => r.id === roomParam)) {
      setMode('room');
      setRoomId(roomParam);
    }
  }, [searchParams]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedId, setConfirmedId] = useState('');

  const effectiveRoomId = mode === 'whole-house' ? 'whole-house' : roomId;
  const calendarRoomId = mode === 'whole-house' ? 'whole-house' : (roomId || rooms[0].id);

  const breakdown = useMemo(() => {
    if (!effectiveRoomId || !checkIn || !checkOut) return null;
    return calcPrice(effectiveRoomId, checkIn, checkOut);
  }, [effectiveRoomId, checkIn, checkOut]);

  const canStep1 = checkIn && checkOut && effectiveRoomId && (mode === 'whole-house' || roomId);
  const canStep2 = name.trim() && phone.trim() && email.trim();

  function handleDateSelect(ci: string, co: string) {
    setCheckIn(ci);
    setCheckOut(co);
    setError('');
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: effectiveRoomId, checkIn, checkOut,
          guests, name, email, phone, note,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedId(data.booking.id);
      } else {
        setError(data.error || '送出失敗，請稍後再試');
        if (res.status === 409) setStep(1);
      }
    } catch {
      setError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  }

  // ── Confirmed Page ──
  if (confirmedId) {
    return (
      <>
        <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
        <div className="pt-24 pb-20 px-6">
          <FadeIn className="max-w-lg mx-auto text-center">
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-bold tracking-[0.2em] mb-2">{t.booking.confirmTitle}</h1>
            <p className="text-base text-primary/60 tracking-wider mb-8">{t.booking.confirmSubtitle}</p>

            <div className="bg-white border border-sand rounded-sm p-6 text-left mb-6">
              <p className="text-base text-primary/50 mb-1">{t.booking.orderNo}</p>
              <p className="font-mono font-bold text-lg tracking-wider mb-4">{confirmedId}</p>

              {breakdown && (
                <PriceSummary breakdown={breakdown} checkIn={checkIn} checkOut={checkOut} locale={locale} />
              )}
            </div>

            <div className="bg-sand/50 border border-sand rounded-sm p-6 text-left mb-6">
              <h3 className="text-base font-bold tracking-wider mb-4">{t.booking.bankInfo}</h3>
              <div className="space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-primary/60">{t.booking.bankName}</span>
                  <span>{t.booking.bankNameValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/60">{t.booking.bankAccount}</span>
                  <span className="font-mono">{t.booking.bankAccountValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/60">{t.booking.bankHolder}</span>
                  <span>{t.booking.bankHolderValue}</span>
                </div>
              </div>
              <p className="text-base text-primary/50 mt-4 leading-5">{t.booking.bankNote}</p>
            </div>

            <p className="text-base text-primary/50 mb-6">{t.booking.emailSent}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/" className="btn-primary">{t.booking.backHome}</a>
              <a href="/order" className="btn-outline">
                {locale === 'zh' ? '查詢訂單' : 'Check Order Status'}
              </a>
            </div>
          </FadeIn>
        </div>
        <Footer t={t.footer} />
      </>
    );
  }

  // ── Booking Flow ──
  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
      <div className="pt-24 pb-20 px-6">
        <FadeIn className="text-center mb-6">
          <h1 className="section-title">{t.booking.title}</h1>
          <p className="section-subtitle">{t.booking.subtitle}</p>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          <BookingSteps current={step} labels={[t.booking.step1, t.booking.step2, t.booking.step3]} />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-base text-red-700">
              {error}
            </div>
          )}

          {/* ── Step 1: Date & Room ── */}
          {step === 1 && (
            <FadeIn>
              {/* Mode Toggle */}
              <div className="mb-6">
                <label className="text-base tracking-wider block mb-3">{t.booking.bookingMode}</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setMode('room'); setCheckIn(''); setCheckOut(''); }}
                    className={`flex-1 py-3 px-4 text-base tracking-wider rounded-sm border transition-all ${mode === 'room' ? 'bg-primary text-white border-primary' : 'bg-transparent border-primary/30 hover:border-primary/60'}`}>
                    {t.booking.modeRoom}
                  </button>
                  <button type="button" onClick={() => { setMode('whole-house'); setCheckIn(''); setCheckOut(''); }}
                    className={`flex-1 py-3 px-4 text-base tracking-wider rounded-sm border transition-all ${mode === 'whole-house' ? 'bg-primary text-white border-primary' : 'bg-transparent border-primary/30 hover:border-primary/60'}`}>
                    {t.booking.modeWholeHouse}
                  </button>
                </div>
              </div>

              {/* Whole House Banner */}
              {mode === 'whole-house' && (
                <div className="mb-6 p-5 bg-sand rounded-sm border border-primary/10">
                  <p className="text-base font-bold tracking-wider mb-1">{wholeHouse.name[locale]}</p>
                  <p className="text-base opacity-70 tracking-wider mb-2">{t.booking.wholeHouseDesc}</p>
                  <p className="text-primary font-bold tracking-wider">
                    NT$ {wholeHouse.price.toLocaleString()} {t.rooms.perNight}
                  </p>
                </div>
              )}

              {/* Room Selector */}
              {mode === 'room' && (
                <div className="mb-6">
                  <label className="text-base tracking-wider block mb-2">{t.booking.roomType}</label>
                  <select
                    value={roomId}
                    onChange={e => { setRoomId(e.target.value); setCheckIn(''); setCheckOut(''); }}
                    className="input-field"
                  >
                    <option value="">{t.booking.selectRoom}</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name[locale]} - NT$ {r.price.toLocaleString()} / {locale === 'zh' ? '晚' : 'night'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Calendar */}
              {(mode === 'whole-house' || roomId) && (
                <div className="bg-white border border-sand rounded-sm p-4 md:p-6 mb-6">
                  <p className="text-base text-primary/50 tracking-wider mb-4">{t.booking.selectDates}</p>
                  <BookingCalendar
                    roomId={calendarRoomId}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onSelect={handleDateSelect}
                    locale={locale}
                  />
                </div>
              )}

              {/* Selected Range Display */}
              {checkIn && (
                <div className="mb-6 p-4 bg-sand/50 rounded-sm text-base tracking-wider">
                  <span className="text-primary/60">{t.booking.checkIn}：</span>
                  <span className="font-bold">{checkIn}</span>
                  {checkOut && (
                    <>
                      <span className="text-primary/60 mx-2">→</span>
                      <span className="text-primary/60">{t.booking.checkOut}：</span>
                      <span className="font-bold">{checkOut}</span>
                      <span className="text-primary/50 ml-2">
                        ({breakdown?.nightCount} {t.booking.nights})
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Weekend Note */}
              <p className="text-base text-primary/40 mb-6">{t.booking.weekendNote}</p>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!canStep1}
                  onClick={() => setStep(2)}
                  className={`px-8 py-3 text-base tracking-[0.2em] border transition-all ${canStep1 ? 'border-accent text-accent hover:bg-accent hover:text-white' : 'border-sand text-primary/30 cursor-not-allowed'}`}
                >
                  {t.booking.next} →
                </button>
              </div>
            </FadeIn>
          )}

          {/* ── Step 2: Guest Info ── */}
          {step === 2 && (
            <FadeIn>
              <div className="space-y-5">
                <div>
                  <label className="text-base tracking-wider block mb-2">{t.booking.name} *</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="input-field" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-base tracking-wider block mb-2">{t.booking.phone} *</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="input-field" required />
                  </div>
                  <div>
                    <label className="text-base tracking-wider block mb-2">{t.booking.email} *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="input-field" required />
                  </div>
                </div>
                <div>
                  <label className="text-base tracking-wider block mb-2">{t.booking.guests}</label>
                  <input
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value) || 1)}
                    type="number"
                    min={1}
                    max={mode === 'whole-house' ? 18 : (rooms.find(r => r.id === roomId)?.capacity || 6)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-base tracking-wider block mb-2">{t.booking.note}</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="input-field" />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setStep(1)}
                  className="px-8 py-3 text-base tracking-[0.2em] border border-primary/30 text-primary hover:border-primary transition-all">
                  ← {t.booking.prev}
                </button>
                <button
                  type="button"
                  disabled={!canStep2}
                  onClick={() => setStep(3)}
                  className={`px-8 py-3 text-base tracking-[0.2em] border transition-all ${canStep2 ? 'border-accent text-accent hover:bg-accent hover:text-white' : 'border-sand text-primary/30 cursor-not-allowed'}`}
                >
                  {t.booking.next} →
                </button>
              </div>
            </FadeIn>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && breakdown && (
            <FadeIn>
              {/* Price Summary */}
              <PriceSummary breakdown={breakdown} checkIn={checkIn} checkOut={checkOut} locale={locale} />

              {/* Guest Info Review */}
              <div className="bg-white border border-sand rounded-sm p-6 mt-4">
                <h3 className="text-base font-bold tracking-wider mb-4">
                  {locale === 'zh' ? '入住資料' : 'Guest Information'}
                </h3>
                <div className="space-y-2 text-base">
                  <div className="flex justify-between">
                    <span className="text-primary/60">{t.booking.name}</span>
                    <span>{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/60">{t.booking.phone}</span>
                    <span>{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/60">{t.booking.email}</span>
                    <span>{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/60">{t.booking.guests}</span>
                    <span>{guests} {locale === 'zh' ? '人' : 'guests'}</span>
                  </div>
                  {note && (
                    <div className="flex justify-between">
                      <span className="text-primary/60">{t.booking.note}</span>
                      <span className="text-right max-w-[60%]">{note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Transfer Note */}
              <div className="mt-4 p-4 bg-sand/30 rounded-sm text-base text-primary/50 leading-5">
                {locale === 'zh'
                  ? '送出後將顯示匯款資訊，請於 3 日內完成匯款。我們確認收款後將以 Email 通知。'
                  : 'After submission, bank transfer details will be shown. Please complete payment within 3 days.'}
              </div>

              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setStep(2)}
                  className="px-8 py-3 text-base tracking-[0.2em] border border-primary/30 text-primary hover:border-primary transition-all">
                  ← {t.booking.prev}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="px-8 py-3 text-base tracking-[0.2em] border border-accent bg-accent text-white hover:bg-primary hover:border-primary transition-all disabled:opacity-50"
                >
                  {loading ? '...' : t.booking.submit}
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
      <Footer t={t.footer} />
    </>
  );
}
