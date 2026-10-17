import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextSplitter from "./TextSplitter";

import reel1 from "../assets/reel-1.jpg";
import reel2 from "../assets/reel-2.jpg";
import reel3 from "../assets/reel-3.jpg";
import reel4 from "../assets/reel-4.jpg";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: "Paris Fashion Week",
    tags: ["Runway Debut", "Haute Couture Gold"],
    imgSrc: reel1,
  },
  {
    name: "Vogue Cover Editorial",
    tags: ["High Fashion", "Crown & Poise"],
    imgSrc: reel2,
  },
  {
    name: "Milan Catwalk Showcase",
    tags: ["Avant-Garde", "Catwalk Walk"],
    imgSrc: reel3,
  },
  {
    name: "Eiffel Grand Runway",
    tags: ["Evening Couture", "Global Showcase"],
    imgSrc: reel4,
  },
];

export default function PortfolioSection() {
  const dotsRef = useRef([]);
  const progressLineRef = useRef(null);
  const cardLayersRef = useRef([]);
  const circleClipRef = useRef(null);
  const isReducedRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedRef.current = media.matches;

    const onMediaChange = (e) => {
      isReducedRef.current = e.matches;
    };

    media.addEventListener("change", onMediaChange);
    return () => media.removeEventListener("change", onMediaChange);
  }, []);

  const textItemsRef = useRef([]);

  useEffect(() => {
    const totalTransitions = projects.length - 1;

    // Timeline for card stack and timeline progress
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#portfolio",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        ...(isReducedRef.current
          ? {}
          : {
              snap: {
                snapTo: 1 / totalTransitions,
                duration: { min: 0.25, max: 0.5 },
                ease: "power2.inOut",
              },
            }),
      },
    });
    // Reset initial states
    gsap.set(progressLineRef.current, { scaleY: 0, transformOrigin: "top" });
    gsap.set(dotsRef.current[0], {
      backgroundColor: "#D4AF37",
      borderColor: "#F0C888",
      scale: 1.25,
    });
    gsap.set(dotsRef.current.slice(1), {
      backgroundColor: "#1A1A1D",
      borderColor: "#3A3937",
      scale: 1,
    });

    if (textItemsRef.current[0]) {
      gsap.set(textItemsRef.current[0], { opacity: 1 });
    }
    if (textItemsRef.current.slice(1).length) {
      gsap.set(textItemsRef.current.slice(1), { opacity: 0.45 });
    }

    gsap.set(cardLayersRef.current, { filter: "brightness(1)", scale: 1 });

    if (isReducedRef.current) {
      cardLayersRef.current.slice(1).forEach((card) => {
        gsap.set(card, { opacity: 0 });
      });
    } else {
      cardLayersRef.current.slice(1).forEach((card) => {
        gsap.set(card, { yPercent: 100 });
      });
    }

    // Continuous progress line growth across the duration
    tl.to(
      progressLineRef.current,
      { scaleY: 1, ease: "none", duration: totalTransitions },
      0
    );

    // Transition between each card
    for (let i = 0; i < totalTransitions; i++) {
      const nextCard = cardLayersRef.current[i + 1];
      const prevCard = cardLayersRef.current[i];
      const nextDot = dotsRef.current[i + 1];
      const prevDot = dotsRef.current[i];
      const nextText = textItemsRef.current[i + 1];
      const prevText = textItemsRef.current[i];

      if (isReducedRef.current) {
        tl.to(nextCard, { opacity: 1, ease: "none", duration: 1 }, i);
      } else {
        tl.to(
          nextCard,
          { yPercent: 0, ease: "power2.out", duration: 1 },
          i
        );
      }

      // Slightly scale down and dim previous card as new one covers it
      tl.to(
        prevCard,
        {
          filter: "brightness(0.7)",
          scale: 0.96,
          ease: "power2.out",
          duration: 1,
        },
        i
      );

      // Active dot transitions
      tl.to(
        nextDot,
        {
          backgroundColor: "#D4AF37",
          borderColor: "#F0C888",
          scale: 1.25,
          duration: 0.4,
          ease: "power2.out",
        },
        i + 0.6
      );
      tl.to(
        prevDot,
        {
          backgroundColor: "#1A1A1D",
          borderColor: "#3A3937",
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        i + 0.6
      );;

      // Text highlight transitions
      if (nextText) {
        tl.to(nextText, { opacity: 1, duration: 0.5, ease: "power2.out" }, i + 0.5);
      }
      if (prevText) {
        tl.to(prevText, { opacity: 0.45, duration: 0.5, ease: "power2.out" }, i + 0.5);
      }
    }

    // Circular clip reveal animation rising into portfolio
    let clipTween;
    if (!isReducedRef.current && circleClipRef.current) {
      gsap.set(circleClipRef.current, {
        clipPath: "ellipse(140% 100% at 50% 100%)",
        yPercent: 0,
      });

      clipTween = gsap.to(circleClipRef.current, {
        yPercent: -60,
        clipPath: "ellipse(55% 100% at 50% 100%)",
        ease: "power1.out",
        scrollTrigger: {
          trigger: "#portfolio",
          start: "top 95%",
          end: "top top",
          scrub: true,
        },
      });
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      clipTween?.scrollTrigger?.kill();
      clipTween?.kill();
    };
  }, []);

  return (
    <section
      className="relative w-full h-[360vh] text-[#F7F5F0] bg-[#0A0A0C]"
      id="portfolio"
    >
      <div
        ref={circleClipRef}
        className="w-full h-[50vh] absolute top-0 left-0 z-2 bg-linear-to-r from-[#D4AF37] to-[#B38A3E] circle-clip will-change-[clip-path]"
      />

      <div className="w-full h-screen sticky top-0 z-3 flex flex-col items-center justify-center px-[4vw] pt-[4.5rem] pb-[2rem] gap-[2.5vw] overflow-hidden bg-linear-to-r from-[#1A1813] to-[#12110E] max-[1025px]:px-[5vw] max-[1025px]:pt-[5rem] max-[1025px]:pb-[2rem] max-[1025px]:gap-6 max-md:pt-[4.5rem] max-md:pb-4 max-md:gap-4 border-y border-[#3A3937]/40">
        <TextSplitter>
          <h2 className="text-[4.2vw] leading-[1.1] text-center max-[1025px]:text-[5.5vw] max-md:text-[7vw] font-medium shrink-0 text-[#F7F5F0]">
            Graduates on the Runway
          </h2>
        </TextSplitter>

        <div className="w-full max-w-[90vw] flex items-center justify-between gap-[3.5vw] max-[1025px]:flex-col max-[1025px]:items-stretch max-[1025px]:gap-6 flex-1 min-h-0">
          {/* Timeline & Project List */}
          <div className="w-[34%] relative max-[1025px]:w-full shrink-0">
            <div className="absolute left-1 bg-[#3A3937] top-[1.5vw] max-[1025px]:top-[0.8vw] h-[15vw] max-[1025px]:h-[22vw] max-md:h-[32vw] w-px" />
            <div
              ref={progressLineRef}
              className="absolute left-1 bg-linear-to-b from-[#D4AF37] to-[#F0C888] origin-top top-[1.5vw] max-[1025px]:top-[0.8vw] h-[15vw] max-[1025px]:h-[22vw] max-md:h-[32vw] w-px z-1"
            />

            <div className="flex flex-col gap-[0.8vw] max-[1025px]:gap-[1.5vw] max-md:gap-2">
              {projects.map((project, idx) => (
                <div
                  key={project.name}
                  ref={(el) => (textItemsRef.current[idx] = el)}
                  className="relative flex items-center gap-[1.2vw] max-md:gap-3 transition-opacity duration-300 py-[0.4vw]"
                >
                  <span
                    ref={(el) => (dotsRef.current[idx] = el)}
                    className="w-[8px] h-[8px] bg-[#1A1A1D] rounded-full border border-[#3A3937] shrink-0 transition-transform duration-300"
                  />
                  <div>
                    <h3 className="text-[1.35vw] font-normal leading-tight max-[1025px]:text-[2.5vw] max-md:text-[4vw] text-[#F7F5F0]">
                      {project.name}
                    </h3>
                    <p className="text-[0.9vw] leading-tight max-[1025px]:text-[1.8vw] max-md:text-[3vw] text-[#B8B6B0]">
                      {project.tags.join("  •  ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stacking Project Cards (9:16 Reels Aspect Ratio) */}
          <div className="flex-1 flex justify-center items-center h-full max-h-[72vh] max-[1025px]:max-h-[50vh] max-md:max-h-[46vh]">
            <div className="h-full aspect-[9/16] relative rounded-2xl overflow-hidden shadow-2xl border border-[#3A3937]/70 bg-[#111113]">
              {projects.map((project, idx) => (
                <div
                  key={project.name}
                  ref={(el) => (cardLayersRef.current[idx] = el)}
                  className="absolute inset-0 bg-[#0A0A0C] flex items-center justify-center rounded-2xl overflow-hidden will-change-transform"
                  style={{ zIndex: idx + 1 }}
                >
                  <img
                    src={project.imgSrc}
                    alt={project.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle luxury vignette gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  {/* Bottom title badge */}
                  <div className="absolute bottom-4 left-4 right-4 z-2 pointer-events-none">
                    <span className="text-[0.75rem] max-md:text-[0.65rem] uppercase tracking-widest text-[#F0C888] font-medium bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#3A3937]">
                      {project.tags[0]}
                    </span>
                    <h4 className="text-[#F7F5F0] text-lg max-md:text-sm font-medium mt-1.5 drop-shadow-md">
                      {project.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-full h-[60vh] bottom-[-10%] left-0 overflow-hidden max-[1025px]:bottom-[-13%] pointer-events-none">
        <div className="w-[115%] h-[40vh] absolute bottom-[35%] left-[-7.5%] z-2 bg-linear-to-r from-[#D4AF37]/30 to-[#B38A3E]/30 blur-2xl max-[1025px]:bottom-[50%] max-[1025px]:w-[120%] max-[1025px]:left-[-10%] max-[1025px]:blur-lg" />
      </div>
    </section>
  );
}
