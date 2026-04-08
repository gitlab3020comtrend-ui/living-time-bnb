import { NextRequest, NextResponse } from 'next/server';
import { getBookingByIdAndEmail } from '@/lib/bookingStore';

export async function POST(req: NextRequest) {
  try {
    const { id, email } = await req.json();
    if (!id || !email) {
      return NextResponse.json({ error: '請輸入訂單編號與 Email' }, { status: 400 });
    }
    const booking = getBookingByIdAndEmail(id.trim(), email.trim());
    if (!booking) {
      return NextResponse.json({ error: '查無此訂單，請確認訂單編號與 Email 是否正確' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
