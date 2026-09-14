import React, { useEffect, useState, useRef, useCallback } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleClassName?: string;
  characters?: string;
  speed?: number; // ms per tick
  cyclesPerChar?: number; // iterations per letter before resolving
  delay?: number; // initial delay in ms
  triggerOnHover?: boolean; // replay effect on mouse hover
  autoStart?: boolean;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#';

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  scrambleClassName = 'text-blue-400 font-mono font-medium',
  characters = DEFAULT_CHARS,
  speed = 28,
  cyclesPerChar = 2,
  delay = 0,
  triggerOnHover = true,
  autoStart = true,
}) => {
  const [displayText, setDisplayText] = useState<{ char: string; isScrambled: boolean }[]>(() =>
    text.split('').map((char) => ({ char, isScrambled: false }))
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameCountRef = useRef(0);

  const startScramble = useCallback(() => {
    // Respect reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text.split('').map((char) => ({ char, isScrambled: false })));
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsAnimating(true);
    frameCountRef.current = 0;

    const run = () => {
      const targetLength = text.length;

      intervalRef.current = setInterval(() => {
        frameCountRef.current += 1;
        const currentProgress = frameCountRef.current;

        const resolvedCount = Math.floor(currentProgress / cyclesPerChar);

        const newDisplay = text.split('').map((targetChar, index) => {
          if (targetChar === ' ' || targetChar === '\n') {
            return { char: targetChar, isScrambled: false };
          }

          if (index < resolvedCount) {
            return { char: targetChar, isScrambled: false };
          }

          // Random scrambled glyph for pending positions
          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          return { char: randomChar, isScrambled: true };
        });

        setDisplayText(newDisplay);

        if (resolvedCount >= targetLength) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsAnimating(false);
          setDisplayText(text.split('').map((char) => ({ char, isScrambled: false })));
        }
      }, speed);
    };

    if (delay > 0) {
      timeoutRef.current = setTimeout(run, delay);
    } else {
      run();
    }
  }, [text, characters, speed, cyclesPerChar, delay]);

  useEffect(() => {
    if (autoStart) {
      startScramble();
    } else {
      setDisplayText(text.split('').map((char) => ({ char, isScrambled: false })));
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, startScramble, autoStart]);

  const handleMouseEnter = () => {
    if (triggerOnHover && !isAnimating) {
      startScramble();
    }
  };

  return (
    <span
      className={`inline-block select-none cursor-default ${className}`}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      {displayText.map((item, idx) => (
        <span
          key={idx}
          className={item.isScrambled ? scrambleClassName : undefined}
          aria-hidden="true"
        >
          {item.char}
        </span>
      ))}
    </span>
  );
};
