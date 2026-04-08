import { NextRequest, NextResponse } from 'next/server';
import { getBookings, updateBookingStatus } from '@/lib/bookingStore';

export async function GET() {
  return NextResponse.json(getBookings());
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const ok = updateBookingStatus(id, status);
  return NextResponse.json({ success: ok });
}
