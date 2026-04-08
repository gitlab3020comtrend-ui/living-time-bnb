import { NextRequest, NextResponse } from 'next/server';
import { getContacts, verifyAdminToken } from '@/lib/bookingStore';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  if (!verifyAdminToken(token)) return NextResponse.json({ error: '未授權' }, { status: 401 });
  return NextResponse.json(getContacts());
}
