import React from "react";

const Airplane2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      width="800"
      height="600"
      {...props}
    >
      <defs>
        <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9966" />
          <stop offset="100%" stopColor="#ff5e62" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="80%" cy="30%" r="50%" fx="80%" fy="30%">
          <stop offset="0%" stopColor="#ffdd00" />
          <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Sky background */}
      <rect width="800" height="600" fill="url(#sunsetGradient)" />
      
      {/* Sun */}
      <circle cx="650" cy="150" r="100" fill="url(#sunGlow)" opacity="0.8" />
      <circle cx="650" cy="150" r="60" fill="#fff3cd" />
      
      {/* Clouds */}
      <g fill="#ffffff" opacity="0.8">
        <ellipse cx="200" cy="100" rx="90" ry="40" />
        <ellipse cx="170" cy="80" rx="70" ry="30" />
        <ellipse cx="230" cy="80" rx="70" ry="30" />
        
        <ellipse cx="500" cy="200" rx="70" ry="30" />
        <ellipse cx="470" cy="180" rx="50" ry="25" />
        <ellipse cx="530" cy="180" rx="50" ry="25" />
      </g>
      
      {/* Airplane */}
      <g transform="translate(300, 350) scale(1.8) rotate(-10)">
        {/* Airplane body */}
        <path
          d="M-80,0 C-70,-15 -40,-20 20,-20 C70,-20 90,-10 100,0 C90,10 70,20 20,20 C-40,20 -70,15 -80,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1.5"
        />
        
        {/* Wings */}
        <path
          d="M0,0 L-20,-50 L20,-50 L30,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1.5"
        />
        <path
          d="M0,0 L-20,50 L20,50 L30,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1.5"
        />
        
        {/* Tail */}
        <path
          d="M-70,0 L-100,-30 L-90,-30 L-60,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1.5"
        />
        <path
          d="M-70,0 L-100,30 L-90,30 L-60,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1.5"
        />
        
        {/* Windows */}
        <g fill="#90caf9">
          {Array.from({ length: 7 }).map((_, i) => (
            <rect key={i} x={-50 + i * 15} y={-8} width={6} height={16} rx={2} />
          ))}
        </g>
      </g>
    </svg>
  );
};

export default Airplane2;
