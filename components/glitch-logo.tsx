"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface GlitchLogoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function GlitchLogo({ 
  src, 
  alt, 
  width, 
  height, 
  className = "" 
}: GlitchLogoProps) {
  const [glitchState, setGlitchState] = useState(0);
  
  useEffect(() => {
    // Create a continuous glitch animation loop
    const glitchLoop = setInterval(() => {
      setGlitchState(prev => (prev + 1) % 4); // Cycle through 4 different glitch states
    }, 150); // Change state every 150ms for rapid glitching
    
    return () => clearInterval(glitchLoop);
  }, []);

  // Calculate offsets based on current glitch state
  const getOffsets = () => {
    switch(glitchState) {
      case 0: return { greenX: 2, greenY: 0, purpleX: -2, purpleY: 0 };
      case 1: return { greenX: 0, greenY: 2, purpleX: 0, purpleY: -2 };
      case 2: return { greenX: -2, greenY: -1, purpleX: 2, purpleY: 1 };
      case 3: return { greenX: 1, greenY: -2, purpleX: -1, purpleY: 2 };
      default: return { greenX: 0, greenY: 0, purpleX: 0, purpleY: 0 };
    }
  };

  const offsets = getOffsets();

  return (
    <div className="relative">
      {/* Base image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} opacity-90`}
      />
      
      {/* Green color channel */}
      <div className="absolute inset-0 mix-blend-screen opacity-70">
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          className={`${className}`}
          style={{ 
            transform: `translate(${offsets.greenX}px, ${offsets.greenY}px)`,
          }}
        />
      </div>
      
      {/* Purple color channel */}
      <div className="absolute inset-0 mix-blend-screen opacity-70">
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          className={`${className} `}
          style={{ 
            transform: `translate(${offsets.purpleX}px, ${offsets.purpleY}px)`,
          }}
        />
      </div>

      {/* Digital noise effect - always present */}
      <div 
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.15 + (glitchState * 0.05)
        }}
      />


      
      {/* Random blocks that appear during glitches - green */}
      {[...Array(2)].map((_, i) => (
        <div 
          key={`block-green-${i}`}
          className="absolute bg-[#29ED00] mix-blend-screen"
          style={{
            top: `${((i * 30) + (glitchState * 15)) % 100}%`,
            left: `${((i * 30) + (glitchState * 10)) % 100}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${2 + (i % 2) * 2}px`,
            opacity: (glitchState === i) ? 0.8 : 0,
          }}
        />
      ))}
      
      {/* Random blocks that appear during glitches - purple */}
      {[...Array(2)].map((_, i) => (
        <div 
          key={`block-purple-${i}`}
          className="absolute bg-[#C400ED] mix-blend-screen"
          style={{
            top: `${((i * 45) + (glitchState * 25)) % 100}%`,
            left: `${((i * 45) + (glitchState * 5)) % 100}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${2 + (i % 2) * 2}px`,
            opacity: (glitchState === i) ? 0.8 : 0,
          }}
        />
      ))}
      

    </div>
  );
}