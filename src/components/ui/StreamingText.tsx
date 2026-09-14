import React, { useEffect, useState } from 'react';

const __STREAM_STYLES = `
:root {
  --stream-gap: 60ms;
  --stream-fade: 350ms;
  --stream-blur: 4px;
  --stream-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-stream {
  display: inline;
}

.t-stream-w {
  display: inline-block;
  opacity: 0;
  filter: blur(var(--stream-blur));
  transition:
    opacity var(--stream-fade) var(--stream-ease),
    filter var(--stream-fade) var(--stream-ease),
    transform var(--stream-fade) var(--stream-ease);
  transform: translateY(2px);
  will-change: opacity, filter, transform;
}

.t-stream-w.is-in {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .t-stream-w {
    transition: none !important;
    filter: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('transitions-stream-text')) {
  const __style = document.createElement('style');
  __style.id = 'transitions-stream-text';
  __style.textContent = __STREAM_STYLES;
  document.head.appendChild(__style);
}

interface StreamingTextProps {
  text: string;
  className?: string;
  gap?: number;
  fade?: number;
  blur?: number;
  delay?: number;
  replayOnTextChange?: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  className = '',
  gap = 60,
  fade = 350,
  blur = 4,
  delay = 100,
  replayOnTextChange = true,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(0);

  // Split text into words preserving linebreaks / spacing
  const words = text.split(/(\s+)/);

  useEffect(() => {
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Stagger each word to resolve with soft blur
    const startTimer = setTimeout(() => {
      let wordIndex = 0;
      words.forEach((chunk, idx) => {
        // If it's a word (not just whitespace), stagger its appearance
        if (!/^\s+$/.test(chunk)) {
          const t = setTimeout(() => {
            setVisibleCount((prev) => Math.max(prev, idx + 1));
          }, wordIndex * gap);
          timers.push(t);
          wordIndex++;
        } else {
          // Whitespace resolves immediately with its preceding word
          setVisibleCount((prev) => Math.max(prev, idx + 1));
        }
      });
    }, delay);

    timers.push(startTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [text, gap, delay, replayOnTextChange]);

  return (
    <span
      className={`t-stream ${className}`}
      style={
        {
          '--stream-gap': `${gap}ms`,
          '--stream-fade': `${fade}ms`,
          '--stream-blur': `${blur}px`,
        } as React.CSSProperties
      }
      aria-label={text}
    >
      {words.map((chunk, idx) => {
        const isWhitespace = /^\s+$/.test(chunk);
        if (isWhitespace) {
          return chunk;
        }

        const isVisible = idx < visibleCount;

        return (
          <span
            key={idx}
            className={`t-stream-w ${isVisible ? 'is-in' : ''}`}
            aria-hidden="true"
          >
            {chunk}
          </span>
        );
      })}
    </span>
  );
};
