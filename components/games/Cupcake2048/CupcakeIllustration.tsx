import React from 'react';

interface CupcakeProps {
  value: number;
  className?: string;
}

export default function CupcakeIllustration({ value, className = 'w-10 h-10' }: CupcakeProps) {
  switch (value) {
    case 2:
      // Vanilla Joy - Cream frosting with colorful rainbow sprinkles
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Fluted Wrapper */}
          <path d="M16 38L20 58H44L48 38H16Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cake Base */}
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#D97706" />
          {/* Creamy Vanilla Swirl Frosting */}
          <path d="M14 36C14 31 20 28 26 28C28 24 36 24 38 28C44 28 50 31 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 18C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
          <path d="M28 20C30 16 32 14 32 13C32 14 34 16 36 20C34 21 30 21 28 20Z" fill="#FEF08A" />
          {/* Rainbow Sprinkles */}
          <circle cx="24" cy="34" r="1.5" fill="#EF4444" />
          <circle cx="32" cy="35" r="1.5" fill="#3B82F6" />
          <circle cx="40" cy="33" r="1.5" fill="#10B981" />
          <circle cx="28" cy="25" r="1.2" fill="#EC4899" />
          <circle cx="36" cy="24" r="1.2" fill="#8B5CF6" />
        </svg>
      );

    case 4:
      // Bubblegum Pink - Bright pink frosting with a glossy red cherry
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pink Wrapper */}
          <path d="M16 38L20 58H44L48 38H16Z" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#F472B6" />
          {/* Strawberry Swirl */}
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FBCFE8" stroke="#BE185D" strokeWidth="1.5" />
          {/* Cherry on Top */}
          <path d="M32 17C32 12 37 8 41 7" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="17" r="4.5" fill="#DC2626" />
          <circle cx="30.5" cy="15.5" r="1.2" fill="#FCA5A5" />
        </svg>
      );

    case 8:
      // Choco Sundae - Deep cocoa chocolate swirl with white cream dollop
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gold Stripe Wrapper */}
          <path d="M16 38L20 58H44L48 38H16Z" fill="#451A03" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#78350F" />
          {/* Rich Chocolate Frosting */}
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#78350F" stroke="#361502" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 18C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#92400E" stroke="#361502" strokeWidth="1.5" />
          {/* Whipped Cream Top */}
          <path d="M28 20C30 16 32 13 32 12C32 13 34 16 36 20C34 21 30 21 28 20Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
          {/* Chocolate sprinkles */}
          <rect x="23" y="33" width="3" height="1.2" rx="0.6" fill="#FDE68A" transform="rotate(25 23 33)" />
          <rect x="37" y="32" width="3" height="1.2" rx="0.6" fill="#FDE68A" transform="rotate(-30 37 32)" />
        </svg>
      );

    case 16:
      // Caramel Swirl - Golden caramel with sea-salt amber glaze
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#B45309" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          {/* Caramel Drip */}
          <path d="M24 33C24 38 27 38 27 33M35 34C35 40 38 40 38 34" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
          {/* Sea Salt Crystal */}
          <polygon points="32,13 34,16 32,19 30,16" fill="#FFFFFF" />
        </svg>
      );

    case 32:
      // Cookies & Cream - Dark cocoa base, white cream, crushed cookie bits
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#334155" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#1E293B" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Oreo Cookie Half on Top */}
          <path d="M28 17C28 13 32 11 36 12C38 14 38 17 38 17Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
          {/* Crushed bits */}
          <circle cx="21" cy="34" r="1.3" fill="#0F172A" />
          <circle cx="27" cy="36" r="1" fill="#0F172A" />
          <circle cx="35" cy="34" r="1.3" fill="#0F172A" />
          <circle cx="43" cy="33" r="1" fill="#0F172A" />
          <circle cx="31" cy="25" r="1.2" fill="#0F172A" />
        </svg>
      );

    case 64:
      // Lemon Blossom - Sunny yellow citrus with white sugar blossom
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#EAB308" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Sugar Flower on Top */}
          <circle cx="32" cy="15" r="3.5" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="32" cy="15" r="1.5" fill="#EAB308" />
        </svg>
      );

    case 128:
      // Wild Berry - Purple blackberry with glittering sugar glaze
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#581C87" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#9333EA" stroke="#581C87" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#C084FC" stroke="#581C87" strokeWidth="1.5" />
          {/* Triple Berry Topper */}
          <circle cx="30" cy="16" r="2.5" fill="#6B21A8" />
          <circle cx="34" cy="16" r="2.5" fill="#581C87" />
          <circle cx="32" cy="12.5" r="2.5" fill="#7E22CE" />
        </svg>
      );

    case 256:
      // Red Velvet - Crimson cake, white cream cheese swirl & candy heart
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#FECDD3" stroke="#BE123C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#881337" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#FFF1F2" stroke="#BE123C" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FFFFFF" stroke="#BE123C" strokeWidth="1.5" />
          {/* Sugar Heart on Top */}
          <path d="M32 17L30 14.5C28.5 13 29 11 30.5 11C31.5 11 32 12 32 12C32 12 32.5 11 33.5 11C35 11 35.5 13 34 14.5L32 17Z" fill="#E11D48" />
        </svg>
      );

    case 512:
      // Matcha Mint - Green tea swirl with fresh green mint sprig
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#D1FAE5" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#064E3B" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#10B981" stroke="#064E3B" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#34D399" stroke="#064E3B" strokeWidth="1.5" />
          {/* Mint Leaf Top */}
          <path d="M32 16C32 12 36 9 39 10C39 14 36 16 32 16Z" fill="#059669" />
          <path d="M32 16C32 13 28 11 26 12C26 15 29 16 32 16Z" fill="#10B981" />
        </svg>
      );

    case 1024:
      // 24K Gold Leaf - Espresso chocolate base, edible gold leaf foil
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#1C1917" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#78350F" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FCD34D" stroke="#78350F" strokeWidth="1.5" />
          {/* Gold Crown Leaf Topper */}
          <path d="M26 16L29 11L32 14L35 11L38 16Z" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
          <circle cx="32" cy="9.5" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 2048:
      // The Ultimate Diamond Crown Cupcake - Holographic iridescent cupcake with glowing tiara
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rainbowGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="0.5" stopColor="#E879F9" />
              <stop offset="1" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
          <path d="M16 38L20 58H44L48 38H16Z" fill="url(#rainbowGrad)" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#FFFFFF" opacity="0.9" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="url(#rainbowGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#FFFFFF" stroke="#06B6D4" strokeWidth="1.5" />
          {/* Diamond Tiara Crown */}
          <path d="M24 16L27 10L32 14L37 10L40 16Z" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="27" cy="9" r="1.5" fill="#FFFFFF" />
          <circle cx="32" cy="13" r="1.5" fill="#FFFFFF" />
          <circle cx="37" cy="9" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    default:
      // 4096+ Cosmic Galaxy Cupcake
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 38L20 58H44L48 38H16Z" fill="#312E81" stroke="#A855F7" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 38L24 58M28 38L29 58M34 38L34 58M40 38L39 58" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="17" ry="5" fill="#1E1B4B" />
          <path d="M14 36C14 30 20 28 26 28C28 24 36 24 38 28C44 28 50 30 50 36C50 40 44 41 32 41C20 41 14 40 14 36Z" fill="#7C3AED" stroke="#E879F9" strokeWidth="1.5" />
          <path d="M22 28C24 22 28 20 32 17C36 20 40 22 42 28C38 30 26 30 22 28Z" fill="#C084FC" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Cosmic Star Topper */}
          <polygon points="32,8 34,13 39,14 35,17 36,22 32,19 28,22 29,17 25,14 30,13" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      );
  }
}
