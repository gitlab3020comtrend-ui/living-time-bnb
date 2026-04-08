'use client';

interface PriceBreakdown {
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

interface Props {
  breakdown: PriceBreakdown;
  checkIn: string;
  checkOut: string;
  locale: 'zh' | 'en';
}

function fmt(n: number) {
  return n.toLocaleString();
}

export default function PriceSummary({ breakdown, checkIn, checkOut, locale }: Props) {
  const b = breakdown;
  const isZh = locale === 'zh';

  return (
    <div className="bg-white border border-sand rounded-sm p-6">
      <h3 className="text-base font-bold tracking-wider mb-4">
        {isZh ? '訂單明細' : 'Order Summary'}
      </h3>

      <div className="space-y-3 text-base">
        {/* Room & Dates */}
        <div className="pb-3 border-b border-sand">
          <p className="font-bold tracking-wider">{b.roomName}</p>
          <p className="text-base text-primary/60 mt-1">
            {checkIn} → {checkOut}
            <span className="ml-2">
              ({b.nightCount} {isZh ? '晚' : b.nightCount > 1 ? 'nights' : 'night'})
            </span>
          </p>
        </div>

        {/* Base Price */}
        <div className="flex justify-between">
          <span className="text-primary/70">
            {isZh ? '房價' : 'Room rate'} NT$ {fmt(b.basePrice)} × {b.nightCount}
          </span>
          <span>NT$ {fmt(b.baseCost)}</span>
        </div>

        {/* Weekend Surcharge */}
        {b.weekendNights > 0 && (
          <div className="flex justify-between">
            <span className="text-primary/70">
              {isZh ? '假日加價' : 'Weekend surcharge'} NT$ {fmt(b.weekendSurcharge)} × {b.weekendNights}
            </span>
            <span>NT$ {fmt(b.weekendTotal)}</span>
          </div>
        )}

        {/* Cleaning Fee */}
        <div className="flex justify-between">
          <span className="text-primary/70">{isZh ? '清潔費' : 'Cleaning fee'}</span>
          <span>NT$ {fmt(b.cleaningFee)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-sand font-bold text-base">
          <span>{isZh ? '合計' : 'Total'}</span>
          <span className="text-primary">NT$ {fmt(b.total)}</span>
        </div>
      </div>
    </div>
  );
}
