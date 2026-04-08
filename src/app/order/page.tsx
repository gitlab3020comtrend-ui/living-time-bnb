'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import PriceSummary from '@/components/PriceSummary';
import { useLocale } from '@/lib/useLocale';

interface Booking {
  id: string; roomId: string; checkIn: string; checkOut: string;
  guests: number; name: string; email: string; phone: string; note: string;
  totalPrice?: number; priceBreakdown?: {
    roomName?: string; nightCount?: number; basePrice?: number; baseCost?: number;
    weekendNights?: number; weekendSurcharge?: number; weekendTotal?: number;
    cleaningFee?: number; total?: number;
  };
  createdAt: string; status: string;
}

export default function OrderPage() {
  const { locale, setLocale, t } = useLocale();
  const isZh = locale === 'zh';

  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGuests, setEditGuests] = useState(2);
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Cancel
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [message, setMessage] = useState('');

  async function handleLookup() {
    if (!orderId.trim() || !email.trim()) {
      setError(isZh ? '請輸入訂單編號與 Email' : 'Please enter order number and email');
      return;
    }
    setLoading(true);
    setError('');
    setBooking(null);
    setMessage('');
    try {
      const res = await fetch('/api/booking/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data);
      } else {
        setError(data.error || (isZh ? '查無此訂單' : 'Order not found'));
      }
    } catch {
      setError(isZh ? '網路錯誤，請稍後再試' : 'Network error, please try again');
    } finally {
      setLoading(false);
    }
  }

  function startEdit() {
    if (!booking) return;
    setEditName(booking.name);
    setEditPhone(booking.phone);
    setEditGuests(booking.guests);
    setEditNote(booking.note);
    setEditing(true);
    setMessage('');
  }

  async function handleSave() {
    if (!booking) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/booking/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: booking.id, email: email.trim(),
          name: editName, phone: editPhone, guests: editGuests, note: editNote,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBooking(data.booking);
        setEditing(false);
        setMessage(isZh ? '修改已儲存' : 'Changes saved');
      } else {
        setError(data.error || (isZh ? '修改失敗' : 'Failed to save'));
      }
    } catch {
      setError(isZh ? '網路錯誤' : 'Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!booking) return;
    setCancelling(true);
    setError('');
    try {
      const res = await fetch('/api/booking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBooking({ ...booking, status: 'cancelled' });
        setShowCancelConfirm(false);
        setMessage(isZh ? '訂單已取消' : 'Order cancelled');
      } else {
        setError(data.error || (isZh ? '取消失敗' : 'Failed to cancel'));
      }
    } catch {
      setError(isZh ? '網路錯誤' : 'Network error');
    } finally {
      setCancelling(false);
    }
  }

  const statusLabels: Record<string, { zh: string; en: string }> = {
    pending: { zh: '待確認', en: 'Pending' },
    confirmed: { zh: '已確認', en: 'Confirmed' },
    cancelled: { zh: '已取消', en: 'Cancelled' },
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} t={t.nav} />
      <div className="pt-24 pb-20 px-6">
        <FadeIn className="text-center mb-8">
          <h1 className="section-title">{isZh ? '查詢訂單' : 'Order Lookup'}</h1>
          <p className="section-subtitle">{isZh ? '輸入訂單編號與 Email 查看訂單狀態' : 'Enter your order number and email to check status'}</p>
        </FadeIn>

        <div className="max-w-lg mx-auto">
          {/* Lookup Form */}
          {!booking && (
            <FadeIn>
              <div className="bg-white border border-sand rounded-sm p-6 space-y-4">
                <div>
                  <label className="text-base tracking-wider block mb-2">{isZh ? '訂單編號' : 'Order Number'} *</label>
                  <input
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                    placeholder={isZh ? '例：B1712345678901' : 'e.g. B1712345678901'}
                    className="input-field font-mono"
                  />
                </div>
                <div>
                  <label className="text-base tracking-wider block mb-2">Email *</label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder={isZh ? '訂房時填寫的 Email' : 'Email used for booking'}
                    className="input-field"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-base text-red-700">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleLookup}
                  disabled={loading}
                  className="w-full py-3 text-base tracking-[0.2em] border border-accent bg-accent text-white hover:bg-primary hover:border-primary transition-all disabled:opacity-50"
                >
                  {loading ? '...' : (isZh ? '查詢' : 'Look Up')}
                </button>
              </div>
            </FadeIn>
          )}

          {/* Booking Detail */}
          {booking && (
            <FadeIn>
              {/* Status Badge */}
              <div className="text-center mb-6">
                <span className={`inline-block px-4 py-1.5 text-sm rounded-full tracking-wider ${statusColors[booking.status] || 'bg-gray-100'}`}>
                  {statusLabels[booking.status]?.[locale] || booking.status}
                </span>
              </div>

              {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-sm text-base text-green-700 text-center">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-base text-red-700">
                  {error}
                </div>
              )}

              {/* Order Info */}
              <div className="bg-white border border-sand rounded-sm p-6 mb-4">
                <p className="text-base text-primary/50 mb-1">{isZh ? '訂單編號' : 'Order No.'}</p>
                <p className="font-mono font-bold text-lg tracking-wider mb-4">{booking.id}</p>

                {booking.priceBreakdown && (
                  <PriceSummary
                    breakdown={booking.priceBreakdown as any}
                    checkIn={booking.checkIn}
                    checkOut={booking.checkOut}
                    locale={locale}
                  />
                )}
              </div>

              {/* Guest Info (view or edit) */}
              <div className="bg-white border border-sand rounded-sm p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold tracking-wider">
                    {isZh ? '入住資料' : 'Guest Information'}
                  </h3>
                  {!editing && booking.status !== 'cancelled' && (
                    <button onClick={startEdit} className="text-sm text-accent hover:underline tracking-wider">
                      {isZh ? '修改' : 'Edit'}
                    </button>
                  )}
                </div>

                {!editing ? (
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between">
                      <span className="text-primary/60">{t.booking.name}</span>
                      <span>{booking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">{t.booking.phone}</span>
                      <span>{booking.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">{t.booking.email}</span>
                      <span>{booking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">{t.booking.guests}</span>
                      <span>{booking.guests} {isZh ? '人' : 'guests'}</span>
                    </div>
                    {booking.note && (
                      <div className="flex justify-between">
                        <span className="text-primary/60">{t.booking.note}</span>
                        <span className="text-right max-w-[60%]">{booking.note}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-primary/60">{isZh ? '建立時間' : 'Created'}</span>
                      <span className="text-sm">{new Date(booking.createdAt).toLocaleString(isZh ? 'zh-TW' : 'en-US')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm tracking-wider block mb-1">{t.booking.name} *</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm tracking-wider block mb-1">{t.booking.phone} *</label>
                      <input value={editPhone} onChange={e => setEditPhone(e.target.value)} type="tel" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm tracking-wider block mb-1">{t.booking.guests}</label>
                      <input value={editGuests} onChange={e => setEditGuests(Number(e.target.value) || 1)} type="number" min={1} className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm tracking-wider block mb-1">{t.booking.note}</label>
                      <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={3} className="input-field" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSave} disabled={saving || !editName.trim() || !editPhone.trim()}
                        className="flex-1 py-2.5 text-sm tracking-[0.15em] bg-accent text-white border border-accent hover:bg-primary hover:border-primary transition-all disabled:opacity-50">
                        {saving ? '...' : (isZh ? '儲存修改' : 'Save')}
                      </button>
                      <button onClick={() => { setEditing(false); setError(''); }}
                        className="flex-1 py-2.5 text-sm tracking-[0.15em] border border-primary/30 text-primary hover:border-primary transition-all">
                        {isZh ? '取消' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cancel Order */}
              {booking.status !== 'cancelled' && !editing && (
                <div className="mb-4">
                  {!showCancelConfirm ? (
                    <button onClick={() => setShowCancelConfirm(true)}
                      className="w-full py-3 text-base tracking-[0.15em] border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-all rounded-sm">
                      {isZh ? '取消訂單' : 'Cancel Order'}
                    </button>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-sm p-5">
                      <p className="text-base text-red-700 mb-4">
                        {isZh ? '確定要取消此訂單嗎？取消後無法恢復。' : 'Are you sure you want to cancel? This cannot be undone.'}
                      </p>
                      <div className="flex gap-3">
                        <button onClick={handleCancel} disabled={cancelling}
                          className="flex-1 py-2.5 text-sm tracking-wider bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50 rounded-sm">
                          {cancelling ? '...' : (isZh ? '確認取消' : 'Yes, Cancel')}
                        </button>
                        <button onClick={() => setShowCancelConfirm(false)}
                          className="flex-1 py-2.5 text-sm tracking-wider border border-primary/30 text-primary hover:border-primary transition-all rounded-sm">
                          {isZh ? '保留訂單' : 'Keep Order'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Back button */}
              <button onClick={() => { setBooking(null); setError(''); setMessage(''); setEditing(false); setShowCancelConfirm(false); }}
                className="w-full py-3 text-base tracking-[0.2em] border border-primary/30 text-primary hover:border-primary transition-all">
                {isZh ? '查詢其他訂單' : 'Look Up Another Order'}
              </button>
            </FadeIn>
          )}
        </div>
      </div>
      <Footer t={t.footer} />
    </>
  );
}
