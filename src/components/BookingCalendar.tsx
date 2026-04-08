'use client';
import { useState, useEffect, useCallback } from 'react';

interface Props {
  roomId: string;
  checkIn: string;
  checkOut: string;
  onSelect: (checkIn: string, checkOut: string) => void;
  locale: 'zh' | 'en';
}

const WEEKDAY_ZH = ['一', '二', '三', '四', '五', '六', '日'];
const WEEKDAY_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseDate(s: string) {
  return new Date(s + 'T00:00:00');
}

export default function BookingCalendar({ roomId, checkIn, checkOut, onSelect, locale }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn');

  const fetchAvailability = useCallback(async () => {
    if (!roomId) return;
    try {
      const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
      const res = await fetch(`/api/booking/availability?roomId=${roomId}&month=${monthStr}`);
      if (res.ok) {
        const data = await res.json();
        setBookedDates(new Set(data.bookedDates || []));
      }
    } catch { /* ignore */ }
  }, [roomId, viewYear, viewMonth]);

  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  const weekdays = locale === 'zh' ? WEEKDAY_ZH : WEEKDAY_EN;

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  }

  const monthLabel = locale === 'zh'
    ? `${viewYear} 年 ${viewMonth + 1} 月`
    : `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][viewMonth]} ${viewYear}`;

  function handleDayClick(day: number) {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    const dateObj = parseDate(dateStr);
    if (dateObj < today) return;
    if (bookedDates.has(dateStr)) return;

    if (selecting === 'checkIn') {
      onSelect(dateStr, '');
      setSelecting('checkOut');
    } else {
      if (dateStr <= checkIn) {
        // Reset: treat as new checkIn
        onSelect(dateStr, '');
        setSelecting('checkOut');
      } else {
        // Check no booked dates in range
        const start = parseDate(checkIn);
        const cur = new Date(start);
        let blocked = false;
        while (cur < dateObj) {
          const s = cur.toISOString().slice(0, 10);
          if (bookedDates.has(s)) { blocked = true; break; }
          cur.setDate(cur.getDate() + 1);
        }
        if (blocked) {
          onSelect(dateStr, '');
          setSelecting('checkOut');
        } else {
          onSelect(checkIn, dateStr);
          setSelecting('checkIn');
        }
      }
    }
  }

  function getDayClass(day: number) {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    const dateObj = parseDate(dateStr);
    const isPast = dateObj < today;
    const isBooked = bookedDates.has(dateStr);
    const isCheckIn = dateStr === checkIn;
    const isCheckOut = dateStr === checkOut;
    const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    let cls = 'relative w-full aspect-square flex items-center justify-center text-base rounded-sm transition-all ';

    if (isPast) {
      cls += 'text-primary/20 cursor-not-allowed';
    } else if (isBooked) {
      cls += 'bg-red-50 text-red-300 line-through cursor-not-allowed';
    } else if (isCheckIn || isCheckOut) {
      cls += 'bg-primary text-white font-bold cursor-pointer';
    } else if (isInRange) {
      cls += 'bg-accent/20 text-dark cursor-pointer hover:bg-accent/40';
    } else {
      cls += 'hover:bg-sand cursor-pointer';
      if (isWeekend) cls += ' text-primary/70';
    }

    return cls;
  }

  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());

  return (
    <div className="select-none">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`w-8 h-8 flex items-center justify-center rounded-sm transition ${canGoPrev ? 'hover:bg-sand text-dark' : 'text-primary/20 cursor-not-allowed'}`}
        >
          ‹
        </button>
        <span className="text-base font-bold tracking-wider">{monthLabel}</span>
        <button type="button" onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-sand text-dark transition">
          ›
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((w, i) => (
          <div key={i} className={`text-center text-base tracking-wider py-1 ${i >= 5 ? 'text-primary/50' : 'text-primary/70'}`}>
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div key={i}>
            {day ? (
              <button
                type="button"
                onClick={() => handleDayClick(day)}
                className={getDayClass(day)}
              >
                {day}
              </button>
            ) : (
              <div className="w-full aspect-square" />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-base text-primary/60">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-primary rounded-sm inline-block" />
          {locale === 'zh' ? '已選' : 'Selected'}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-accent/20 rounded-sm inline-block" />
          {locale === 'zh' ? '入住期間' : 'Stay'}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-50 border border-red-200 rounded-sm inline-block" />
          {locale === 'zh' ? '已訂滿' : 'Booked'}
        </span>
      </div>
    </div>
  );
}
