'use client';
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8C88A" /><stop offset="30%" stopColor="#D4A96A" />
            <stop offset="60%" stopColor="#C49565" /><stop offset="85%" stopColor="#A07850" />
            <stop offset="100%" stopColor="#7A6B52" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B9E7A" stopOpacity="0.5" /><stop offset="100%" stopColor="#5A6B4A" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#sky)" />
        {/* Distant mountains */}
        <path d="M0 480 Q200 350 400 400 Q600 300 800 370 Q1000 290 1200 350 Q1350 310 1440 380 L1440 900 L0 900Z" fill="#7A6B52" opacity="0.35" />
        {/* Mid mountains */}
        <path d="M0 540 Q300 420 600 480 Q900 390 1200 450 L1440 420 L1440 900 L0 900Z" fill="#5A6B4A" opacity="0.4" />
        {/* Rice fields */}
        <path d="M0 620 Q360 590 720 600 Q1080 580 1440 610 L1440 700 L0 700Z" fill="#8B9E7A" opacity="0.5" />
        {/* River */}
        <path d="M0 700 Q360 680 720 695 Q1080 675 1440 690 L1440 900 L0 900Z" fill="url(#water)" />
        {/* Sun */}
        <circle cx="300" cy="200" r="60" fill="#F5E6C8" opacity="0.9" />
        <circle cx="300" cy="200" r="80" fill="#F5E6C8" opacity="0.15" />
        <circle cx="300" cy="200" r="110" fill="#F5E6C8" opacity="0.06" />
      </svg>
    </div>
  );
}
