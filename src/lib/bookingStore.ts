import { createHmac } from 'crypto';

// ── Storage Abstraction ──
// Uses Vercel KV when KV_REST_API_URL is set, otherwise falls back to filesystem

const useKV = !!process.env.KV_REST_API_URL;

async function kvGet<T>(key: string, fallback: T): Promise<T> {
  if (useKV) {
    const { kv } = await import('@vercel/kv');
    const val = await kv.get<T>(key);
    return val ?? fallback;
  }
  // fs fallback for Docker/local
  const { readFileSync, existsSync, mkdirSync } = await import('fs');
  const { join } = await import('path');
  const dir = join(process.cwd(), 'data');
  const file = join(dir, `${key}.json`);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(file)) return fallback;
  try { return JSON.parse(readFileSync(file, 'utf-8')); } catch { return fallback; }
}

async function kvSet<T>(key: string, value: T): Promise<void> {
  if (useKV) {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
    return;
  }
  const { writeFileSync, existsSync, mkdirSync } = await import('fs');
  const { join } = await import('path');
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${key}.json`), JSON.stringify(value, null, 2));
}

// ── Types ──

export interface Booking {
  id: string; roomId: string; checkIn: string; checkOut: string;
  guests: number; name: string; email: string; phone: string; note: string;
  totalPrice?: number; priceBreakdown?: Record<string, unknown>;
  createdAt: string; status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Contact {
  id: string; name: string; email: string; message: string; createdAt: string; read: boolean;
}

// ── Bookings ──

export async function addBooking(b: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  const entry: Booking = { ...b, id: `B${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' };
  bookings.unshift(entry);
  await kvSet('bookings', bookings);
  return entry;
}

export async function getBookings(): Promise<Booking[]> {
  return kvGet<Booking[]>('bookings', []);
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<boolean> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  const idx = bookings.findIndex((b: Booking) => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = status;
  await kvSet('bookings', bookings);
  return true;
}

export async function addContact(c: Omit<Contact, 'id' | 'createdAt' | 'read'>): Promise<Contact> {
  const contacts = await kvGet<Contact[]>('contacts', []);
  const entry: Contact = { ...c, id: `C${Date.now()}`, createdAt: new Date().toISOString(), read: false };
  contacts.unshift(entry);
  await kvSet('contacts', contacts);
  return entry;
}

export async function getBookedDates(roomId: string, month: string): Promise<string[]> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  const dates: string[] = [];
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    if (b.roomId !== roomId && b.roomId !== 'whole-house' && roomId !== 'whole-house') continue;
    const start = new Date(b.checkIn + 'T00:00:00');
    const end = new Date(b.checkOut + 'T00:00:00');
    const cur = new Date(start);
    while (cur < end) {
      const s = cur.toISOString().slice(0, 10);
      if (s.startsWith(month)) dates.push(s);
      cur.setDate(cur.getDate() + 1);
    }
  }
  return Array.from(new Set(dates));
}

export async function hasConflict(roomId: string, checkIn: string, checkOut: string): Promise<boolean> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    if (b.roomId !== roomId && b.roomId !== 'whole-house' && roomId !== 'whole-house') continue;
    if (b.checkIn < checkOut && b.checkOut > checkIn) return true;
  }
  return false;
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  return bookings.find(b => b.id === id);
}

export async function getBookingByIdAndEmail(id: string, email: string): Promise<Booking | undefined> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  return bookings.find(b => b.id === id && b.email.toLowerCase() === email.toLowerCase());
}

export async function updateBooking(id: string, email: string, updates: Partial<Pick<Booking, 'name' | 'phone' | 'guests' | 'note'>>): Promise<Booking | null> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  const idx = bookings.findIndex(b => b.id === id && b.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return null;
  if (bookings[idx].status === 'cancelled') return null;
  const allowed: (keyof typeof updates)[] = ['name', 'phone', 'guests', 'note'];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      (bookings[idx] as any)[key] = updates[key];
    }
  }
  await kvSet('bookings', bookings);
  return bookings[idx];
}

export async function cancelBookingByGuest(id: string, email: string): Promise<boolean> {
  const bookings = await kvGet<Booking[]>('bookings', []);
  const idx = bookings.findIndex(b => b.id === id && b.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return false;
  if (bookings[idx].status === 'cancelled') return false;
  bookings[idx].status = 'cancelled';
  await kvSet('bookings', bookings);
  return true;
}

export async function getContacts(): Promise<Contact[]> {
  return kvGet<Contact[]>('contacts', []);
}

export async function markContactRead(id: string): Promise<boolean> {
  const contacts = await kvGet<Contact[]>('contacts', []);
  const idx = contacts.findIndex((c: Contact) => c.id === id);
  if (idx === -1) return false;
  contacts[idx].read = true;
  await kvSet('contacts', contacts);
  return true;
}

// ── Admin Auth (stateless, no storage needed) ──

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'bnb-admin-secret-' + ADMIN_PASSWORD;
const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000; // 24h

function hmacSign(data: string): string {
  return createHmac('sha256', ADMIN_SECRET).update(data).digest('hex');
}

export async function adminLogin(password: string): Promise<string | null> {
  const currentPw = await getEffectivePassword();
  if (!currentPw || password !== currentPw) return null;
  const ts = Date.now().toString();
  const sig = hmacSign(ts);
  return `${ts}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [ts, sig] = parts;
  const age = Date.now() - Number(ts);
  if (isNaN(age) || age < 0 || age > TOKEN_MAX_AGE) return false;
  return hmacSign(ts) === sig;
}

export async function changeAdminPassword(oldPassword: string, newPassword: string): Promise<boolean> {
  const currentPw = await getEffectivePassword();
  if (oldPassword !== currentPw) return false;
  // Store password override (works in both KV and fs)
  await kvSet('admin', { password: newPassword });
  return true;
}

async function getEffectivePassword(): Promise<string> {
  const cfg = await kvGet<{ password: string } | null>('admin', null);
  return cfg?.password || ADMIN_PASSWORD;
}

export function adminLogout(_token: string): void {
  // Stateless tokens - nothing to invalidate server-side
  // Client just removes from localStorage
}
