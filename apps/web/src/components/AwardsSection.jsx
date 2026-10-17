import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextSplitter from "./TextSplitter";

import award1 from "../assets/award-1.jpg";
import award2 from "../assets/award-2.jpg";
import award3 from "../assets/award-3.jpg";
import award4 from "../assets/award-4.jpg";

gsap.registerPlugin(ScrollTrigger);

// WebAudio synthesized string pluck sound setup
let audioCtx = null;
let masterGain = null;
const PITCH_FREQUENCIES = [146.83, 164.81, 196, 220, 261.63, 293.66, 329.63, 392];
let pitchIndex = 0;

function getAudioContext() {
  if (!audioCtx) {
    const AudioConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioConstructor) return null;
    audioCtx = new AudioConstructor();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.85;

    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.knee.value = 10;
    comp.ratio.value = 3;
    comp.attack.value = 0.005;
    comp.release.value = 0.2;

    masterGain.connect(comp);
    comp.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Unlock audio on any first user interaction (pointerdown, mouseenter, touchstart)
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    try {
      getAudioContext();
    } catch (_) {}
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
}

function playPluckSound(displacement) {
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    const intensity = Math.min(Math.abs(displacement) / 40, 1);
    if (intensity < 0.04) return;

    pitchIndex = (pitchIndex + 1 + Math.floor(2 * Math.random())) % PITCH_FREQUENCIES.length;
    const baseFreq = PITCH_FREQUENCIES[pitchIndex];

    const osc = ctx.createOscillator();
    const pluckGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    // Warm pluck attack and exponential decay
    pluckGain.gain.setValueAtTime(intensity * 0.45, ctx.currentTime);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);

    osc.connect(pluckGain);
    pluckGain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.15);
  } catch (err) {
    console.warn("Audio pluck error:", err);
  }
}

