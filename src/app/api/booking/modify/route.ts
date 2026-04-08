import { NextRequest, NextResponse } from 'next/server';
import { updateBooking } from '@/lib/bookingStore';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  try {
    const { id, email, name, phone, guests, note } = body as any;
    if (!id || !email) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }
    const booking = await updateBooking(id.trim(), email.trim(), { name, phone, guests, note });
    if (!booking) {
      return NextResponse.json({ error: '無法修改此訂單' }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking });
  } catch {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
