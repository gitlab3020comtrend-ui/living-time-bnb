import { NextRequest, NextResponse } from 'next/server';
import { addContact } from '@/lib/bookingStore';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  try {
    const { name, email, message } = body as any;
    if (!name || !email || !message) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }
    const contact = await addContact({ name, email, message });
    return NextResponse.json({ success: true, contact });
  } catch (e) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
