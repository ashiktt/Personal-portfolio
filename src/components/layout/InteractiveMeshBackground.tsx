import React, { useEffect, useRef } from 'react';

interface MorphParticle {
  // Current coordinates
  x: number;
  y: number;
  vx: number;
  vy: number;
  
  // Section formation targets
  heroX: number;
  heroY: number;
  aboutX: number;
  aboutY: number;
  skillsX: number;
  skillsY: number;
  projectsX: number;
  projectsY: number;
  certsX: number;
  certsY: number;
  contactX: number;
  contactY: number;

  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  hue: number;
  layer: number;
  pulseOffset: number;
}

export const InteractiveMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mouseRef = useRef<{
    x: number | null;
    y: number | null;
    targetX: number | null;
    targetY: number | null;
  }>({
    x: null,
    y: null,
    targetX: null,
    targetY: null,
  });

  const scrollRef = useRef<{
    currentY: number;
    targetY: number;
    velocity: number;
    sectionWeights: {
      hero: number;
      about: number;
      skills: number;
      projects: number;
      certs: number;
      contact: number;
    };
  }>({
    currentY: 0,
    targetY: 0,
    velocity: 0,
    sectionWeights: {
      hero: 1,
      about: 0,
      skills: 0,
      projects: 0,
      certs: 0,
      contact: 0,
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const particles: MorphParticle[] = [];
    const isMobile = width < 768;
    const count = isMobile ? 48 : 96;

    const computeFormations = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      particles.length = 0;

      for (let i = 0; i < count; i++) {
        const ratio = i / count;
        const angle = ratio * Math.PI * 2;
        const layer = i % 3;

        // 1. HERO FORMATION: Dual Focal Galaxy (Left narrative flow + Right profile card orbital halo)
        let heroX = 0;
        let heroY = 0;
        if (i % 2 === 0) {
          // Orbiting right profile card (x ~ 75% width, y ~ 50% height)
          const ringRad = 90 + (i % 5) * 35;
          heroX = width * 0.72 + Math.cos(angle * 2) * ringRad;
          heroY = height * 0.50 + Math.sin(angle * 2) * (ringRad * 0.85);
        } else {
          // Left sweeping curve
          heroX = width * 0.15 + (i / count) * (width * 0.4);
          heroY = height * 0.35 + Math.sin(ratio * Math.PI * 3) * (height * 0.25);
        }

        // 2. ABOUT FORMATION: Horizontal Synapse Streams
        const row = i % 4;
        const col = Math.floor(i / 4);
        const aboutX = width * 0.10 + (col / (count / 4)) * (width * 0.80) + (Math.sin(i) * 30);
        const aboutY = height * 0.25 + (row * (height * 0.16)) + Math.cos(col * 0.5) * 25;

        // 3. SKILLS & TOOLS FORMATION: Geometric Matrix Lattice (Surrounding Tool Cards)
        const cols = isMobile ? 4 : 8;
        const rows = Math.ceil(count / cols);
        const gridC = i % cols;
        const gridR = Math.floor(i / cols);
        const skillsX = width * 0.08 + (gridC / (cols - 1)) * (width * 0.84);
        const skillsY = height * 0.18 + (gridR / (rows - 1)) * (height * 0.64);

        // 4. PROJECTS FORMATION: Dual Curved Framing Arches & Horizontal Scanning Rails
        let projectsX = 0;
        let projectsY = 0;
        if (i < count * 0.4) {
          // Left bracket arch framing project cards
          const pAngle = (i / (count * 0.4)) * Math.PI - Math.PI / 2;
          projectsX = width * 0.12 + Math.cos(pAngle) * (width * 0.08);
          projectsY = height * 0.5 + Math.sin(pAngle) * (height * 0.38);
        } else if (i < count * 0.8) {
          // Right bracket arch framing project cards
          const pAngle = ((i - count * 0.4) / (count * 0.4)) * Math.PI + Math.PI / 2;
          projectsX = width * 0.88 + Math.cos(pAngle) * (width * 0.08);
          projectsY = height * 0.5 + Math.sin(pAngle) * (height * 0.38);
        } else {
          // Top & Bottom scanning beam rails
          const subR = (i - count * 0.8) / (count * 0.2);
          projectsX = width * 0.15 + subR * (width * 0.70);
          projectsY = i % 2 === 0 ? height * 0.22 : height * 0.78;
        }

        // 5. CERTIFICATES FORMATION: Orbiting Credential Crests
        const crestRadius = 140 + (i % 4) * 45;
        const certsX = width * 0.5 + Math.cos(angle) * crestRadius;
        const certsY = height * 0.5 + Math.sin(angle) * (crestRadius * 0.65);

        // 6. CONTACT FORMATION: Magnetic Convergence Vortex (Streaming into form)
        const spiralDist = 80 + Math.pow(ratio, 1.3) * (Math.min(width, height) * 0.45);
        const contactX = width * 0.5 + Math.cos(angle * 3) * spiralDist;
        const contactY = height * 0.52 + Math.sin(angle * 3) * (spiralDist * 0.75);

        const hues = [215, 225, 200, 240, 195];
        const hue = hues[i % hues.length];

        particles.push({
          x: heroX,
          y: heroY,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          heroX,
          heroY,
          aboutX,
          aboutY,
          skillsX,
          skillsY,
          projectsX,
          projectsY,
          certsX,
          certsY,
          contactX,
          contactY,
          baseRadius: layer === 2 ? 2.2 : layer === 1 ? 1.5 : 1.0,
          radius: layer === 2 ? 2.2 : layer === 1 ? 1.5 : 1.0,
          baseAlpha: layer === 2 ? 0.7 : layer === 1 ? 0.4 : 0.2,
          alpha: layer === 2 ? 0.7 : layer === 1 ? 0.4 : 0.2,
          hue,
          layer,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    computeFormations();

    // Scroll & Section Visibility Weight Calculator
    const calculateSectionWeights = () => {
      const scrollY = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight * 3
      );
      const progress = Math.min(1, Math.max(0, scrollY / (docHeight - window.innerHeight)));

      // Smooth Gaussian-like weights for sections along scroll progress
      // Hero: 0% -> About: 22% -> Skills: 45% -> Projects: 70% -> Certs: 86% -> Contact: 98%
      const calcWeight = (target: number, spread: number) => {
        const dist = Math.abs(progress - target);
        return Math.max(0, 1 - dist / spread);
      };

      const wHero = calcWeight(0.02, 0.20);
      const wAbout = calcWeight(0.24, 0.20);
      const wSkills = calcWeight(0.48, 0.20);
      const wProjects = calcWeight(0.70, 0.20);
      const wCerts = calcWeight(0.86, 0.16);
      const wContact = calcWeight(0.98, 0.16);

      const total = (wHero + wAbout + wSkills + wProjects + wCerts + wContact) || 1;

      scrollRef.current.sectionWeights = {
        hero: wHero / total,
        about: wAbout / total,
        skills: wSkills / total,
        projects: wProjects / total,
        certs: wCerts / total,
        contact: wContact / total,
      };
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollRef.current.velocity = (currentScroll - lastScrollY) * 0.3;
      lastScrollY = currentScroll;
      calculateSectionWeights();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = null;
      mouseRef.current.targetY = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.targetX = null;
      mouseRef.current.targetY = null;
    };

    window.addEventListener('resize', computeFormations, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    calculateSectionWeights();

    let time = 0;

    const render = () => {
      time += 0.016;

      // Decay scroll velocity
      scrollRef.current.velocity *= 0.90;

      // Mouse Lerp
      if (mouseRef.current.targetX !== null && mouseRef.current.targetY !== null) {
        if (mouseRef.current.x === null || mouseRef.current.y === null) {
          mouseRef.current.x = mouseRef.current.targetX;
          mouseRef.current.y = mouseRef.current.targetY;
        } else {
          mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
          mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;
        }
      } else {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
      }

      ctx.clearRect(0, 0, width, height);

      const weights = scrollRef.current.sectionWeights;
      const mouseRadius = isMobile ? 120 : 180;
      const connectionDist = isMobile ? 90 : 125;

      // -------------------------------------------------------------
      // 1. UPDATE & MORPH PARTICLES TO SECTION FORMATION
      // -------------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Blend target coordinate from all section weights
        const targetX =
          p.heroX * weights.hero +
          p.aboutX * weights.about +
          p.skillsX * weights.skills +
          p.projectsX * weights.projects +
          p.certsX * weights.certs +
          p.contactX * weights.contact;

        const targetY =
          p.heroY * weights.hero +
          p.aboutY * weights.about +
          p.skillsY * weights.skills +
          p.projectsY * weights.projects +
          p.certsY * weights.certs +
          p.contactY * weights.contact;

        // Smooth physical spring towards formation target
        p.x += (targetX - p.x) * 0.05 + Math.sin(time + p.pulseOffset) * 0.3;
        p.y += (targetY - p.y) * 0.05 + Math.cos(time + p.pulseOffset) * 0.3;

        // Mouse magnetic repulsion / interaction
        let mouseDist = Infinity;
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          mouseDist = Math.sqrt(dx * dx + dy * dy);

          if (mouseDist < mouseRadius) {
            const force = (1 - mouseDist / mouseRadius) * 26;
            p.x += (dx / mouseDist) * force * 0.15;
            p.y += (dy / mouseDist) * force * 0.15;
            p.alpha = Math.min(1, p.baseAlpha + (1 - mouseDist / mouseRadius) * 0.65);
            p.radius = p.baseRadius * (1 + (1 - mouseDist / mouseRadius) * 0.85);
          } else {
            p.alpha = p.baseAlpha + Math.sin(time * 2 + p.pulseOffset) * 0.1;
            p.radius = p.baseRadius;
          }
        } else {
          p.alpha = p.baseAlpha + Math.sin(time * 2 + p.pulseOffset) * 0.1;
          p.radius = p.baseRadius;
        }

        // Draw particle dot with soft radiant glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${Math.max(0, p.alpha)})`;
        if (p.layer === 2) {
          ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.8)`;
          ctx.shadowBlur = p.radius * 5;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Connect with nearby neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * (p.layer === 2 ? 0.24 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${lineAlpha})`;
            ctx.lineWidth = p.layer === 2 ? 0.85 : 0.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }

        // Connect with mouse cursor
        if (mouseRef.current.x !== null && mouseRef.current.y !== null && mouseDist < mouseRadius) {
          const lineAlpha = (1 - mouseDist / mouseRadius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
          ctx.lineWidth = 1.1;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
          ctx.shadowBlur = 8;
          ctx.stroke();
        }
      }

      // -------------------------------------------------------------
      // 2. DRAW PROJECTS SPECIAL SECTION FRAMING ACCENTS
      // -------------------------------------------------------------
      if (weights.projects > 0.15) {
        ctx.save();
        ctx.globalAlpha = weights.projects * 0.4;
        
        // Left & Right framing circuit brackets
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 8]);
        
        // Left bracket
        ctx.beginPath();
        ctx.moveTo(width * 0.08, height * 0.25);
        ctx.lineTo(width * 0.08, height * 0.75);
        ctx.stroke();

        // Right bracket
        ctx.beginPath();
        ctx.moveTo(width * 0.92, height * 0.25);
        ctx.lineTo(width * 0.92, height * 0.75);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', computeFormations);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Morphing Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-10 opacity-80"
      />

      {/* Atmospheric Ambient Glow Blobs */}
      <div
        className="ambient-glow -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[550px] opacity-30 animate-pulse-subtle"
        style={{
          background: 'radial-gradient(ellipse at center, #2563eb 0%, #1d4ed8 35%, #0f172a 70%, transparent 80%)',
        }}
      />

      {/* About Section Ambient Glow (Left) */}
      <div
        className="ambient-glow top-[22vh] -left-48 w-[620px] h-[620px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, #1e3a8a 50%, transparent 75%)',
        }}
      />

      {/* Skills Section Ambient Glow (Right) */}
      <div
        className="ambient-glow top-[46vh] -right-44 w-[680px] h-[680px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #4f46e5 0%, #1e1b4b 50%, transparent 75%)',
        }}
      />

      {/* Projects Section Ambient Glow (Left & Right) */}
      <div
        className="ambient-glow top-[70vh] -left-40 w-[700px] h-[700px] opacity-22"
        style={{
          background: 'radial-gradient(circle, #0284c7 0%, #1e40af 50%, transparent 75%)',
        }}
      />

      {/* Contact Section Ambient Glow (Center-Bottom) */}
      <div
        className="ambient-glow bottom-0 left-1/2 -translate-x-1/2 w-[750px] h-[480px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse, #1e40af 0%, #0c4a6e 45%, transparent 75%)',
        }}
      />

      {/* Geometric Matrix Fine Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] z-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
