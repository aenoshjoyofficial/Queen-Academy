import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PillButton from "./PillButton";
import { useGetInTouchModal } from "./GetInTouchModalContext";

import footerBg from "../assets/footer-bg.2y6ggh6bp2suk.svg";
import logoImg from "../assets/logo.png";
import fbIcon from "../assets/facebook.28b69odb44qoi.svg";
import igIcon from "../assets/instagram.44_o2mpfxt9wp.svg";
import inIcon from "../assets/linkedIn.3zxx2oqth41cz.svg";
import twIcon from "../assets/twitter.0pg43yq6t12uk.svg";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: "Facebook", href: "#", icon: fbIcon, width: 10, height: 19 },
  { label: "Instagram", href: "#", icon: igIcon, width: 21, height: 21 },
  { label: "LinkedIn", href: "#", icon: inIcon, width: 18, height: 18 },
  { label: "Twitter", href: "#", icon: twIcon, width: 17, height: 17 },
];

export default function Footer() {
  const footerRef = useRef(null);
  const cardRef = useRef(null);
  const { openModal } = useGetInTouchModal();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(cardRef.current, { opacity: 1, yPercent: 0 });
      return;
    }

    if (window.innerWidth <= 1025) return;

    const tween = gsap.fromTo(
      cardRef.current,
      { yPercent: 20 },
      {
        yPercent: 0,
        ease: "power1.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 60%",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden px-[4vw] pt-[10vw] max-[1025px]:px-[5vw] max-md:pt-[20vw]"
      id="footer"
    >
      <img
        src={footerBg}
        alt="Footer Background"
        loading="lazy"
        className="absolute -bottom-20 left-0 right-0 w-full max-md:scale-[5] max-md:bottom-0 pointer-events-none select-none"
      />

      <div className="relative z-[1]">
        <div
          ref={cardRef}
          className="rounded-4xl bg-[#111113]/90 border border-[#3A3937] backdrop-blur-2xl px-12 py-12 flex flex-col gap-20 justify-between max-[1025px]:flex-col max-[1025px]:items-center max-[1025px]:gap-10 max-[1025px]:px-8 max-[1025px]:py-15 max-md:px-6 max-md:gap-8 shadow-2xl"
        >
          {/* Top CTA Row */}
          <div className="flex justify-between items-start gap-24 footer-content max-[1025px]:gap-10 max-md:gap-16 max-[1025px]:flex-col-reverse max-[1025px]:items-center w-full">
            <div className="flex flex-col gap-3 max-[1025px]:items-center">
              <img
                src={logoImg}
                alt="Queens Academy Logo"
                className="h-[5.5vw] min-h-[50px] max-h-[82px] w-auto object-contain max-[1025px]:h-[10vw] max-md:h-[13vw]"
              />
              <p className="text-[#B8B6B0] text-sm tracking-widest uppercase">
                Premier Fashion & Model Training
              </p>
            </div>

            <div className="flex flex-col gap-[2vw] items-end max-[1025px]:items-center max-[1025px]:text-center max-md:gap-[7vw]">
              <p className="text-[3.4vw] text-end w-[75%] leading-[1.15] max-[1025px]:text-[5vw] max-[1025px]:w-full max-[1025px]:text-center max-md:text-[7.5vw] font-normal text-[#F7F5F0]">
                Ready to Walk the World's Biggest Runways?
              </p>

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
            </div>
          </div>

          {/* Bottom Reach Out & Socials */}
          <div className="flex w-full items-end justify-between gap-36 h-auto footer-content max-[1025px]:w-full max-[1025px]:items-center max-[1025px]:text-center max-[1025px]:gap-10 max-md:gap-10 max-[1025px]:flex-col">
            <div className="w-fit text-foreground">
              <h6 className="uppercase mb-5 text-[1.25vw] max-[1025px]:text-[2.4vw] max-md:text-[4vw] tracking-wider text-[#B8B6B0] font-medium">
                Admissions & Castings
              </h6>
              <ul className="space-y-2 text-[1.25vw] max-[1025px]:text-[2.4vw] max-md:text-[4vw]">
                <li className="under-multi-parent">
                  <a href="tel:+1 (415) 309-8274" className="under-multi content-p text-[#F7F5F0] hover:text-[#D4AF37] transition-colors">
                    +1 (415) 309-8274
                  </a>
                </li>
                <li className="under-multi-parent">
                  <a href="mailto:admissions@queensacademy.fashion" className="under-multi content-p text-[#F7F5F0] hover:text-[#D4AF37] transition-colors">
                    admissions@queensacademy.fashion
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-between h-fit">
              <ul className="flex gap-4">
                {socials.map((item) => (
                  <li key={item.label} className="group">
                    <a
                      href={item.href}
                      aria-label={item.label}
                      className="rounded-full relative block p-3 border border-[#3A3937] overflow-hidden bg-[#1A1A1D] transition-all duration-300 ease-in-out group-hover:scale-[0.95]"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-full h-full object-contain group-hover:brightness-0 transition-all duration-300 ease-in-out"
                        />
                      </div>
                      <div className="w-full h-full absolute inset-0 origin-center scale-0 group-hover:scale-100 bg-[#D4AF37] rounded-full duration-300 ease-in-out z-[-1]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Copyright Footer */}
        <div className="flex justify-between py-8 pt-12 text-lg text-[#F7F5F0] font-medium tracking-wide drop-shadow-sm max-md:flex-col max-md:gap-2 max-md:text-sm max-md:text-center max-md:py-6 max-md:pt-8">
          <p>
            Copyright © Queens Academy 2026. All Rights Reserved.
          </p>
          <p>
            High Fashion & Model Training Institute
          </p>
        </div>
      </div>
    </footer>
  );
}
