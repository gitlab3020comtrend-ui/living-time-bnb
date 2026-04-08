import { NextRequest, NextResponse } from 'next/server';
import { adminLogin, verifyAdminToken, changeAdminPassword, adminLogout } from '@/lib/bookingStore';

// POST: login or change password
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === 'login') {
    const token = adminLogin(body.password || '');
    if (!token) return NextResponse.json({ error: '密碼錯誤' }, { status: 401 });
    return NextResponse.json({ success: true, token });
  }

  if (action === 'change-password') {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    if (!verifyAdminToken(token)) return NextResponse.json({ error: '未授權' }, { status: 401 });
    const ok = changeAdminPassword(body.oldPassword, body.newPassword);
    if (!ok) return NextResponse.json({ error: '舊密碼錯誤' }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (action === 'logout') {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    adminLogout(token);
    return NextResponse.json({ success: true });
  }

  if (action === 'verify') {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    return NextResponse.json({ valid: verifyAdminToken(token) });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
