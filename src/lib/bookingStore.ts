import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const BOOKINGS_FILE = join(DATA_DIR, 'bookings.json');
const CONTACTS_FILE = join(DATA_DIR, 'contacts.json');

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file: string): any[] {
  ensureDir();
  if (!existsSync(file)) return [];
  try { return JSON.parse(readFileSync(file, 'utf-8')); } catch { return []; }
}

function writeJson(file: string, data: any[]) {
  ensureDir();
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export interface Booking {
  id: string; roomId: string; checkIn: string; checkOut: string;
  guests: number; name: string; email: string; phone: string; note: string;
  totalPrice?: number; priceBreakdown?: Record<string, unknown>;
  createdAt: string; status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Contact {
  id: string; name: string; email: string; message: string; createdAt: string; read: boolean;
}

export function addBooking(b: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
  const bookings = readJson(BOOKINGS_FILE);
  const entry: Booking = { ...b, id: `B${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' };
  bookings.unshift(entry);
  writeJson(BOOKINGS_FILE, bookings);
  return entry;
}

export function getBookings(): Booking[] { return readJson(BOOKINGS_FILE); }

export function updateBookingStatus(id: string, status: Booking['status']): boolean {
  const bookings = readJson(BOOKINGS_FILE);
  const idx = bookings.findIndex((b: Booking) => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = status;
  writeJson(BOOKINGS_FILE, bookings);
  return true;
}

export function addContact(c: Omit<Contact, 'id' | 'createdAt' | 'read'>): Contact {
  const contacts = readJson(CONTACTS_FILE);
  const entry: Contact = { ...c, id: `C${Date.now()}`, createdAt: new Date().toISOString(), read: false };
  contacts.unshift(entry);
  writeJson(CONTACTS_FILE, contacts);
  return entry;
}

export function getBookedDates(roomId: string, month: string): string[] {
  const bookings = readJson(BOOKINGS_FILE) as Booking[];
  const dates: string[] = [];
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    // Match specific room or whole-house blocks all rooms
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

export function hasConflict(roomId: string, checkIn: string, checkOut: string): boolean {
  const bookings = readJson(BOOKINGS_FILE) as Booking[];
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    if (b.roomId !== roomId && b.roomId !== 'whole-house' && roomId !== 'whole-house') continue;
    // Overlap check: existing [b.checkIn, b.checkOut) overlaps [checkIn, checkOut)
    if (b.checkIn < checkOut && b.checkOut > checkIn) return true;
  }
  return false;
}

export function getBookingById(id: string): Booking | undefined {
  const bookings = readJson(BOOKINGS_FILE) as Booking[];
  return bookings.find(b => b.id === id);
}

export function getBookingByIdAndEmail(id: string, email: string): Booking | undefined {
  const bookings = readJson(BOOKINGS_FILE) as Booking[];
  return bookings.find(b => b.id === id && b.email.toLowerCase() === email.toLowerCase());
}

export function updateBooking(id: string, email: string, updates: Partial<Pick<Booking, 'name' | 'phone' | 'guests' | 'note'>>): Booking | null {
  const bookings = readJson(BOOKINGS_FILE) as Booking[];
  const idx = bookings.findIndex(b => b.id === id && b.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return null;
  if (bookings[idx].status === 'cancelled') return null;
  const allowed: (keyof typeof updates)[] = ['name', 'phone', 'guests', 'note'];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      (bookings[idx] as any)[key] = updates[key];
    }
  }
  writeJson(BOOKINGS_FILE, bookings);
  return bookings[idx];
}

export function cancelBookingByGuest(id: string, email: string): boolean {
  const bookings = readJson(BOOKINGS_FILE) as Booking[];
  const idx = bookings.findIndex(b => b.id === id && b.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return false;
  if (bookings[idx].status === 'cancelled') return false;
  bookings[idx].status = 'cancelled';
  writeJson(BOOKINGS_FILE, bookings);
  return true;
}

export function getContacts(): Contact[] { return readJson(CONTACTS_FILE); }

export function markContactRead(id: string): boolean {
  const contacts = readJson(CONTACTS_FILE);
  const idx = contacts.findIndex((c: Contact) => c.id === id);
  if (idx === -1) return false;
  contacts[idx].read = true;
  writeJson(CONTACTS_FILE, contacts);
  return true;
}
