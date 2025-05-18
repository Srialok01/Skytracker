import React from "react";

const Airplane3: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      width="800"
      height="600"
      {...props}
    >
      <defs>
        <linearGradient id="cloudySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#73c8f0" />
          <stop offset="100%" stopColor="#a5d8f0" />
        </linearGradient>
      </defs>
      
      {/* Sky background */}
      <rect width="800" height="600" fill="url(#cloudySkyGradient)" />
      
      {/* Fluffy clouds */}
      <g fill="#ffffff" opacity="0.9">
        <g transform="translate(100, 100)">
          <ellipse cx="0" cy="0" rx="80" ry="40" />
          <ellipse cx="-40" cy="-20" rx="60" ry="30" />
          <ellipse cx="40" cy="-20" rx="60" ry="30" />
          <ellipse cx="-20" cy="20" rx="50" ry="25" />
          <ellipse cx="20" cy="20" rx="50" ry="25" />
        </g>
        
        <g transform="translate(500, 150)">
          <ellipse cx="0" cy="0" rx="90" ry="45" />
          <ellipse cx="-50" cy="-25" rx="70" ry="35" />
          <ellipse cx="50" cy="-25" rx="70" ry="35" />
          <ellipse cx="-30" cy="25" rx="60" ry="30" />
          <ellipse cx="30" cy="25" rx="60" ry="30" />
        </g>
        
        <g transform="translate(300, 60)">
          <ellipse cx="0" cy="0" rx="70" ry="35" />
          <ellipse cx="-35" cy="-18" rx="50" ry="25" />
          <ellipse cx="35" cy="-18" rx="50" ry="25" />
          <ellipse cx="-20" cy="18" rx="40" ry="20" />
          <ellipse cx="20" cy="18" rx="40" ry="20" />
        </g>
      </g>
      
      {/* Airplane */}
      <g transform="translate(400, 300) scale(2)">
        {/* Airplane body */}
        <path
          d="M-40,0 C-35,-10 -20,-15 15,-15 C35,-15 45,-5 50,0 C45,5 35,15 15,15 C-20,15 -35,10 -40,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1"
        />
        
        {/* Engine */}
        <rect x="5" y="-12" width="10" height="24" rx="3" fill="#cccccc" stroke="#444444" strokeWidth="0.5" />
        
        {/* Wings */}
        <path
          d="M10,0 L0,-30 L25,-30 L25,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1"
        />
        <path
          d="M10,0 L0,30 L25,30 L25,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1"
        />
        
        {/* Tail */}
        <path
          d="M-35,0 L-50,-20 L-42,-20 L-30,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1"
        />
        <path
          d="M-35,0 L-50,20 L-42,20 L-30,0 Z"
          fill="#ffffff"
          stroke="#444444"
          strokeWidth="1"
        />
        
        {/* Windows */}
        <g fill="#a5d8f0">
          {Array.from({ length: 5 }).map((_, i) => (
            <circle key={i} cx={-25 + i * 10} cy={0} r={2} />
          ))}
        </g>
        
        {/* Cockpit window */}
        <path
          d="M45,-5 C47,-5 49,-3 50,0 C49,3 47,5 45,5 L35,5 L35,-5 Z"
          fill="#a5d8f0"
          stroke="#444444"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
};

export default Airplane3;
