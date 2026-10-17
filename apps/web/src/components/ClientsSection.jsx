import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextSplitter from "./TextSplitter";

import client1 from "../assets/clients-1.2x6o6jq8f5_bm.webp";
import client2 from "../assets/clients-2.1l6jm5-3cnwvg.webp";
import client3 from "../assets/clients-3.0-x8av3q__ih4.webp";
import client4 from "../assets/clients-4.1tgn231h0a-zf.webp";
import client5 from "../assets/clients-5.1h0spsdpfo9zr.webp";
import client6 from "../assets/clients-6.1_xtm6aakyuxq.webp";

gsap.registerPlugin(ScrollTrigger);

const clientLogos = [
  { src: client1, alt: "Google logo" },
  { src: client2, alt: "Adobe logo" },
  { src: client3, alt: "JP logo" },
  { src: client4, alt: "Pinterest logo" },
  { src: client5, alt: "IBM logo" },
  { src: client6, alt: "Intel logo" },
];

const duplicatedLogos = [...clientLogos, ...clientLogos];

export default function ClientsSection() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll(".grid__item"));
    if (items.length === 0) return;

    const isDesktop = window.innerWidth > 1024;
    const durIn = isDesktop ? 1.5 : 4;
    const durOut = isDesktop ? 1.5 : 3.5;
    const groupDelay = durIn + 0.4;
    const itemDelay = isDesktop ? 0.4 : 0.5;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 20%",
        end: "bottom center",
        scrub: true,
      },
    });

    const groups = [];
    for (let i = 0; i < items.length; ) {
      const size = Math.min(items.length - i, gsap.utils.random(2, 3, 1));
      groups.push(Array.from({ length: size }, (_, r) => i + r));
      i += size;
    }

    groups.forEach((group, gIdx) => {
      const gOffset = gIdx * groupDelay;
      group.forEach((itemIdx, iIdx) => {
        const item = items[itemIdx];
        const offset = gOffset + iIdx * itemDelay;

        gsap.set(item, {
          transformOrigin: "0% 0%",
          opacity: 0,
          x: isDesktop ? gsap.utils.random(-180, 180) : 0,
          y: gsap.utils.random(-180, 180),
          filter: "blur(10px)",
          z: isDesktop ? gsap.utils.random(-2200, -1600) : gsap.utils.random(-550, -400),
        });

        tl.to(
          item,
          { z: 0, opacity: 1, filter: "blur(0px)", duration: durIn },
          offset
        ).to(
          item,
          {
            filter: "blur(10px)",
            opacity: 0,
            z: isDesktop ? gsap.utils.random(1400, 1800) : gsap.utils.random(500, 700),
            duration: durOut,
          },
          offset + durIn
        );
      });
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clientblur"
      className="relative w-full h-[240vh] text-center z-2 bg-[#0A0A0C]"
    >
      <div className="sticky w-full top-0 h-screen flex items-center justify-center">
        <div className="w-3/5 max-lg:w-4/5">
          <TextSplitter stagger={0.015}>
            <h3 className="text-[5.5vw] text-[#F7F5F0] leading-[1.2] max-lg:text-[7vw] max-md:text-[8vw] font-medium">
              Partnering with World-Leading Modeling Agencies.
            </h3>
          </TextSplitter>
        </div>
      </div>

      <div className="left-0 sticky mt-[-100vh] top-0 z-20 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        <div
          ref={gridRef}
          className="grid grid-cols-5 gap-[3vw] perspective-[350vw] max-md:grid-cols-3 max-md:gap-[6vw]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {duplicatedLogos.map((client, idx) => (
            <div
              key={idx}
              className="grid__item flex h-[8vw] w-[14vw] items-center justify-center max-md:h-[22vw] max-md:w-[26vw] will-change-transform"
            >
              <img
                src={client.src}
                alt={client.alt}
                loading="lazy"
                decoding="async"
                className="h-[4vw] w-full object-contain max-md:h-[11vw]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
