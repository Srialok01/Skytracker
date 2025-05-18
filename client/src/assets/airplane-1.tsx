import React from "react";

const Airplane1: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      width="800"
      height="600"
      {...props}
    >
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3c72" />
          <stop offset="100%" stopColor="#2a5298" />
        </linearGradient>
      </defs>
      
      {/* Sky background */}
      <rect width="800" height="600" fill="url(#skyGradient)" />
      
      {/* Clouds */}
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="150" cy="150" rx="75" ry="40" />
        <ellipse cx="120" cy="130" rx="60" ry="30" />
        <ellipse cx="180" cy="130" rx="60" ry="30" />
        
        <ellipse cx="650" cy="100" rx="60" ry="30" />
        <ellipse cx="620" cy="80" rx="50" ry="25" />
        <ellipse cx="680" cy="80" rx="50" ry="25" />
        
        <ellipse cx="400" cy="80" rx="100" ry="40" />
        <ellipse cx="350" cy="60" rx="70" ry="30" />
        <ellipse cx="450" cy="60" rx="70" ry="30" />
      </g>
      
      {/* Airplane */}
      <g transform="translate(400, 300) scale(1.5) rotate(15)">
        {/* Airplane body */}
        <path
          d="M-100,0 C-90,-15 -50,-20 0,-20 C50,-20 90,-15 100,0 C90,15 50,20 0,20 C-50,20 -90,15 -100,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="2"
        />
        
        {/* Wings */}
        <path
          d="M-20,0 L-50,-60 L10,-60 L20,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="2"
        />
        <path
          d="M-20,0 L-50,60 L10,60 L20,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="2"
        />
        
        {/* Tail */}
        <path
          d="M-90,0 L-130,-40 L-110,-40 L-80,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="2"
        />
        <path
          d="M-90,0 L-130,40 L-110,40 L-80,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="2"
        />
        
        {/* Windows */}
        <g fill="#88c9ff">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={-60 + i * 20} cy={0} r={3} />
          ))}
        </g>
      </g>
    </svg>
  );
};

export default Airplane1;
