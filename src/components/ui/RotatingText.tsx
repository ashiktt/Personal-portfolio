import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
  gradient?: boolean;
  pauseOnHover?: boolean;
}

export const RotatingText: React.FC<RotatingTextProps> = ({
  words,
  interval = 3000,
  className = '',
  gradient = false,
  pauseOnHover = true,
}) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter out any empty words
  const validWords = words.filter((w) => Boolean(w && w.trim()));
  const currentWord = validWords[index % validWords.length] || '';

  useEffect(() => {
    if (validWords.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % validWords.length);
    }, interval);

    return () => clearInterval(timer);
  }, [validWords.length, interval, isPaused]);

  if (validWords.length === 0) return null;
  if (validWords.length === 1) {
    return <span className={className}>{validWords[0]}</span>;
  }

  return (
    <span
      className={`inline-flex items-center overflow-hidden align-middle relative ${className}`}
      style={{ perspective: 1000 }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      aria-label={currentWord}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${index}-${currentWord}`}
          initial={{
            y: '100%',
            opacity: 0,
            rotateX: -70,
            filter: 'blur(6px)',
          }}
          animate={{
            y: '0%',
            opacity: 1,
            rotateX: 0,
            filter: 'blur(0px)',
          }}
          exit={{
            y: '-100%',
            opacity: 0,
            rotateX: 70,
            filter: 'blur(6px)',
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            transformStyle: 'preserve-3d',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
          className={
            gradient
              ? 'bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent'
              : ''
          }
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
