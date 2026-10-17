import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import PillButton from "./PillButton";
import { useGetInTouchModal } from "./GetInTouchModalContext";
import logoImg from "../assets/logo.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useGetInTouchModal();
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const isReduced = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReduced.current = mql.matches;
    const onChange = (e) => {
      isReduced.current = e.matches;
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useLenis((lenis) => {
    const currentScrollY = lenis.scroll;
    const threshold = 0.4 * window.innerHeight;
    const isPastThreshold = currentScrollY > threshold;

    setScrolled((prev) => (prev !== isPastThreshold ? isPastThreshold : prev));

    if (!isReduced.current) {
      const diff = currentScrollY - lastScrollY.current;

      if (diff > 5 && currentScrollY > 100 && !isHidden.current) {
        isHidden.current = true;
        gsap.to(headerRef.current, {
          yPercent: -100,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else if (diff < -5 && isHidden.current) {
        isHidden.current = false;
        gsap.to(headerRef.current, {
          yPercent: 0,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    }

    lastScrollY.current = currentScrollY;
  });

  return (
    <header
      ref={headerRef}
      className={`w-full h-[5rem] max-[1025px]:h-[4.5rem] max-md:h-[4rem] flex items-center justify-between px-[4vw] fixed top-0 left-0 right-0 z-50 transition-[backdrop-filter] duration-500 ease-out max-[1025px]:px-[5vw] ${
        scrolled ? "backdrop-blur-lg bg-[#0A0A0C]/75 border-b border-[#3A3937]/50" : "backdrop-blur-none"
      }`}
      id="header"
    >
      <a href="/" id="header-logo" className="cursor-pointer flex items-center h-full py-1">
        <img
          src={logoImg}
          alt="Queens Academy Logo"
          className="h-[4rem] max-[1025px]:h-[3.5rem] max-md:h-[3rem] w-auto object-contain"
        />
      </a>

      <PillButton
        btnText="Apply for Admission"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openModal();
        }}
        className="border border-[#3A3937]!"
        textClassName="font-medium text-[1.15vw] max-[1025px]:text-[3vw] max-md:text-[4.2vw]"
        bgColor="#D4AF37"
        dotColor="#0A0A0C"
        hoverTextColor="#F7F5F0"
        textColor="#0A0A0C"
      />
    </header>
  );
}
