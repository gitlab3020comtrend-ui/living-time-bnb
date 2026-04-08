import { NextRequest, NextResponse } from 'next/server';
import { cancelBookingByGuest } from '@/lib/bookingStore';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  try {
    const { id, email } = body as any;
    if (!id || !email) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }
    const ok = await cancelBookingByGuest(id.trim(), email.trim());
    if (!ok) {
      return NextResponse.json({ error: '無法取消此訂單' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
