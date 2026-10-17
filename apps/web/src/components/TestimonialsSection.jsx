import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import TextSplitter from "./TextSplitter";

import test1 from "../assets/testimonial-1.1n9zd7_gpp9li.webp";
import test2 from "../assets/testimonial-2.2mihuvuv56utd.webp";
import test3 from "../assets/testimonial-3.25i3vd2ma4kps.webp";
import testFemale4 from "../assets/testimonial-female-4.jpg";
import testFemale5 from "../assets/testimonial-female-5.jpg";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Joining Queens Academy completely transformed my runway walk and confidence. Within three months of graduating, I signed with an international agency in Milan and walked my first Paris Fashion Week show. The coaches here don't just teach you to walk—they teach you to command the room.",
    name: "Genevieve Laurent",
    role: "Signed Model, IMG Models Europe",
    image: test1,
  },
  {
    quote:
      "The editorial posing and camera movement masterclasses gave me the exact portfolio I needed to book luxury commercial campaigns. Their attention to posture, lighting angles, and expression control is unmatched.",
    name: "Aria Sterling",
    role: "Editorial Model & Miss Universe Finalist",
    image: testFemale5,
  },
  {
    quote:
      "As an international agency director, Queens Academy is our first stop for fresh runway talent. Every graduate arrives with high-fashion etiquette, poise, and catwalk discipline that usually takes years to develop.",
    name: "Jeanine Moreau",
    role: "Senior Booking Director, Elite Worldwide",
    image: test3,
  },
  {
    quote:
      "The pageant and public speaking coaching transformed not just my stage presence, but my entire mindset. Winning the national crown was a dream made possible by the dedicated mentorship at Queens Academy.",
    name: "Camille Vance",
    role: "National Pageant Winner & Brand Ambassador",
    image: testFemale4,
  },
  {
    quote:
      "I walked into Queens Academy with no modeling experience. Today, I'm booking cover editorials and runway shows across New York. The Queens Standard truly sets you apart from thousands of aspiring models.",
    name: "Elena Rostova",
    role: "Fashion Model, Next Model Management",
    image: test2,
  },
];

function TestimonialCard({ item, onSwipe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.25 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe("prev");
        else if (info.offset.x < -100) onSwipe("next");
      }}
      className="pt-[8vw] pb-[4vw] px-[6vw] w-full h-full flex flex-col items-center justify-center gap-[2.5vw] text-center max-[1025px]:pt-[14vw] max-[1025px]:px-[8vw] max-[1025px]:gap-[4vw] max-md:pt-[22vw] max-md:px-[7vw] max-md:pb-[8vw] max-md:gap-[6vw]"
    >
      <div className="flex flex-col gap-[0.4vw] max-md:gap-2">
        <p className="text-[2.6vw] text-[#F0C888] max-[1025px]:text-[4vw] max-md:text-[6vw] font-medium">
          {item.name}
        </p>
        <p className="text-[1.145vw] text-[#B8B6B0] max-[1025px]:text-[2.2vw] max-md:text-[3.6vw]">
          {item.role}
        </p>
      </div>
      <p className="text-[1.145vw] leading-[1.6] text-[#F7F5F0]/90 w-[82%] max-[1025px]:text-[2.2vw] max-[1025px]:w-full max-md:text-[3.6vw]">
        “{item.quote}”
      </p>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const total = testimonials.length;

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeEls = gsap.utils.toArray(".testimonial-fade");

    if (isReduced) {
      gsap.set(fadeEls, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      fadeEls,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0A0A0C] py-[7vw] px-[4vw] max-[1025px]:px-[5vw] max-[1025px]:py-[12vw]"
      id="testimonials"
    >
      <div className="w-full flex flex-col gap-[6vw] max-[1025px]:gap-[12vw]">
        <div className="w-[65%] mx-auto max-[1025px]:w-full">
          <TextSplitter stagger={0.015}>
            <h2 className="text-[5.2vw] leading-[1.2]! text-center max-[1025px]:text-[7vw] max-md:text-[9vw] font-medium text-[#F7F5F0]">
              Voices of Our Queens
            </h2>
          </TextSplitter>
        </div>

        <div className="relative max-md:mt-10">
          {/* Main Testimonial Card */}
          <div className="testimonial-fade opacity-0 relative w-3/5 mx-auto rounded-[2vw] border border-[#3A3937] bg-[#111113] overflow-hidden max-[1025px]:w-full max-[1025px]:rounded-[5vw] h-[30vw] max-[1025px]:h-[52vw] max-md:h-[95vw] shadow-2xl">
            <AnimatePresence mode="wait">
              <TestimonialCard
                key={testimonials[currentIndex].name}
                item={testimonials[currentIndex]}
                onSwipe={(dir) => {
                  if (dir === "next") nextTestimonial();
                  if (dir === "prev") prevTestimonial();
                }}
              />
            </AnimatePresence>
          </div>

          {/* Avatar Orbit Selector */}
          <div className="testimonial-fade opacity-0 flex w-full justify-center items-center absolute -top-[2vw] left-1/2 -translate-x-1/2 max-md:-top-[6vw]">
            {testimonials.map((person, idx) => {
              const half = Math.floor(total / 2);
              const rel = (idx - currentIndex + total) % total;
              const order = rel <= half ? rel : rel - total;
              const isSelected = order === 0;

              return (
                <motion.button
                  key={person.name}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Show testimonial from ${person.name}`}
                  aria-current={isSelected}
                  layout
                  animate={{ scale: isSelected ? 1.6 : 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    order,
                    zIndex: isSelected ? 10 : total - Math.abs(order),
                  }}
                  className={`w-[5vw] h-[5vw] rounded-full overflow-hidden [clip-path:circle(50%)] cursor-pointer max-[1025px]:w-[9vw] max-[1025px]:h-[9vw] max-md:w-[12vw] max-md:h-[12vw] ${
                    isSelected
                      ? "bg-linear-to-r from-[#D4AF37] to-[#B38A3E] p-[0.3vw] mx-[2vw] max-md:mx-[4vw]"
                      : `opacity-60 hover:opacity-100 ${order < 0 ? "-mr-[1vw]" : "-ml-[1vw]"}`
                  }`}
                >
                  <img
                    src={person.image}
                    alt={person.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="testimonial-fade opacity-0 flex justify-center gap-3 mt-[3vw] max-md:mt-[8vw]">
            <button
              type="button"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="size-12 rounded-full border border-[#3A3937] bg-[#111113] flex items-center justify-center text-[#F7F5F0]/80 hover:text-[#0A0A0C] transition-colors cursor-pointer relative group overflow-hidden max-md:size-10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative z-2">
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-[#D4AF37] to-[#B38A3E] group-hover:scale-100 scale-0 ease-in-out origin-center rounded-full duration-300" />
            </button>

            <button
              type="button"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="size-12 rounded-full border border-[#3A3937] bg-[#111113] flex items-center justify-center text-[#F7F5F0]/80 hover:text-[#0A0A0C] transition-colors cursor-pointer relative group overflow-hidden max-md:size-10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative z-2">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-[#D4AF37] to-[#B38A3E] group-hover:scale-100 scale-0 ease-in-out origin-center rounded-full duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
