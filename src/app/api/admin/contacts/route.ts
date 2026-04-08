import { NextResponse } from 'next/server';
import { getContacts } from '@/lib/bookingStore';

export async function GET() {
  return NextResponse.json(getContacts());
}
