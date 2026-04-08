import { NextRequest, NextResponse } from 'next/server';
import { getBookings, updateBookingStatus, verifyAdminToken } from '@/lib/bookingStore';

function checkAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  return verifyAdminToken(token);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: '未授權' }, { status: 401 });
  return NextResponse.json(getBookings());
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: '未授權' }, { status: 401 });
  const { id, status } = await req.json();
  const ok = updateBookingStatus(id, status);
  return NextResponse.json({ success: ok });
}
