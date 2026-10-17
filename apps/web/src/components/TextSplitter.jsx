import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DIRECTIONS = {
  top: { yPercent: -100, xPercent: 0, rotate: 0 },
  bottom: { yPercent: 100, xPercent: 0, rotate: 0 },
  left: { yPercent: 0, xPercent: -100, rotate: 0 },
  right: { yPercent: 0, xPercent: 100, rotate: 0 },
};

/**
 * Splits DOM text nodes in an element into masked lines or characters.
 */
function splitElement(element, type = "chars") {
  const text = element.textContent || "";
  element.setAttribute("data-split-orig", text);
  element.innerHTML = "";

  if (type === "lines") {
    // Wrap lines
    const lineWrapper = document.createElement("span");
    lineWrapper.style.display = "inline-block";
    lineWrapper.style.overflow = "hidden";
    lineWrapper.style.verticalAlign = "top";

    const lineInner = document.createElement("span");
    lineInner.style.display = "inline-block";
    lineInner.textContent = text;
    lineWrapper.appendChild(lineInner);
    element.appendChild(lineWrapper);
    return [lineInner];
  }

  // Split into characters
  const chars = [];
  const words = text.split(" ");

  words.forEach((word, wordIdx) => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-block";
    wordSpan.style.whiteSpace = "nowrap";

    [...word].forEach((char) => {
      const charWrapper = document.createElement("span");
      charWrapper.style.display = "inline-block";
      charWrapper.style.overflow = "hidden";
      charWrapper.style.verticalAlign = "top";
      charWrapper.style.paddingInline = "0.04em";
      charWrapper.style.marginInline = "-0.04em";
      charWrapper.style.boxSizing = "content-box";

      const charInner = document.createElement("span");
      charInner.style.display = "inline-block";
      charInner.textContent = char;

      charWrapper.appendChild(charInner);
      wordSpan.appendChild(charWrapper);
      chars.push(charInner);
    });

    element.appendChild(wordSpan);

    if (wordIdx < words.length - 1) {
      const space = document.createTextNode(" ");
      element.appendChild(space);
    }
  });

  return chars;
}

export default function TextSplitter({
  children,
  animateOnScroll = true,
  delay = 0,
  className = "",
  scrub = false,
  direction = "bottom",
  splitBy = "chars",
  stagger,
  duration = 0.5,
  onComplete,
  completeOverlap = 0,
  start = true,
}) {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current || !start) return;

    const container = containerRef.current;
    const targetNodes = container.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
    const elementsToSplit = targetNodes.length > 0 ? Array.from(targetNodes) : [container];

    elementsRef.current = [];
    elementsToSplit.forEach((el) => {
      const units = splitElement(el, splitBy);
      elementsRef.current.push(...units);
    });

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      gsap.set(elementsRef.current, { yPercent: 0, xPercent: 0, opacity: 1 });
      gsap.set(container, { opacity: 0, y: 24 });
      const anim = { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay };
      if (animateOnScroll) {
        gsap.to(container, {
          ...anim,
          scrollTrigger: { trigger: container, start: "top 85%", once: true },
        });
      } else {
        gsap.to(container, anim);
      }
      return;
    }

    const dirConfig = DIRECTIONS[direction] || DIRECTIONS.bottom;
    gsap.set(container, { opacity: 1 });

    const fromVars = {
      ...dirConfig,
      opacity: 0,
      willChange: "transform, opacity",
    };

    const staggerVal = stagger ?? (splitBy === "lines" ? 0.1 : 0.03);
    const toVars = {
      yPercent: 0,
      xPercent: 0,
      rotate: 0,
      opacity: 1,
      duration,
      stagger: staggerVal,
      ease: "power3.out",
      delay,
    };

    let tween;
    if (animateOnScroll) {
      tween = gsap.fromTo(elementsRef.current, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom 68%",
          scrub: scrub,
        },
      });
    } else {
      tween = gsap.fromTo(elementsRef.current, fromVars, toVars);
    }

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [start, splitBy, direction, delay, duration, stagger, animateOnScroll, scrub]);

  return (
    <div ref={containerRef} className={`opacity-0 ${className}`} data-copy-wrapper="true">
      {children}
    </div>
  );
}
