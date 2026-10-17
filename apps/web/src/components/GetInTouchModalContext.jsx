import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const GetInTouchModalContext = createContext(null);

export function useGetInTouchModal() {
  const context = useContext(GetInTouchModalContext);
  if (!context) {
    throw new Error("useGetInTouchModal must be used within GetInTouchModalProvider");
  }
  return context;
}

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="relative shrink-0 size-14 rounded-full overflow-hidden flex items-center justify-center cursor-pointer max-[1025px]:size-11 max-md:size-9 group border border-[#3A3937]"
    >
      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-[#D4AF37] to-[#B38A3E]" />
      <span className="absolute h-0.5 z-2 w-4 rounded-full bg-[#0A0A0C] rotate-45 max-md:w-3 group-hover:rotate-225 duration-500 ease-in-out" />
      <span className="absolute h-0.5 z-2 w-4 rounded-full bg-[#0A0A0C] -rotate-45 max-md:w-3 group-hover:rotate-135 duration-500 ease-in-out" />
    </button>
  );
}

export function GetInTouchModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSubmitted(false);
  }, []);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Get in touch form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      closeModal();
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <GetInTouchModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-[4vw] max-md:px-4">
          <div className="relative w-full max-w-[75vw] max-h-[85vh] overflow-y-auto rounded-[2vw] bg-[#111113]/95 backdrop-blur-xl border border-[#3A3937] text-[#F7F5F0] p-[3vw] max-[1025px]:max-w-[85vw] max-[1025px]:p-8 max-md:max-w-full max-md:p-6 max-md:rounded-3xl shadow-2xl">
            <div className="absolute top-[2vw] right-[2vw] max-[1025px]:top-6 max-[1025px]:right-6 max-md:top-4 max-md:right-4 z-10">
              <CloseButton onClick={closeModal} />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-[3vw] items-start max-[1025px]:grid-cols-1 max-[1025px]:gap-8 pt-[2vw]">
              <div>
                <h2
                  id="get-in-touch-modal-title"
                  className="text-[4.8vw] leading-[1.1]! max-[1025px]:text-[5vw] max-md:text-[8vw] font-medium text-[#F7F5F0]"
                >
                  Apply for Admission
                </h2>
                <p className="mt-[1vw] text-[1.1vw] text-[#B8B6B0] max-[1025px]:text-[2.4vw] max-md:text-[4vw]">
                  Take the first step onto the runway. Submit your details for our upcoming academy season and casting evaluations.
                </p>
                <div className="mt-8 space-y-3 text-sm text-[#B8B6B0] max-md:text-xs">
                  <p>📍 Queen Academy Center · Palembang, Indonesia</p>
                  <p>⚡ Admission reviews: Within 48 hours</p>
                  <p>✉️ Direct: admissions@queensacademy.fashion</p>
                </div>
              </div>

              <div className="get-in-touch-form">
                {submitted ? (
                  <div className="py-12 text-center bg-[#1A1A1D] rounded-2xl border border-[#3A3937]">
                    <span className="text-4xl">👑</span>
                    <h3 className="text-2xl font-medium mt-3 text-[#F7F5F0]">Application Received!</h3>
                    <p className="text-[#B8B6B0] mt-2 text-sm">Our casting directors will review your profile and reach out shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name*"
                        required
                        className="w-full px-5 py-3 rounded-full bg-[#1A1A1D] border border-[#3A3937] text-[#F7F5F0] placeholder-[#B8B6B0]/60 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address*"
                        required
                        className="w-full px-5 py-3 rounded-full bg-[#1A1A1D] border border-[#3A3937] text-[#F7F5F0] placeholder-[#B8B6B0]/60 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number*"
                        required
                        className="w-full px-5 py-3 rounded-full bg-[#1A1A1D] border border-[#3A3937] text-[#F7F5F0] placeholder-[#B8B6B0]/60 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject*"
                        required
                        className="w-full px-5 py-3 rounded-full bg-[#1A1A1D] border border-[#3A3937] text-[#F7F5F0] placeholder-[#B8B6B0]/60 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message*"
                        rows={4}
                        required
                        className="w-full px-5 py-3 rounded-2xl bg-[#1A1A1D] border border-[#3A3937] text-[#F7F5F0] placeholder-[#B8B6B0]/60 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-full bg-linear-to-r from-[#D4AF37] to-[#B38A3E] text-[#0A0A0C] font-semibold hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </GetInTouchModalContext.Provider>
  );
}
