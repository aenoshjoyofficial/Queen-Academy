import React, { useRef, useState, useEffect } from "react";

export default function PillButton({
  btnText = "",
  href = "#",
  className = "",
  textClassName = "",
  bgColor = "#ff6b00",
  textColor = "#ffffff",
  hoverTextColor = "#ff6b00",
  dotColor = "#ffffff",
  onClick,
  ...props
}) {
  const textRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const str = btnText || "";
    el.innerHTML = "";
    [...str].forEach((char, idx) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.transitionDelay = isReduced ? "0s" : `${0.01 * idx}s`;
      if (char === " ") span.style.whiteSpace = "pre";
      el.appendChild(span);
    });
  }, [btnText, isReduced]);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      Array.from(el.children || []).forEach((child) => {
        child.style.display = "inline-block";
        child.style.position = "relative";
        child.style.textShadow = "0px 1.3em currentColor";
        child.style.transform = "translateY(0em) rotate(0.001deg)";
        child.style.transition = isReduced
          ? "none"
          : "transform 0.6s cubic-bezier(0.625, 0.05, 0, 1), color 0.6s cubic-bezier(0.625, 0.05, 0, 1)";
        child.style.willChange = "transform";
      });
    }
  }, [btnText, isReduced]);

  useEffect(() => {
    const mqlReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqlMobile = window.matchMedia("(max-width: 639px)");

    setIsReduced(mqlReduced.matches);
    setIsMobile(mqlMobile.matches);

    const onReduced = (e) => setIsReduced(e.matches);
    const onMobile = (e) => setIsMobile(e.matches);

    mqlReduced.addEventListener("change", onReduced);
    mqlMobile.addEventListener("change", onMobile);

    return () => {
      mqlReduced.removeEventListener("change", onReduced);
      mqlMobile.removeEventListener("change", onMobile);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleEnter = () => {
    const el = textRef.current;
    if (el) {
      Array.from(el.children).forEach((child) => {
        child.style.transform = "translateY(-1.3em) rotate(0.001deg)";
      });
      setIsHovered(true);
    }
  };

  const handleLeave = () => {
    const el = textRef.current;
    if (el) {
      Array.from(el.children).forEach((child) => {
        child.style.transform = "translateY(0em) rotate(0.001deg)";
      });
      setIsHovered(false);
    }
  };

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => {
        if (!isMobile) handleEnter();
      }}
      onMouseLeave={() => {
        if (!isMobile) handleLeave();
      }}
      onPointerDown={(e) => {
        props.onPointerDown?.(e);
        if (isMobile && e.pointerType !== "mouse") {
          if (timerRef.current) clearTimeout(timerRef.current);
          handleEnter();
          timerRef.current = setTimeout(() => {
            handleLeave();
            timerRef.current = null;
          }, 1000);
        }
      }}
      className={`group relative flex w-fit items-center justify-center gap-[0.9vw] h-[3.5vw] px-[2vw] rounded-full overflow-hidden whitespace-nowrap no-underline font-medium text-[1.5vw] transition-colors border-white/20! duration-500 motion-reduce:transition-none max-[1025px]:gap-[1.6vw] max-[1025px]:h-[8vw] max-[1025px]:px-[3.5vw] max-[1025px]:text-[3vw] max-[1025px]:font-normal max-md:gap-[2.4vw] max-md:h-[12vw] max-md:px-[5vw] max-md:text-[4.2vw] ${className}`}
      style={{
        background: bgColor,
        color: isHovered ? hoverTextColor : textColor,
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        className="relative z-10 flex shrink-0 items-center justify-center w-[0.5vw] h-[0.5vw] max-[1025px]:w-[1.5vw] max-[1025px]:h-[1.5vw] max-md:w-[2.3vw] max-md:h-[2.3vw]"
        style={{ marginTop: "0.08em" }}
      >
        <span
          className="absolute inset-0 rounded-full transition-transform duration-400 ease-in-out motion-reduce:transition-none"
          style={{
            background: dotColor,
            transform: isHovered ? "scale(120)" : "scale(1)",
            transitionTimingFunction: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
          }}
        />
      </span>

      <span aria-hidden="true" className={`invisible block h-[1.3em] leading-[1.3] ${textClassName}`}>
        {btnText}
      </span>

      <span
        className={`absolute left-1/2 top-1/2 z-20 block h-[1.3em] -translate-x-1/2 -translate-y-1/2 overflow-hidden ${textClassName}`}
        style={{ marginTop: "0.08em" }}
      >
        <span ref={textRef} className="block leading-[1.3]" aria-hidden="false">
          {btnText}
        </span>
      </span>

      <span aria-hidden="true" className="block shrink-0 w-[0.5vw] max-[1025px]:w-[1.5vw] max-md:w-[2.3vw]" />
    </a>
  );
}
