import React from 'react';

export const LuxuryGoldGeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-black">
      {/* Pure Deep Pitch Black Base */}
      <div className="absolute inset-0 bg-black" />

      {/* SVG Geometric Gold Luxury Vector Accents on Clean Black (Faithful to Reference Art) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-95 transition-opacity duration-700"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1920 1080"
      >
        <defs>
          {/* Crisp Metallic Gold Linear Gradients */}
          <linearGradient id="goldLaserSharp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9DB" stopOpacity="1" />
            <stop offset="20%" stopColor="#FDE047" stopOpacity="1" />
            <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#D97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="goldLaserSharpRev" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9DB" stopOpacity="1" />
            <stop offset="20%" stopColor="#FDE047" stopOpacity="1" />
            <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#D97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="goldHorizonSharp" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
            <stop offset="25%" stopColor="#FDE047" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFFDF0" stopOpacity="1" />
            <stop offset="75%" stopColor="#FDE047" stopOpacity="1" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          {/* Crisp Dark Metallic Diagonal Pinstripe Pattern */}
          <pattern id="diagonalGoldStripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(245, 158, 11, 0.22)" strokeWidth="1" />
          </pattern>

          <pattern id="diagonalGoldStripesReverse" width="12" height="12" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(245, 158, 11, 0.22)" strokeWidth="1" />
          </pattern>

          {/* Precision Gold Glitter Dot Matrix (Sparkle Stippling matching reference image) */}
          <pattern id="goldDotsPattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.2" fill="#FDE047" opacity="0.75" />
            <circle cx="16" cy="16" r="1.6" fill="#FFFBEB" opacity="0.95" />
            <circle cx="20" cy="6" r="0.9" fill="#F59E0B" opacity="0.65" />
            <circle cx="8" cy="18" r="1.1" fill="#FBBF24" opacity="0.8" />
          </pattern>
        </defs>

        {/* Diagonal Carbon / Gold Pinstripe Triangular Wings */}
        <polygon points="0,0 520,0 140,500 0,420" fill="url(#diagonalGoldStripes)" />
        <polygon points="1920,0 1400,0 1780,500 1920,420" fill="url(#diagonalGoldStripesReverse)" />
        
        <polygon points="0,1080 440,1080 120,720 0,780" fill="url(#diagonalGoldStripes)" />
        <polygon points="1920,1080 1480,1080 1800,720 1920,780" fill="url(#diagonalGoldStripesReverse)" />

        {/* Dense Stippled Gold Glitter Dot Clusters (Matching Reference Image) */}
        <polygon points="0,0 380,0 60,420 0,380" fill="url(#goldDotsPattern)" />
        <polygon points="1920,0 1540,0 1860,420 1920,380" fill="url(#goldDotsPattern)" />
        <polygon points="0,640 320,1080 0,1080" fill="url(#goldDotsPattern)" />
        <polygon points="1920,640 1600,1080 1920,1080" fill="url(#goldDotsPattern)" />

        {/* Primary Geometric Chevron & Diagonal Gold Laser Lines (Left Wing) */}
        <g>
          {/* Main Angular Chevron Line */}
          <polyline
            points="0,50 560,0 180,560 0,480"
            fill="none"
            stroke="url(#goldLaserSharp)"
            strokeWidth="2.5"
          />
          {/* Inner Accent Line */}
          <polyline
            points="0,130 480,0 240,460"
            fill="none"
            stroke="url(#goldLaserSharp)"
            strokeWidth="1.5"
            strokeDasharray="12, 6"
            opacity="0.9"
          />
          {/* Diagonal Laser Spear connecting across background */}
          <line
            x1="0"
            y1="200"
            x2="680"
            y2="820"
            stroke="url(#goldLaserSharp)"
            strokeWidth="1.8"
            opacity="0.9"
          />
          {/* Bottom Left Triangular Razor */}
          <polyline
            points="0,640 300,1080 90,1080"
            fill="none"
            stroke="url(#goldLaserSharp)"
            strokeWidth="2.2"
          />
          <line
            x1="0"
            y1="780"
            x2="440"
            y2="1080"
            stroke="url(#goldLaserSharp)"
            strokeWidth="1.5"
            opacity="0.8"
          />
        </g>

        {/* Symmetrical Geometric Chevron & Diagonal Gold Laser Lines (Right Wing) */}
        <g>
          {/* Main Angular Chevron Line */}
          <polyline
            points="1920,50 1360,0 1740,560 1920,480"
            fill="none"
            stroke="url(#goldLaserSharpRev)"
            strokeWidth="2.5"
          />
          {/* Inner Accent Line */}
          <polyline
            points="1920,130 1440,0 1680,460"
            fill="none"
            stroke="url(#goldLaserSharpRev)"
            strokeWidth="1.5"
            strokeDasharray="12, 6"
            opacity="0.9"
          />
          {/* Diagonal Laser Spear connecting across background */}
          <line
            x1="1920"
            y1="200"
            x2="1240"
            y2="820"
            stroke="url(#goldLaserSharpRev)"
            strokeWidth="1.8"
            opacity="0.9"
          />
          {/* Bottom Right Triangular Razor */}
          <polyline
            points="1920,640 1620,1080 1830,1080"
            fill="none"
            stroke="url(#goldLaserSharpRev)"
            strokeWidth="2.2"
          />
          <line
            x1="1920"
            y1="780"
            x2="1480"
            y2="1080"
            stroke="url(#goldLaserSharpRev)"
            strokeWidth="1.5"
            opacity="0.8"
          />
        </g>

        {/* Top and Bottom Sharp Horizon Accent Lines */}
        <line
          x1="560"
          y1="0"
          x2="1360"
          y2="0"
          stroke="url(#goldHorizonSharp)"
          strokeWidth="3"
        />
        <line
          x1="680"
          y1="1080"
          x2="1240"
          y2="1080"
          stroke="url(#goldHorizonSharp)"
          strokeWidth="2.5"
        />

        {/* Discrete Precise Gold Sparkle Stars at Vertices */}
        <circle cx="310" cy="190" r="2.5" fill="#FFFDF0" />
        <circle cx="420" cy="290" r="2" fill="#FDE047" />
        <circle cx="1610" cy="190" r="2.5" fill="#FFFDF0" />
        <circle cx="1500" cy="290" r="2" fill="#FDE047" />
        <circle cx="210" cy="740" r="2" fill="#FDE047" />
        <circle cx="1710" cy="740" r="2" fill="#FDE047" />
      </svg>
    </div>
  );
};

export default LuxuryGoldGeometricBackground;
