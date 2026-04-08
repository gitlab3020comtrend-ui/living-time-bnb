import { NextRequest, NextResponse } from 'next/server';
import { adminLogin, verifyAdminToken, changeAdminPassword } from '@/lib/bookingStore';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { action } = body;

  if (action === 'login') {
    const token = await adminLogin((body.password as string) || '');
    if (!token) return NextResponse.json({ error: '密碼錯誤' }, { status: 401 });
    return NextResponse.json({ success: true, token });
  }

  if (action === 'change-password') {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    if (!verifyAdminToken(token)) return NextResponse.json({ error: '未授權' }, { status: 401 });
    const ok = await changeAdminPassword(body.oldPassword as string, body.newPassword as string);
    if (!ok) return NextResponse.json({ error: '舊密碼錯誤' }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (action === 'logout') {
    return NextResponse.json({ success: true });
  }

  if (action === 'verify') {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    return NextResponse.json({ valid: verifyAdminToken(token) });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
