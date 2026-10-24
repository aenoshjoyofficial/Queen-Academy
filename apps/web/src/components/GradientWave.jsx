import React, { useEffect, useRef } from "react";

/**
 * GradientWave Component
 * Renders an animated, transparent gradient wave effect on HTML5 Canvas.
 * Leaves the container's underlying background colors and textures intact.
 */
export default function GradientWave({
  className = "",
  colors = [
    // Layer 1 (Top Wave) - Champagne Gold (#F0C888) with delicate shimmer
    {
      stop0: "rgba(240, 200, 136, 0.50)",
      stop1: "rgba(240, 200, 136, 0.02)",
      stroke: "rgba(255, 228, 172, 0.75)",
      lineWidth: 1.5,
    },
    // Layer 2 (Upper-Middle) - Royal Imperial Gold (#D4AF37)
    {
      stop0: "rgba(212, 175, 55, 0.44)",
      stop1: "rgba(212, 175, 55, 0.03)",
      stroke: "rgba(235, 198, 85, 0.70)",
      lineWidth: 1.35,
    },
    // Layer 3 (Lower-Middle) - Antique Bronze Gold (#B38A3E) with warm glow
    {
      stop0: "rgba(179, 138, 62, 0.38)",
      stop1: "rgba(179, 138, 62, 0.02)",
      stroke: "rgba(202, 158, 76, 0.60)",
      lineWidth: 1.25,
    },
    // Layer 4 (Base Wave) - Noir Smoked Obsidian (#0A0A0C / #1C1914 blend)
    {
      stop0: "rgba(130, 102, 48, 0.30)",
      stop1: "rgba(10, 10, 12, 0.0)",
      stroke: "rgba(168, 132, 68, 0.45)",
      lineWidth: 1.1,
    },
  ],
  speed = 0.008,
  amplitude = 55,
  frequency = 0.0018,
  opacity = 0.65,
  blendMode = "screen",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = null;
    let step = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const render = () => {
      step += speed;
      ctx.clearRect(0, 0, width, height);

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      colors.forEach((color, index) => {
        const waveIndex = index + 1;
        const total = colors.length;
        const phase = step * (0.8 + waveIndex * 0.22) + waveIndex * 1.35;
        const currentAmp = amplitude * (0.75 + waveIndex * 0.25);
        const currentFreq = frequency * (0.75 + waveIndex * 0.2);

        // Distribute waves across the entire height of the screen (from near top to bottom)
        const baseline = height * (0.15 + (index / (total - 1 || 1)) * 0.7);

        ctx.beginPath();
        ctx.moveTo(-40, height);

        for (let x = -40; x <= width + 40; x += 12) {
          const y =
            baseline +
            Math.sin(x * currentFreq + phase) * currentAmp +
            Math.cos(x * currentFreq * 0.65 - phase * 0.8) * (currentAmp * 0.45) +
            Math.sin(x * 0.0006 + phase * 0.3) * (currentAmp * 0.35);

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width + 40, height);
        ctx.lineTo(-40, height);
        ctx.closePath();

        // Vertical gradient fill spanning the entire screen height
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, color.stop0);
        grad.addColorStop(1, color.stop1);

        ctx.fillStyle = grad;
        ctx.fill();

        // Wave crest stroke highlight with individual layer styling
        ctx.beginPath();
        for (let x = -40; x <= width + 40; x += 12) {
          const y =
            baseline +
            Math.sin(x * currentFreq + phase) * currentAmp +
            Math.cos(x * currentFreq * 0.65 - phase * 0.8) * (currentAmp * 0.45) +
            Math.sin(x * 0.0006 + phase * 0.3) * (currentAmp * 0.35);

          if (x === -40) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.lineWidth = color.lineWidth || 1.35;
        ctx.strokeStyle = color.stroke || color.stop0;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      resizeObserver.disconnect();
    };
  }, [colors, speed, amplitude, frequency]);

  return (
    <div
      className={`absolute inset-0 w-full min-w-full h-full min-h-screen pointer-events-none overflow-hidden select-none z-1 hero-wave-bg ${className}`}
      style={{
        opacity,
        mixBlendMode: blendMode,
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
