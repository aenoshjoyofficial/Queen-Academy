import React from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PortfolioSection from "./components/PortfolioSection";
import WhyWorkWithMe from "./components/WhyWorkWithMe";
import ServicesSection from "./components/ServicesSection";
import AwardsSection from "./components/AwardsSection";
import ClientsSection from "./components/ClientsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import { GetInTouchModalProvider } from "./components/GetInTouchModalContext";

gsap.registerPlugin(ScrollTrigger);

function LenisScrollSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function App() {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        autoRaf: true,
      }}
    >
      <LenisScrollSync />
      <GetInTouchModalProvider>
        <div className="elenavoss-body min-h-screen w-full bg-[#0A0A0C] text-[#F7F5F0] selection:bg-[#D4AF37] selection:text-[#0A0A0C]">
          <Header />
          <main>
            <HeroSection />
            <PortfolioSection />
            <WhyWorkWithMe />
            <ServicesSection />
            <AwardsSection />
            <ClientsSection />
            <TestimonialsSection />
            <FAQSection />
          </main>
          <Footer />
        </div>
      </GetInTouchModalProvider>
    </ReactLenis>
  );
}
