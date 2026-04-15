import type { Booking } from './bookingStore';
import type { PriceBreakdown } from './pricing';

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

function formatMessage(booking: Booking, breakdown: PriceBreakdown): string {
  return [
    `🏠 新訂單 ${booking.id}`,
    `房型：${breakdown.roomName}`,
    `入住：${booking.checkIn} → ${booking.checkOut}（${breakdown.nightCount} 晚）`,
    `人數：${booking.guests} 人`,
    `金額：NT$ ${breakdown.total.toLocaleString()}`,
    `姓名：${booking.name}`,
    `電話：${booking.phone}`,
    `Email：${booking.email}`,
    booking.note ? `備註：${booking.note}` : '',
  ].filter(Boolean).join('\n');
}

async function sendLineNotify(message: string): Promise<void> {
  if (!LINE_NOTIFY_TOKEN) return;
  await fetch('https://notify-api.line.me/api/notify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `message=${encodeURIComponent('\n' + message)}`,
  });
}

async function sendTelegram(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
  });
}

export async function notifyNewBooking(booking: Booking, breakdown: PriceBreakdown): Promise<void> {
  const msg = formatMessage(booking, breakdown);
  await Promise.allSettled([
    sendLineNotify(msg),
    sendTelegram(msg),
  ]);
}
