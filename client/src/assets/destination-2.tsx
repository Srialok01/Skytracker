import React from "react";

const Destination2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      width="800"
      height="500"
      {...props}
    >
      <defs>
        <linearGradient id="skyGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#283E51" />
          <stop offset="100%" stopColor="#4B79A1" />
        </linearGradient>
      </defs>
      
      {/* Sky */}
      <rect width="800" height="500" fill="url(#skyGradient2)" />
      
      {/* Moon */}
      <circle cx="650" cy="100" r="40" fill="#FFFFFF" opacity="0.8" />
      
      {/* Stars */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = Math.random() * 800;
        const y = Math.random() * 200;
        const r = Math.random() * 1.5 + 0.5;
        return <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={Math.random() * 0.5 + 0.5} />;
      })}
      
      {/* Ground */}
      <rect x="0" y="350" width="800" height="150" fill="#333333" />
      
      {/* Empire State Building */}
      <g transform="translate(400, 350)">
        <rect x="-30" y="-250" width="60" height="250" fill="#555555" />
        <rect x="-40" y="-260" width="80" height="10" fill="#777777" />
        <rect x="-20" y="-300" width="40" height="40" fill="#555555" />
        <rect x="-25" y="-310" width="50" height="10" fill="#777777" />
        <rect x="-10" y="-350" width="20" height="40" fill="#555555" />
        <rect x="-5" y="-370" width="10" height="20" fill="#555555" />
        
        {/* Windows */}
        {Array.from({ length: 20 }).map((_, i) => (
          <g key={i}>
            <rect x="-25" y={-240 + i * 12} width="10" height="8" fill="#FFEB3B" opacity="0.8" />
            <rect x="-10" y={-240 + i * 12} width="10" height="8" fill="#FFEB3B" opacity="0.8" />
            <rect x="5" y={-240 + i * 12} width="10" height="8" fill="#FFEB3B" opacity="0.8" />
          </g>
        ))}
      </g>
      
      {/* One World Trade Center */}
      <g transform="translate(550, 350)">
        <polygon points="-25,-280 25,-280 15,0 -15,0" fill="#8EABC9" />
        <rect x="-30" y="-290" width="60" height="10" fill="#AAAAAA" />
        <rect x="-5" y="-350" width="10" height="60" fill="#AAAAAA" />
        
        {/* Windows */}
        {Array.from({ length: 25 }).map((_, i) => (
          <g key={i}>
            <rect x="-20" y={-270 + i * 10} width="8" height="6" fill="#FFEB3B" opacity="0.7" />
            <rect x="-5" y={-270 + i * 10} width="8" height="6" fill="#FFEB3B" opacity="0.7" />
            <rect x="10" y={-270 + i * 10} width="8" height="6" fill="#FFEB3B" opacity="0.7" />
          </g>
        ))}
      </g>
      
      {/* Chrysler Building */}
      <g transform="translate(250, 350)">
        <rect x="-20" y="-200" width="40" height="200" fill="#BBB" />
        <polygon points="-20,-200 20,-200 0,-250 -20,-200" fill="#DDD" />
        
        {/* Windows */}
        {Array.from({ length: 15 }).map((_, i) => (
          <g key={i}>
            <rect x="-15" y={-190 + i * 12} width="6" height="8" fill="#FFEB3B" opacity="0.8" />
            <rect x="-5" y={-190 + i * 12} width="6" height="8" fill="#FFEB3B" opacity="0.8" />
            <rect x="5" y={-190 + i * 12} width="6" height="8" fill="#FFEB3B" opacity="0.8" />
          </g>
        ))}
      </g>
      
      {/* Other Buildings */}
      <g>
        {/* Building 1 */}
        <rect x="100" y="200" width="50" height="150" fill="#555555" />
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <rect x="110" y={210 + i * 12} width="8" height="8" fill="#FFEB3B" opacity="0.7" />
            <rect x="130" y={210 + i * 12} width="8" height="8" fill="#FFEB3B" opacity="0.7" />
          </g>
        ))}
        
        {/* Building 2 */}
        <rect x="160" y="230" width="40" height="120" fill="#444444" />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <rect x="168" y={240 + i * 12} width="8" height="8" fill="#FFEB3B" opacity="0.7" />
            <rect x="185" y={240 + i * 12} width="8" height="8" fill="#FFEB3B" opacity="0.7" />
          </g>
        ))}
        
        {/* Building 3 */}
        <rect x="650" y="250" width="60" height="100" fill="#666666" />
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <rect x="660" y={260 + i * 12} width="8" height="8" fill="#FFEB3B" opacity="0.7" />
            <rect x="675" y={260 + i * 12} width="8" height="8" fill="#FFEB3B" opacity="0.7" />
            <rect x="690" y={260 + i * 12} width="8" height="8" fill="#FFEB3B" opacity="0.7" />
          </g>
        ))}
      </g>
      
      {/* Road */}
      <rect x="0" y="350" width="800" height="30" fill="#333333" />
      <g>
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={i * 40 + 10} y="364" width="20" height="3" fill="#FFFFFF" />
        ))}
      </g>
      
      {/* Taxi */}
      <g transform="translate(150, 345)">
        <rect x="-20" y="-10" width="40" height="10" fill="#FFEB3B" />
        <rect x="-25" y="-15" width="50" height="5" fill="#FFEB3B" />
        <circle cx="-15" cy="0" r="5" fill="#333333" />
        <circle cx="15" cy="0" r="5" fill="#333333" />
      </g>
      
      {/* New York text */}
      <text
        x="400"
        y="420"
        fontFamily="'Arial', sans-serif"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        fill="#FFFFFF"
      >
        NEW YORK
      </text>
    </svg>
  );
};

export default Destination2;
