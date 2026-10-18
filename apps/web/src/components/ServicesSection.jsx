import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import TextSplitter from "./TextSplitter";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

import program1 from "../assets/program-1.jpg";
import program2 from "../assets/program-2.jpg";
import program3 from "../assets/program-3.jpg";
import program4 from "../assets/program-4.jpg";
import program5 from "../assets/program-5.jpg";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Runway & Catwalk Mastery",
    items: ["Signature Walk Coaching", "Haute Couture Pacing", "Turn & Pose Technique", "Heel & Footwork Balance"],
    href: "#",
    image: program1,
  },
  {
    title: "Editorial & Camera Posing",
    items: ["High-Fashion Angles", "Facial Expression Control", "Movement in Motion", "Studio Flash Alignment"],
    href: "#",
    image: program2,
  },
  {
    title: "Pageant & Poise Coaching",
    items: ["Q&A Public Speaking", "Stage Presence", "Evening Gown Grace", "Etiquette & Deportment"],
    href: "#",
    image: program3,
  },
  {
    title: "Comp Card & Portfolio",
    items: ["Test Shoots", "Digital Polaroids", "Book Compilation", "Personal Branding"],
    href: "#",
    image: program4,
  },
  {
    title: "Agency Placement & Career",
    items: ["Scouting Showcases", "Contract Navigation", "Global Placement", "Casting Preparation"],
    href: "#",
    image: program5,
  },
];

