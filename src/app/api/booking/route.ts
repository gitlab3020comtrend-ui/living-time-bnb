import { NextRequest, NextResponse } from 'next/server';
import { addBooking, hasConflict } from '@/lib/bookingStore';
import { calculatePrice } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  try {
    const { roomId, checkIn, checkOut, guests, name, email, phone, note } = body as any;
    if (!roomId || !checkIn || !checkOut || !name || !email || !phone) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }

    if (checkIn >= checkOut) {
      return NextResponse.json({ error: '退房日期必須晚於入住日期' }, { status: 400 });
    }

    if (await hasConflict(roomId, checkIn, checkOut)) {
      return NextResponse.json({ error: '所選日期已被預訂，請選擇其他日期' }, { status: 409 });
    }

    const breakdown = calculatePrice(roomId, checkIn, checkOut);

    const guestDefault = roomId === 'whole-house' ? 10 : 2;
    const booking = await addBooking({
      roomId,
      checkIn,
      checkOut,
      guests: Number(guests) || guestDefault,
      name,
      email,
      phone: phone || '',
      note: note || '',
      totalPrice: breakdown.total,
      priceBreakdown: breakdown as unknown as Record<string, unknown>,
    });

    return NextResponse.json({ success: true, booking });
  } catch (e) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
