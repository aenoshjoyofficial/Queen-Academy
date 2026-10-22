import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import TextSplitter from "./TextSplitter";

import heroImg from "../assets/HeroImage.png";
import reel1 from "../assets/reel-1.jpg";
import reel2 from "../assets/reel-2.jpg";
import reel3 from "../assets/reel-3.jpg";
import reel4 from "../assets/reel-4.jpg";

gsap.registerPlugin(ScrollTrigger);

const col1Images = [reel1, reel3, reel2, reel4, reel1, reel3];
const col2Images = [reel2, reel4, reel1, reel3, reel2, reel4];
const col3Images = [reel3, reel1, reel4, reel2, reel3, reel1];
const allImages = [reel1, reel2, reel3, reel4, reel1, reel2, reel3, reel4];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const heroContainerRef = useRef(null);
  const heroImageWrapRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroMaskRef = useRef(null);
  const marqueeContainerRef = useRef(null);
  const initializedRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  const [startHeading, setStartHeading] = useState(false);
  const [startSubtitle, setStartSubtitle] = useState(false);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const media = window.matchMedia("(max-width: 1025px)");
    const checkMedia = () => setIsMobile(media.matches);
    checkMedia();
    media.addEventListener("change", checkMedia);
    return () => media.removeEventListener("change", checkMedia);
  }, []);

  // Keep Lenis enabled and refresh ScrollTrigger on mount
  useEffect(() => {
    if (!lenis) return;
    lenis.start();
    ScrollTrigger.refresh();
  }, [lenis]);

  // Entrance timeline
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const state = { reveal: -40 };
    const tl = gsap.timeline();

    tl.to(
      state,
      {
        reveal: 125,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: () => {
          heroMaskRef.current?.style.setProperty("--reveal", `${state.reveal}%`);
        },
      },
      0
    )
      .fromTo(
        heroMaskRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        0
      )
      .call(() => setStartHeading(true), undefined, 0.6)
      .call(() => setStartSubtitle(true), undefined, 1.0)
      .call(
        () => {
          const header = document.getElementById("header");
          const logo = document.getElementById("header-logo");
          gsap.fromTo(
            [header, logo],
            { yPercent: -50, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              onComplete: () => {
                lenisRef.current?.start();
                ScrollTrigger.refresh();
              },
            }
          );
        },
        undefined,
        1.4
      );

    return () => {
      tl.kill();
      initializedRef.current = false;
      setStartHeading(false);
      setStartSubtitle(false);
      lenisRef.current?.start();
    };
  }, []);

  // Scroll scale down timeline
  useEffect(() => {
    if (!heroContainerRef.current || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(heroContainerRef.current, { scale: 0.5, ease: "power2.inOut", duration: 1 }, 0);

    if (marqueeContainerRef.current) {
      gsap.set(marqueeContainerRef.current, { filter: "blur(24px)", opacity: 0.35 });
      tl.to(
        marqueeContainerRef.current,
        { filter: "blur(0px)", opacity: 1, ease: "power2.out", duration: 0.18 },
        0.32
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Mouse Parallax on Desktop
  useEffect(() => {
    if (window.innerWidth <= 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const mouseState = {
      targetImgX: 0,
      currentImgX: 0,
      targetTextX: 0,
      currentTextX: 0,
      targetImgY: 0,
      currentImgY: 0,
      targetTextY: 0,
      currentTextY: 0,
    };

    let rafId = null;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const animate = () => {
      if (!isVisible) {
        rafId = null;
        return;
      }

      mouseState.currentImgX += (mouseState.targetImgX - mouseState.currentImgX) * 0.08;
      mouseState.currentTextX += (mouseState.targetTextX - mouseState.currentTextX) * 0.08;
      mouseState.currentImgY += (mouseState.targetImgY - mouseState.currentImgY) * 0.08;
      mouseState.currentTextY += (mouseState.targetTextY - mouseState.currentTextY) * 0.08;

      if (heroImageWrapRef.current) {
        gsap.set(heroImageWrapRef.current, {
          x: mouseState.currentImgX,
          y: mouseState.currentImgY,
        });
      }
      if (heroTextRef.current) {
        gsap.set(heroTextRef.current, {
          x: mouseState.currentTextX,
          y: mouseState.currentTextY,
        });
      }

      const isSettled =
        Math.abs(mouseState.targetImgX - mouseState.currentImgX) < 0.05 &&
        Math.abs(mouseState.targetImgY - mouseState.currentImgY) < 0.05;

      if (isSettled) {
        rafId = null;
      } else {
        rafId = requestAnimationFrame(animate);
      }
    };

    const onMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      mouseState.targetImgX = -(30 * normX);
      mouseState.targetTextX = -(12 * normX);
      mouseState.targetImgY = -(30 * normY);
      mouseState.targetTextY = -(12 * normY);

      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[300vh]" id="hero">
      <div
        ref={heroContainerRef}
        className="w-full h-screen sticky top-0 flex justify-between items-center hero-container px-[4vw] z-2 max-[1025px]:px-[5vw] max-[1025px]:items-start max-[1025px]:pt-[24vw] max-md:pt-[4.2rem] max-md:px-5 overflow-hidden"
        style={{
          backgroundColor: "#0A0A0C",
          backgroundImage: `
            radial-gradient(65% 55% at 92% 6%, rgba(212, 175, 55, 0.28) 0%, rgba(212, 175, 55, 0) 65%),
            radial-gradient(60% 55% at 4% 82%, rgba(240, 200, 136, 0.22) 0%, rgba(240, 200, 136, 0) 65%),
            radial-gradient(75% 80% at 48% 42%, rgba(179, 138, 62, 0.3) 0%, rgba(179, 138, 62, 0) 70%),
            linear-gradient(180deg, #1C1914 0%, #151310 32%, #11100D 58%, #0D0C0B 80%, #0A0A0C 100%)
          `,
        }}
      >
        <div
          ref={heroTextRef}
          className="w-full h-fit flex justify-between relative pointer-events-none max-[1025px]:flex-col max-[1025px]:gap-6 max-md:gap-3"
        >
          <div className="w-[45%] leading-30! max-[1025px]:w-[70%] max-md:w-full max-md:text-center max-md:px-2 relative z-1 max-md:z-10 pointer-events-auto">
            <TextSplitter stagger={0.015} start={startHeading}>
              <h1 className="hero-title text-[7.5vw] text-[#F7F5F0] max-[1025px]:text-[10vw] max-md:text-[13vw] max-sm:text-[12.2vw] leading-[1.12]! font-bold drop-shadow-lg pb-1">
                Crown the Icon Within You
              </h1>
            </TextSplitter>
          </div>

          <div className="w-[12%] flex flex-col justify-between text-end text-[1.25vw] leading-[1.15] py-[2vw] max-[1025px]:w-full max-[1025px]:text-start max-[1025px]:flex-row max-[1025px]:items-center max-[1025px]:justify-between max-[1025px]:py-0 max-md:flex-col max-md:items-center max-md:text-center max-md:gap-1 max-md:pt-1 relative z-3 pointer-events-auto">
            <TextSplitter splitBy="lines" start={startSubtitle}>
              <p className="text-[#F0C888] font-medium tracking-[0.04em] uppercase text-[0.85rem] max-[1025px]:text-[2.6vw] max-md:text-[3.6vw] max-sm:text-[3.4vw]">
                Global Runway Training
              </p>
            </TextSplitter>
            <TextSplitter splitBy="lines" start={startSubtitle}>
              <p className="text-[#B8B6B0] tracking-[0.03em] max-[1025px]:text-[2.2vw] max-md:text-[3.4vw] max-sm:text-[3.1vw]">
                Elite Fashion & Model Academy
              </p>
            </TextSplitter>
          </div>
        </div>

        <div
          ref={heroMaskRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[96vh] w-[78vw] max-w-[1060px] max-[1025px]:w-[85vw] max-[1025px]:h-[82vh] max-md:w-[125vw] max-md:h-[68vh] max-sm:w-[130vw] max-sm:h-[66vh] hero-av-img hero-mask-reveal opacity-0 pointer-events-none z-2"
        >
          <div ref={heroImageWrapRef} className="w-full h-full flex items-end justify-center">
            <img
              src={heroImg}
              alt="Elena Voss in Motion"
              className="w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] max-md:scale-105 max-sm:scale-108 origin-bottom"
              draggable={false}
              loading="eager"
            />
          </div>
        </div>
      </div>

      <div ref={marqueeContainerRef} className="absolute inset-0 w-full h-full bg-[#0A0A0C]">
        <div className="w-full h-screen sticky top-0 px-[4vw] flex justify-center items-start gap-[2vw] max-md:gap-3 overflow-hidden">
          {/* Column 1 */}
          <div className="w-[32%] max-md:w-[48%] h-fit flex flex-col gap-[2vw] max-md:gap-3 marquee-1">
            {(isMobile ? allImages : col1Images).map((src, i) => (
              <div key={i} className="w-full aspect-[9/16] overflow-hidden rounded-2xl max-md:rounded-xl border border-[#3A3937]/50 shadow-xl bg-[#111113]">
                <img
                  src={src}
                  alt="runway-marquee-1"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="w-[32%] max-md:w-[48%] h-fit flex flex-col gap-[2vw] max-md:gap-3 marquee-2">
            {(isMobile ? allImages : col2Images).map((src, i) => (
              <div key={i} className="w-full aspect-[9/16] overflow-hidden rounded-2xl max-md:rounded-xl border border-[#3A3937]/50 shadow-xl bg-[#111113]">
                <img
                  src={src}
                  alt="runway-marquee-2"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Column 3 (New added column for 9:16 reels proportion) */}
          <div className="w-[32%] max-md:hidden h-fit flex flex-col gap-[2vw] marquee-3">
            {col3Images.map((src, i) => (
              <div key={i} className="w-full aspect-[9/16] overflow-hidden rounded-2xl border border-[#3A3937]/50 shadow-xl bg-[#111113]">
                <img
                  src={src}
                  alt="runway-marquee-3"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