export default function ServicesSection() {
  const rowRef = useRef(null);
  const cardMasksRef = useRef([]);
  const arrowCirclesRef = useRef([]);
  const maskValuesRef = useRef(services.map((_, i) => ({ value: i === 0 ? 100 : -40 })));
  const prefersReduced = usePrefersReducedMotion();
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(raf);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) {
      gsap.set(rowRef.current, { clearProps: "transform" });
      return;
    }

    let tween;
    const isDesktop = window.innerWidth > 1025;
    const isTablet = window.innerWidth <= 1025 && window.innerWidth > 541;

    if (isDesktop) {
      tween = gsap.fromTo(
        rowRef.current,
        { xPercent: 70 },
        {
          xPercent: -33,
          ease: "none",
          scrollTrigger: {
            trigger: "#services",
            start: "top 20%",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    } else if (isTablet) {
      tween = gsap.fromTo(
        rowRef.current,
        { xPercent: 50 },
        {
          xPercent: -65,
          ease: "none",
          scrollTrigger: {
            trigger: "#services",
            start: "top 20%",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    } else {
      tween = gsap.fromTo(
        rowRef.current,
        { xPercent: 50 },
        {
          xPercent: -77,
          ease: "none",
          scrollTrigger: {
            trigger: "#services",
            start: "top 20%",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    }

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [prefersReduced]);

  const handleCardHover = (newIdx) => {
    if (newIdx === activeCard) return;

    const dur = 0.45 * (!prefersReduced ? 1 : 0);

    // animate out previous
    gsap.to(maskValuesRef.current[activeCard], {
      value: -40,
      duration: dur,
      ease: "power2.out",
      onUpdate: () => {
        cardMasksRef.current[activeCard]?.style.setProperty(
          "--reveal",
          `${maskValuesRef.current[activeCard].value}%`
        );
      },
    });

    // animate in new
    gsap.to(maskValuesRef.current[newIdx], {
      value: 100,
      duration: dur,
      ease: "power2.out",
      onUpdate: () => {
        cardMasksRef.current[newIdx]?.style.setProperty(
          "--reveal",
          `${maskValuesRef.current[newIdx].value}%`
        );
      },
    });

    setActiveCard(newIdx);
  };

  return (
    <section
      className={`services-section relative w-full bg-[#0A0A0C] text-[#F7F5F0] ${
        prefersReduced ? "" : "h-[275vh]"
      }`}
      id="services"
    >
      <div className="relative pt-[6vw] px-[4vw] w-[60%] max-[1025px]:w-[85%] max-md:w-full max-[1025px]:px-[5vw] max-[1025px]:pt-[15vw]">
        <TextSplitter stagger={0.015}>
          <h2 className="text-[5.5vw] leading-[1.2] max-[1025px]:text-[7vw] max-md:text-[9vw] font-medium text-[#F7F5F0]">
            Programs Designed<br />for the Runway
          </h2>
        </TextSplitter>
        <div className="w-[75%] max-[1025px]:w-full mt-[1.5vw] max-[1025px]:mt-[5vw]">
          <TextSplitter splitBy="lines">
            <p className="text-[1.25vw] max-[1025px]:text-[2.5vw] max-md:text-[4.5vw] text-[#B8B6B0]">
              From first-time aspiring talents to seasoned models polishing their signature strut, our curriculum is engineered by world-class fashion choreographers, international agency scouts, and editorial directors to prepare you for global high-fashion success.
            </p>
          </TextSplitter>
        </div>
      </div>

      <div
        className={`services-sticky ${
          prefersReduced
            ? "w-full pb-[6vw]"
            : "w-full h-screen sticky top-0 overflow-hidden flex flex-col max-md:mt-[-30vw]"
        }`}
      >
        <div className={prefersReduced ? "" : "relative flex-1 flex items-center"}>
          <div
            ref={rowRef}
            className={`services-row ${
              prefersReduced
                ? "grid grid-cols-3 gap-[1.6vw] px-[4vw] pt-[5vw] max-[1025px]:grid-cols-2 max-md:grid-cols-1"
                : "flex gap-[1.6vw] px-[4vw] will-change-transform max-[1025px]:gap-[2.5vw] max-md:gap-[6vw]"
            }`}
          >
            {services.map((item, idx) => {
              const isActive = activeCard === idx;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  onMouseEnter={() => handleCardHover(idx)}
                  className={`services-card ${
                    prefersReduced
                      ? "relative rounded-2xl p-[1.6vw] flex flex-col justify-between bg-[#1A1A1D] overflow-hidden min-h-[22vw] max-[1025px]:min-h-[32vw] max-[1025px]:p-[3vw] max-md:min-h-0 max-md:p-6 border border-[#3A3937]"
                      : "relative w-[27vw] h-[30vw] shrink-0 rounded-2xl p-[1.6vw] flex flex-col justify-between bg-[#1A1A1D] overflow-hidden max-[1025px]:w-[55vw] max-[1025px]:h-[65vw] max-[1025px]:p-[3vw] max-md:w-[82vw] max-md:h-[68vh] max-md:max-h-[500px] max-md:p-6 border border-[#3A3937] group shadow-xl"
                  }`}
                >
                  {/* Card Background Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                  />
                  {/* Subtle dark gradient overlay to ensure contrast and readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#111113]/70 to-[#1A1A1D]/50 pointer-events-none" />

                  <div
                    ref={(el) => {
                      cardMasksRef.current[idx] = el;
                      el?.style.setProperty("--reveal", `${maskValuesRef.current[idx].value}%`);
                    }}
                    className="absolute inset-0 bg-linear-to-r from-[#D4AF37]/90 to-[#B38A3E]/90 radial-mask-bg-fill pointer-events-none"
                  />

                  <div className="relative flex justify-end">
                    <div
                      ref={(el) => (arrowCirclesRef.current[idx] = el)}
                      className={`w-[3vw] h-[3vw] rounded-full flex items-center justify-center border-[#3A3937] border max-[1025px]:w-[7vw] max-[1025px]:h-[7vw] max-md:w-[9vw] max-md:h-[9vw] duration-300 ease-out overflow-hidden relative ${
                        isActive ? "bg-[#D4AF37] text-[#0A0A0C]" : "text-[#F7F5F0] bg-[#111113]"
                      }`}
                    >
                      <div className="group-hover:translate-x-[150%] group-hover:translate-y-[-150%] duration-300 ease-out">
                        <ArrowUpRight size={20} />
                      </div>
                      <div className="absolute translate-x-[-150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0 duration-300 ease-out">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-2">
                    <h3
                      className={`text-[2.5vw] font-normal mb-[1vw] max-[1025px]:text-[5vw] max-md:text-[6.5vw] transition-colors duration-300 ${
                        isActive ? "text-[#0A0A0C] font-medium" : "text-[#F7F5F0]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <ul className="space-y-[0.4vw] list-disc pl-[0.5vw] max-[1025px]:space-y-[1vw] max-md:space-y-[1.8vw]">
                      {item.items.map((subItem) => (
                        <li
                          key={subItem}
                          className={`flex items-center gap-[0.7vw] text-[1.25vw] max-[1025px]:text-[3vw] max-md:text-[4vw] transition-colors duration-300 font-medium ${
                            isActive
                              ? "text-[#1A1A1D] font-semibold"
                              : "text-[#E6E4DD] group-hover:text-[#FFFFFF]"
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full shrink-0 transition-colors duration-300 ${
                              isActive
                                ? "bg-[#0A0A0C] ring-2 ring-[#0A0A0C]/20"
                                : "bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                            }`}
                          />
                          <span>{subItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
