import React from "react";

const Destination4: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      width="800"
      height="500"
      {...props}
    >
      <defs>
        <linearGradient id="skyGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB75E" />
          <stop offset="100%" stopColor="#ED8F03" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="10%" cy="30%" r="50%" fx="10%" fy="30%">
          <stop offset="0%" stopColor="#FFEB3B" />
          <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Sky - sunset */}
      <rect width="800" height="500" fill="url(#skyGradient4)" />
      
      {/* Sun setting */}
      <circle cx="100" cy="150" r="80" fill="url(#sunGlow)" opacity="0.9" />
      <circle cx="100" cy="150" r="50" fill="#FFEB3B" />
      
      {/* Golden Gate Bridge */}
      <g transform="translate(400, 250)">
        {/* Bridge span */}
        <path
          d="M-350,0 C-200,-100 200,-100 350,0"
          stroke="#FF5722"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Road */}
        <path
          d="M-350,0 C-200,-80 200,-80 350,0"
          stroke="#455A64"
          strokeWidth="20"
          fill="none"
        />
        
        {/* Support cables */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x = -300 + i * 30;
          const y = i % 2 === 0 ? -10 : -5;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x}
              y2={-Math.abs(Math.sin(i * 0.4) * 80) - 10}
              stroke="#FF5722"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Left tower */}
        <rect x="-200" y="-150" width="10" height="180" fill="#FF5722" />
        <rect x="-140" y="-150" width="10" height="180" fill="#FF5722" />
        <rect x="-200" y="-150" width="70" height="20" fill="#FF5722" />
        <rect x="-200" y="-100" width="70" height="10" fill="#FF5722" />
        
        {/* Right tower */}
        <rect x="130" y="-150" width="10" height="180" fill="#FF5722" />
        <rect x="190" y="-150" width="10" height="180" fill="#FF5722" />
        <rect x="130" y="-150" width="70" height="20" fill="#FF5722" />
        <rect x="130" y="-100" width="70" height="10" fill="#FF5722" />
      </g>
      
      {/* Water */}
      <path
        d="M0,250 L800,250 L800,500 L0,500 Z"
        fill="#0277BD"
      />
      
      {/* Ripples in water */}
      {Array.from({ length: 10 }).map((_, i) => (
        <path
          key={i}
          d={`M0,${280 + i * 20} Q200,${290 + i * 20} 400,${280 + i * 20} Q600,${270 + i * 20} 800,${280 + i * 20}`}
          stroke="#039BE5"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      ))}
      
      {/* City skyline in background */}
      <g transform="translate(0, 250)">
        {/* Transamerica Pyramid */}
        <polygon points="550,-100 570,-240 590,-100" fill="#78909C" />
        
        {/* Salesforce Tower */}
        <path
          d="M620,-100 C620,-140 630,-180 630,-220 C630,-180 640,-140 640,-100"
          fill="#90A4AE"
        />
        
        {/* Other buildings */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = i * 50 + 50;
          const height = Math.random() * 100 + 20;
          return (
            <rect
              key={i}
              x={x}
              y={-height}
              width="30"
              height={height}
              fill={`rgba(${120 + Math.random() * 40}, ${120 + Math.random() * 40}, ${120 + Math.random() * 40}, 0.8)`}
            />
          );
        })}
      </g>
      
      {/* Fog rolling in */}
      <path
        d="M0,220 Q200,200 400,230 Q600,260 800,220 L800,250 L0,250 Z"
        fill="rgba(255, 255, 255, 0.5)"
      />
      
      {/* Sailboats */}
      <g transform="translate(150, 300)">
        <polygon points="0,0 0,-40 20,-20 0,0" fill="#FFFFFF" />
        <path d="M0,0 L20,0" stroke="#90A4AE" strokeWidth="3" />
      </g>
      <g transform="translate(500, 320)">
        <polygon points="0,0 0,-30 15,-15 0,0" fill="#FFFFFF" />
        <path d="M0,0 L15,0" stroke="#90A4AE" strokeWidth="2" />
      </g>
      <g transform="translate(650, 350)">
        <polygon points="0,0 0,-35 18,-18 0,0" fill="#FFFFFF" />
        <path d="M0,0 L18,0" stroke="#90A4AE" strokeWidth="2" />
      </g>
      
      {/* San Francisco text */}
      <text
        x="400"
        y="400"
        fontFamily="'Arial', sans-serif"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="1"
      >
        SAN FRANCISCO
      </text>
    </svg>
  );
};

export default Destination4;
