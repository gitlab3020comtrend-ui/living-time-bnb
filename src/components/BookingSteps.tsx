'use client';

interface Props {
  current: 1 | 2 | 3;
  labels: [string, string, string];
}

export default function BookingSteps({ current, labels }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-10">
      {labels.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            {i > 0 && (
              <div className={`w-6 md:w-12 h-[1px] ${isDone ? 'bg-primary' : 'bg-sand'}`} />
            )}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isActive ? 'bg-primary text-white' : isDone ? 'bg-primary/80 text-white' : 'bg-sand text-primary/40'
              }`}>
                {isDone ? '✓' : step}
              </div>
              <span className={`text-sm tracking-wider hidden md:inline ${
                isActive ? 'text-dark font-bold' : isDone ? 'text-primary' : 'text-primary/40'
              }`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
