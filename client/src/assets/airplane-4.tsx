import React from "react";

const Airplane4: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      width="800"
      height="600"
      {...props}
    >
      <defs>
        <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f2027" />
          <stop offset="50%" stopColor="#203a43" />
          <stop offset="100%" stopColor="#2c5364" />
        </linearGradient>
      </defs>
      
      {/* Night sky background */}
      <rect width="800" height="600" fill="url(#nightSkyGradient)" />
      
      {/* Stars */}
      {Array.from({ length: 100 }).map((_, i) => {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.5 + 0.5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={size}
            fill="#ffffff"
            opacity={opacity}
          />
        );
      })}
      
      {/* Moon */}
      <circle cx="650" cy="150" r="50" fill="#f2f2f2" />
      <circle cx="630" cy="140" r="15" fill="#e0e0e0" />
      <circle cx="670" cy="170" r="10" fill="#e0e0e0" />
      <circle cx="680" cy="130" r="8" fill="#e0e0e0" />
      
      {/* Clouds */}
      <g fill="#445A67" opacity="0.7">
        <g transform="translate(200, 150)">
          <ellipse cx="0" cy="0" rx="100" ry="40" />
          <ellipse cx="-50" cy="-20" rx="60" ry="30" />
          <ellipse cx="50" cy="-20" rx="60" ry="30" />
        </g>
        <g transform="translate(500, 250)">
          <ellipse cx="0" cy="0" rx="80" ry="30" />
          <ellipse cx="-40" cy="-15" rx="50" ry="25" />
          <ellipse cx="40" cy="-15" rx="50" ry="25" />
        </g>
      </g>
      
      {/* Airplane */}
      <g transform="translate(400, 300) scale(1.5)">
        {/* Airplane body */}
        <path
          d="M-60,0 C-50,-15 -30,-20 20,-20 C60,-20 80,-5 90,0 C80,5 60,20 20,20 C-30,20 -50,15 -60,0 Z"
          fill="#ffffff"
          stroke="#333333"
          strokeWidth="1.5"
        />
        
        {/* Wings */}
        <path
          d="M10,0 L-20,-50 L40,-50 L40,0 Z"
          fill="#ffffff"
          stroke="#333333"
          strokeWidth="1.5"
        />
        <path
          d="M10,0 L-20,50 L40,50 L40,0 Z"
          fill="#ffffff"
          stroke="#333333"
          strokeWidth="1.5"
        />
        
        {/* Tail */}
        <path
          d="M-50,0 L-80,-40 L-70,-40 L-40,0 Z"
          fill="#ffffff"
          stroke="#333333"
          strokeWidth="1.5"
        />
        <path
          d="M-50,0 L-80,40 L-70,40 L-40,0 Z"
          fill="#ffffff"
          stroke="#333333"
          strokeWidth="1.5"
        />
        
        {/* Windows - illuminated in night */}
        <g fill="#FFD700">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={-40 + i * 10} y={-5} width={5} height={10} rx={1} />
          ))}
        </g>
      </g>
      
      {/* Airplane lights */}
      <g opacity="0.8">
        <radialGradient id="redLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
        </radialGradient>
        <circle cx="340" cy="300" r="5" fill="url(#redLight)" />
        
        <radialGradient id="greenLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#00ff00" />
          <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
        </radialGradient>
        <circle cx="460" cy="300" r="5" fill="url(#greenLight)" />
      </g>
    </svg>
  );
};

export default Airplane4;
