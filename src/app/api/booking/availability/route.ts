import { NextRequest, NextResponse } from 'next/server';
import { getBookedDates } from '@/lib/bookingStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId') || '';
  const month = searchParams.get('month') || '';

  if (!roomId || !month) {
    return NextResponse.json({ error: 'Missing roomId or month' }, { status: 400 });
  }

  const bookedDates = getBookedDates(roomId, month);
  return NextResponse.json({ bookedDates });
}
