import React from 'react';

export const BackgroundGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top primary glow orb */}
      <div
        className="ambient-glow -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, #2563eb 0%, #1d4ed8 35%, #0f172a 70%, transparent 80%)',
        }}
      />

      {/* Hero left accent glow orb */}
      <div
        className="ambient-glow top-60 -left-40 w-[550px] h-[550px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, #1e3a8a 50%, transparent 75%)',
        }}
      />

      {/* Projects section subtle deep indigo glow orb */}
      <div
        className="ambient-glow top-[1400px] -right-32 w-[650px] h-[650px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #4f46e5 0%, #1e1b4b 50%, transparent 75%)',
        }}
      />

      {/* Contact section bottom glow orb */}
      <div
        className="ambient-glow bottom-0 left-1/3 w-[600px] h-[400px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse, #1e40af 0%, #0c4a6e 40%, transparent 70%)',
        }}
      />

      {/* Subtle modern Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