function StringLine({ strokeColor = "rgba(255, 255, 255, 0.4)", sound = true }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(null);
  const phaseRef = useRef(Math.PI / 2);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = (e) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const updatePath = (dy) => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;
    const width = container.offsetWidth;
    path.setAttributeNS(null, "d", `M 0 50 Q ${0.5 * width} ${50 + dy} ${width} 50`);
  };

  useEffect(() => {
    updatePath(0);
    const onResize = () => updatePath(0);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (reduced) return;
    if (sound) {
      playPluckSound(20);
    }
  };

  const handleMouseMove = (e) => {
    if (reduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relY = e.clientY - (rect.top + rect.height / 2);
    offsetRef.current = Math.max(-50, Math.min(50, relY));
    updatePath(offsetRef.current);
  };

  const handleMouseLeave = () => {
    if (reduced) return;
    if (sound && Math.abs(offsetRef.current) > 2) {
      playPluckSound(offsetRef.current);
    }

    const vibrate = () => {
      updatePath(offsetRef.current * Math.sin(phaseRef.current));
      offsetRef.current *= 0.93;
      phaseRef.current += 0.55;

      if (Math.abs(offsetRef.current) > 0.1) {
        rafRef.current = requestAnimationFrame(vibrate);
      } else {
        phaseRef.current = Math.PI / 2;
        offsetRef.current = 0;
        updatePath(0);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(vibrate);
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="string-line lineDraw">
        <span
          className="box cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <svg width="100%" height="100">
          <path ref={pathRef} strokeWidth="1.5" fill="none" stroke={strokeColor} />
        </svg>
      </div>
    </div>
  );
}

const awards = [
  {
    title: "Best Runway Academy Award",
    meta: "2026 - INTERNATIONAL FASHION COUNCIL",
    imgSrc: award1,
  },
  {
    title: "Top Model Placement Agency Partner",
    meta: "2026 - GLOBAL SCOUTING FEDERATION",
    imgSrc: award2,
  },
  {
    title: "Excellence in Pageant Coaching",
    meta: "2025 - WORLD BEAUTY ALLIANCE",
    imgSrc: award3,
  },
  {
    title: "Editorial Debut of the Year",
    meta: "2025 - HAUTE COUTURE GUILD",
    imgSrc: award4,
  },
];

export default function AwardsSection() {
  const containerRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const awardItemsRef = useRef([]);
  const stringSeparatorsRef = useRef([]);
  const awardImagesRef = useRef([]);
  const currentAwardRef = useRef(null);
  const zCounterRef = useRef(1);
  const prefersReducedRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedRef.current = mql.matches;
  }, []);

  // Enter line reveal animation on scroll
  useEffect(() => {
    stringSeparatorsRef.current.filter(Boolean).forEach((sep) => {
      gsap.to(sep, {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sep,
          start: "top 90%",
        },
      });
    });
  }, []);

  // Set initial image states
  useEffect(() => {
    awardImagesRef.current.forEach((img, idx) => {
      if (img) {
        gsap.set(img, {
          opacity: idx === 0 ? 1 : 0,
          scale: 1,
          zIndex: idx === 0 ? 1 : 0,
        });
      }
    });
  }, []);

  const selectAward = useCallback((idx) => {
    const itemEl = awardItemsRef.current[idx];
    const imageContainer = imagePreviewRef.current;
    const parent = containerRef.current;

    if (itemEl && imageContainer && parent) {
      const parentRect = parent.getBoundingClientRect();
      const itemRect = itemEl.getBoundingClientRect();
      const containerH = imageContainer.offsetHeight;
      const parentH = parent.offsetHeight;
      // Center preview vertically on the hovered award item, but clamp inside section padding
      let targetY = itemRect.top - parentRect.top - (containerH / 2) + (itemRect.height / 2);
      const maxTargetY = Math.max(0, parentH - containerH - 24);
      targetY = Math.max(16, Math.min(targetY, maxTargetY));

      if (prefersReducedRef.current) {
        gsap.set(imageContainer, { y: targetY });
      } else {
        gsap.to(imageContainer, {
          y: targetY,
          duration: 0.5,
          ease: "power3.out",
        });
      }
    }

    awardImagesRef.current.forEach((img, i) => {
      if (!img) return;
      if (i === idx) {
        zCounterRef.current += 1;
        gsap.killTweensOf(img);
        gsap.set(img, { zIndex: zCounterRef.current });
        if (prefersReducedRef.current) {
          gsap.set(img, { opacity: 1, scale: 1 });
        } else {
          gsap.fromTo(
            img,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
          );
        }
      } else {
        gsap.to(img, { opacity: 0, duration: 0.35, ease: "power2.in" });
      }
    });
  }, []);

  const checkMouseOverItem = useCallback(
    (clientX, clientY) => {
      const items = awardItemsRef.current;
      let hit = null;

      for (let i = 0; i < items.length; i++) {
        const rect = items[i]?.getBoundingClientRect();
        if (rect && clientY >= rect.top && clientY < rect.bottom && clientX >= rect.left && clientX < rect.right) {
          hit = i;
          break;
        }
      }

      if (hit !== null && hit !== currentAwardRef.current) {
        currentAwardRef.current = hit;
        selectAward(hit);
      }
    },
    [selectAward]
  );

  useEffect(() => {
    const onMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      checkMouseOverItem(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [checkMouseOverItem]);

  return (
    <section ref={containerRef} className="relative w-full bg-[#0A0A0C] text-[#F7F5F0] pt-[7vw] pb-[10vw] overflow-hidden" id="awards">
      <div className="w-full px-[4vw] max-[1025px]:px-[5vw] relative">
        <div className="w-full">
          <TextSplitter stagger={0.015}>
            <h2 className="text-[5.5vw] leading-[1.2] mb-[4vw] max-[1025px]:text-[7vw] max-md:text-[9vw] font-medium text-[#F7F5F0]">
              Accreditations and <br />Industry Honors
            </h2>
          </TextSplitter>

          <div
            className="w-full relative"
            onMouseEnter={() => {
              gsap.to(imagePreviewRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: "power2.out",
              });
            }}
            onMouseLeave={() => {
              currentAwardRef.current = null;
              gsap.to(imagePreviewRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 0.35,
                ease: "power2.out",
              });
            }}
          >
            {awards.map((award, idx) => (
              <React.Fragment key={award.title}>
                {idx !== 0 && (
                  <div
                    ref={(el) => (stringSeparatorsRef.current[idx - 1] = el)}
                    className="relative h-px w-full origin-left scale-x-0"
                  >
                    <StringLine strokeColor="#3A3937" />
                  </div>
                )}
                <div
                  ref={(el) => (awardItemsRef.current[idx] = el)}
                  onMouseEnter={() => selectAward(idx)}
                  className="relative py-8 awards-container cursor-pointer group flex flex-col justify-center max-w-[55vw] max-[1025px]:max-w-full"
                >
                  <TextSplitter splitBy="lines">
                    <h3 className="text-[1.8vw] font-normal max-[1025px]:text-[3.4vw] max-md:text-[5.5vw] group-hover:text-[#D4AF37] transition-colors text-[#F7F5F0]">
                      {award.title}
                    </h3>
                  </TextSplitter>
                  <TextSplitter splitBy="lines">
                    <p className="text-[1.25vw] tracking-wide text-[#B8B6B0] mt-3 max-[1025px]:text-[2.2vw] max-md:text-[3.6vw]">
                      {award.meta}
                    </p>
                  </TextSplitter>
                </div>
              </React.Fragment>
            ))}

            <div
              ref={(el) => (stringSeparatorsRef.current[awards.length - 1] = el)}
              className="relative h-px w-full origin-left scale-x-0"
            >
              <StringLine strokeColor="#3A3937" />
            </div>
          </div>
        </div>

        {/* Floating preview image follower */}
        <div
          ref={imagePreviewRef}
          className="w-[35vw] absolute right-[4vw] top-0 pointer-events-none opacity-0 max-[1025px]:hidden will-change-transform z-20"
        >
          <div className="w-[35vw] h-[21vw] relative bg-[#111113] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#3A3937]">
            {awards.map((award, idx) => (
              <div
                key={award.title}
                ref={(el) => (awardImagesRef.current[idx] = el)}
                className="absolute inset-0 w-full h-full will-change-transform"
              >
                <img
                  src={award.imgSrc}
                  alt={award.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
