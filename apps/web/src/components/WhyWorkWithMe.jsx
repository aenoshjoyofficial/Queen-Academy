import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rocket, Sparkles, Zap } from "lucide-react";
import TextSplitter from "./TextSplitter";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const ACCENT_COLOR = "#D4AF37";

const features = [
  {
    icon: Sparkles,
    title: "Haute Couture Discipline",
    description: "Master catwalk choreography, posture perfection, and stage presence coached by international runway directors.",
  },
  {
    icon: Zap,
    title: "Agency Contract Placement",
    description: "Direct scouting access and introductions to premier modeling agencies across New York, Paris, Milan, and Tokyo.",
  },
  {
    icon: Rocket,
    title: "Editorial & Portfolio Mastery",
    description: "Build an agency-ready high-fashion comp card and portfolio under the direction of industry-leading editorial photographers.",
  },
];

export default function WhyWorkWithMe() {
  const lineSpansRef = useRef([]);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    gsap.set(lineSpansRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
    });
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      gsap.set(".work-card", { opacity: 1, yPercent: 0 });
      return;
    }

    const tween = gsap.fromTo(
      ".work-card",
      { opacity: 0, yPercent: 10 },
      {
        opacity: 1,
        yPercent: 0,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#work-with-me",
          start: "top 60%",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReduced]);

  const handleMouseEnter = (idx) => {
    const el = lineSpansRef.current[idx];
    if (el) {
      gsap.killTweensOf(el);
      gsap.set(el, { transformOrigin: "left center" });
      gsap.to(el, { scaleX: 1, duration: 0.55, ease: "power2.out" });
    }
  };

  const handleMouseLeave = (idx) => {
    const el = lineSpansRef.current[idx];
    if (el) {
      gsap.killTweensOf(el);
      gsap.set(el, { transformOrigin: "right center" });
      gsap.to(el, { scaleX: 0, duration: 0.55, ease: "power2.out" });
    }
  };

  return (
    <section
      className="relative w-full bg-[#0A0A0C] text-[#F7F5F0] pt-[25vw] pb-[10vw] max-[1025px]:pt-[65vw]"
      id="work-with-me"
    >
      <div className="text-center mb-[5vw] max-md:mb-[10vw]">
        <TextSplitter stagger={0.015}>
          <h2 className="text-[5.5vw] max-[1025px]:text-[7vw] max-md:text-[9vw] font-medium text-[#F7F5F0]">
            The Queens Standard
          </h2>
        </TextSplitter>
        <TextSplitter splitBy="lines">
          <p className="text-[1.25vw] text-[#B8B6B0] mt-[1.5vw] max-[1025px]:text-[2.5vw] max-md:text-[4.5vw] max-md:mt-[2vw]">
            Where Raw Potential Meets Haute Couture Discipline
          </p>
        </TextSplitter>
      </div>

      <div className="grid grid-cols-3 max-[1025px]:grid-cols-1">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              className="relative px-[4vw] pt-[2vw] pb-[3vw] h-[32vw] flex flex-col justify-between work-card max-[1025px]:h-auto max-[1025px]:py-[6vw] max-[1025px]:px-[5vw]"
            >
              <div>
                <Icon
                  size={50}
                  color={ACCENT_COLOR}
                  strokeWidth={1.5}
                  className="mb-[2.5vw] max-[1025px]:mb-[4vw]"
                />
                <h3 className="text-[2vw] font-normal mb-[2.5vw] max-[1025px]:text-[4.2vw] max-md:text-[5.8vw] max-[1025px]:mb-[2vw] text-[#F7F5F0]">
                  {item.title}
                </h3>
                <p className="text-[1.25vw] leading-normal text-[#B8B6B0] max-[1025px]:text-[2.8vw] max-md:text-[4vw]">
                  {item.description}
                </p>
              </div>

              <div className="relative mt-[3vw] h-px w-full bg-[#3A3937]">
                <span
                  ref={(el) => (lineSpansRef.current[idx] = el)}
                  className="absolute inset-0 h-px w-full will-change-transform"
                  style={{ backgroundColor: ACCENT_COLOR }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
