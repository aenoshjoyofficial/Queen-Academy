import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextSplitter from "./TextSplitter";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Do I need previous modeling experience or a professional portfolio to apply?",
    answer:
      "No previous experience is required. Queens Academy welcomes aspiring talents with raw potential as well as working models looking to elevate their technique. Our beginner-to-advanced curriculum covers everything from initial posture fundamentals to high-fashion catwalk precision.",
  },
  {
    question: "What are the age, height, and entry requirements for Queens Academy?",
    answer:
      "We offer tailored divisions for High-Fashion Runway (typically 170cm+ for female and 183cm+ for male models), Commercial Modeling, and Teen & Pageant divisions with flexible height criteria. Applicants must be at least 14 years of age for youth programs, or 18+ for our global professional intensive.",
  },
  {
    question: "How do audition evaluations work and when do upcoming classes begin?",
    answer:
      "Auditions can be conducted either in-person at our flagship academy studios or via digital casting submission. Once your application is reviewed, shortlisted candidates are invited for a live walk assessment and interview with our faculty.",
  },
  {
    question: "Does Queens Academy guarantee agency placement or contracts?",
    answer:
      "While reputable academies cannot ethically guarantee contracts, our graduation showcase is attended directly by scouts from IMG, Elite, Next, and premier boutique agencies. Over 82% of our graduates sign representation within 6 months of completing the curriculum.",
  },
  {
    question: "What should I wear and bring to my initial audition?",
    answer:
      "Please arrive in form-fitting attire (classic black tank top and slim denim or leggings), natural hair, minimal to no makeup, and a pair of comfortable heels (2.5 to 3.5 inches). Digital photos will be taken during your session.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const itemsRef = useRef([]);
  const answerRefs = useRef([]);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mql.matches);
    const onChange = (e) => setIsReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const validItems = itemsRef.current.filter(Boolean);
    if (isReduced) {
      gsap.set(validItems, { opacity: 1, y: 0 });
      return;
    }

    const tweens = validItems.map((el) =>
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )
    );

    return () => {
      tweens.forEach((t) => t.scrollTrigger?.kill());
      tweens.forEach((t) => t.kill());
    };
  }, [isReduced]);

  const toggleItem = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="w-full py-[6vw] px-[10vw] relative bg-[#0A0A0C] text-[#F7F5F0] max-[1025px]:px-[5vw]">
      <TextSplitter stagger={0.015}>
        <h2 className="text-[5.5vw] text-center mb-[6vw] max-[1025px]:text-[7vw] max-md:text-[9vw] font-medium text-[#F7F5F0]">
          Auditions & Admissions FAQ
        </h2>
      </TextSplitter>

      <div className="w-full mx-auto">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.question}
              ref={(el) => (itemsRef.current[idx] = el)}
              className="opacity-0"
            >
              <div
                className="cursor-pointer border-b border-[#3A3937] py-8 group max-md:py-5"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => toggleItem(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(idx);
                  }
                }}
              >
                <div className="flex w-full items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-6 w-full max-md:gap-4">
                      <span className="text-[1.5vw] font-normal max-[1025px]:text-[2.6vw] max-md:text-[4.2vw] text-[#F7F5F0] group-hover:text-[#D4AF37] transition-colors">
                        {faq.question}
                      </span>

                      <div className="relative shrink-0 size-14 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300 ease-out border border-[#3A3937] bg-[#111113] max-[1025px]:size-11 max-md:size-9">
                        <span className="absolute h-[2px] z-2 w-4 rounded-full bg-[#F7F5F0] max-md:w-3" />
                        <span
                          className={`absolute h-[2px] z-2 w-4 rounded-full bg-[#F7F5F0] transition-transform duration-300 ease-out max-md:w-3 ${
                            isOpen ? "rotate-0" : "rotate-90"
                          }`}
                        />
                        <div
                          className={`absolute inset-0 w-full h-full bg-linear-to-r from-[#D4AF37] to-[#B38A3E] group-hover:scale-100 ease-in-out origin-center rounded-full duration-300 ${
                            isOpen ? "scale-100" : "scale-0"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  ref={(el) => (answerRefs.current[idx] = el)}
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    overflow: "hidden",
                    transition: isReduced ? "none" : "max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="pt-4 pr-[3vw] w-[80%] max-[1025px]:w-full max-[1025px]:pr-0 max-md:w-full max-md:pr-0">
                    <p className="text-[1.25vw] leading-[1.6] text-[#B8B6B0] max-[1025px]:text-[2.2vw] max-md:text-[3.8vw]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
