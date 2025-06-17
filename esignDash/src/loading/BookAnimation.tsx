import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';

type TextRef = HTMLParagraphElement | null;

const BookAnimation: React.FC = () => {
  const textRefs = useRef<TextRef[]>([]);
  const texts = [
    "Initializing...",
    "Gathering resources...",
    "Processing data...",
    "Loading content...",
    "Almost there...",
    "Preparing your experience...",
    "Setting things up...",
    "Finalizing...",
    "Almost ready...",
    "Just a moment...",
    "Crunching numbers...",
    "Getting things ready...",
    "Building your view...",
    "Almost done...",
    "Hang tight..."
  ];
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

    texts.forEach((_, index) => {
      const ref = textRefs.current[index];
      if (ref) {
        tl
          .to(ref, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
          }, "-=0.8")
          .to({}, { duration: 3 })
          .to(ref, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
          });
      } 
    });
  }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-[#ffffff]">
           {texts.map((text, index) => (
        <p
          key={index}
          ref={el => textRefs.current[index] = el}
          className="absolute top-[40%] text-[#283d43] font-bold text-5xl opacity-0"
        >
          {text}
        </p>
      ))}
          <div className="relative w-20 h-12">
            {/* <p className="absolute top-0 m-0 text-[#283d43] font-bold text-xs tracking-widest animate-loading-text">
              loading
            </p> */}
            <span className="absolute bottom-0 w-4 h-4 bg-[#1d2c30] rounded-full transform translate-x-16 animate-loading-ball">
              <span className="absolute w-full h-full bg-[#6f9ca9] rounded-full animate-loading-ball-inner"></span>
            </span>
          </div>
        </div>
      );
};

export default BookAnimation;
