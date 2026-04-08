import { NextRequest, NextResponse } from 'next/server';
import { addContact } from '@/lib/bookingStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }
    const contact = addContact({ name, email, message });
    return NextResponse.json({ success: true, contact });
  } catch (e) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
