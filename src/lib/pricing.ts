import { rooms, wholeHouse } from './rooms';

/** 判斷某日期是否為假日（週五、週六入住） */
export function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  return day === 5 || day === 6; // 週五、週六
}

/** 取得入住期間每一晚的日期字串（不含退房日） */
export function getNights(checkIn: string, checkOut: string): string[] {
  const nights: string[] = [];
  const start = new Date(checkIn + 'T00:00:00');
  const end = new Date(checkOut + 'T00:00:00');
  const cur = new Date(start);
  while (cur < end) {
    nights.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return nights;
}

export interface PriceBreakdown {
  roomName: string;
  basePrice: number;
  nightCount: number;
  baseCost: number;
  weekendNights: number;
  weekendSurcharge: number;
  weekendTotal: number;
  cleaningFee: number;
  total: number;
}

export function calculatePrice(
  roomId: string,
  checkIn: string,
  checkOut: string,
): PriceBreakdown {
  const isWholeHouse = roomId === 'whole-house';
  const room = isWholeHouse ? wholeHouse : rooms.find(r => r.id === roomId);
  if (!room) throw new Error('Room not found');

  const nights = getNights(checkIn, checkOut);
  const nightCount = nights.length;
  const basePrice = room.price;
  const baseCost = basePrice * nightCount;

  const weekendNights = nights.filter(isWeekend).length;
  const weekendSurcharge = isWholeHouse ? 2000 : 500;
  const weekendTotal = weekendNights * weekendSurcharge;

  const cleaningFee = isWholeHouse ? 800 : 300;

  return {
    roomName: room.name.zh,
    basePrice,
    nightCount,
    baseCost,
    weekendNights,
    weekendSurcharge,
    weekendTotal,
    cleaningFee,
    total: baseCost + weekendTotal + cleaningFee,
  };
}
