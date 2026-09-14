import React, { useRef } from 'react';

const __TRANSITION_STYLES = `
:root {
  --tilt-perspective: 1000px;
  --tilt-return: 1000ms;
  --tilt-return-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --tilt-follow: 400ms;
  --tilt-follow-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --tilt-glare-opacity: 0.32;
  --tilt-glare-fade: 300ms;
  --tilt-glare-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-tilt {
  touch-action: pan-y;
}

.t-tilt-card {
  position: relative;
  border-radius: inherit;
  transform:
    perspective(var(--tilt-perspective))
    rotateX(var(--tilt-rx, 0deg))
    rotateY(var(--tilt-ry, 0deg));
  transform-style: preserve-3d;
  transition: transform var(--tilt-return) var(--tilt-return-ease);
  will-change: transform;
}

.t-tilt-card.is-tilting {
  transition: transform var(--tilt-follow) var(--tilt-follow-ease);
}

.t-tilt-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  mix-blend-mode: screen;
  background:
    radial-gradient(circle 95px at var(--tilt-gx, 50%) var(--tilt-gy, 50%),
      rgba(255,255,255,0.48), rgba(255,255,255,0.06) 52%, rgba(255,255,255,0) 84%),
    radial-gradient(circle 200px at var(--tilt-gx, 50%) var(--tilt-gy, 50%),
      rgba(255,255,255,0.22), rgba(255,255,255,0.04) 58%, rgba(255,255,255,0) 78%),
    radial-gradient(circle 360px at var(--tilt-gx, 50%) var(--tilt-gy, 50%),
      rgba(255,255,255,0.10), rgba(255,255,255,0) 88%);
  transition: opacity var(--tilt-glare-fade) var(--tilt-glare-ease);
  z-index: 20;
}

.t-tilt.is-hover .t-tilt-glare {
  opacity: var(--tilt-glare-opacity);
}

@media (prefers-reduced-motion: reduce) {
  .t-tilt-card { transform: none !important; transition: none !important; }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('transitions-p19')) {
  const __style = document.createElement('style');
  __style.id = 'transitions-p19';
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface TiltCardProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  max = 20,
  className = '',
  containerClassName = '',
  onClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only tilt on desktop / mouse pointers to avoid hijacking mobile touch scroll
    if (e.pointerType === 'touch') return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const r = wrap.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    wrap.classList.add('is-hover');
    card.classList.add('is-tilting');
    card.style.setProperty('--tilt-ry', ((px - 0.5) * max).toFixed(2) + 'deg');
    card.style.setProperty('--tilt-rx', ((0.5 - py) * max).toFixed(2) + 'deg');
    card.style.setProperty('--tilt-gx', (px * 100).toFixed(1) + '%');
    card.style.setProperty('--tilt-gy', (py * 100).toFixed(1) + '%');
  };

  const onLeave = () => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (wrap) wrap.classList.remove('is-hover');
    if (card) {
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`t-tilt ${containerClassName}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
    >
      <div ref={cardRef} className={`t-tilt-card ${className}`}>
        {children}
        <div className="t-tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
};
