'use client';
import { useEffect, useRef, useState } from 'react';

interface Props { children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'left' | 'right'; }

export default function FadeIn({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const tr = direction === 'up' ? 'translateY(30px)' : direction === 'left' ? 'translateX(-30px)' : 'translateX(30px)';
  return (
    <div ref={ref} className={className}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : tr, transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` }}>
      {children}
    </div>
  );
}
