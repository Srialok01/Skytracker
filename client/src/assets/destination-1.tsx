import React from "react";

const Destination1: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      width="800"
      height="500"
      {...props}
    >
      <defs>
        <linearGradient id="skyGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2980b9" />
          <stop offset="100%" stopColor="#6dd5fa" />
        </linearGradient>
      </defs>
      
      {/* Sky */}
      <rect width="800" height="500" fill="url(#skyGradient1)" />
      
      {/* Sun */}
      <circle cx="700" cy="100" r="60" fill="#FFCE54" />
      
      {/* Ocean */}
      <rect x="0" y="300" width="800" height="200" fill="#1a8cff" />
      
      {/* Beach */}
      <path
        d="M0,300 C200,250 400,320 800,300 L800,500 L0,500 Z"
        fill="#f9d3a7"
      />
      
      {/* Palm tree 1 */}
      <g transform="translate(150, 280)">
        {/* Trunk */}
        <path
          d="M0,0 C5,-20 10,-40 5,-60 C0,-80 0,-100 0,-120"
          stroke="#8B4513"
          strokeWidth="10"
          fill="none"
        />
        
        {/* Leaves */}
        <g fill="#32CD32">
          <path d="M0,-120 C-20,-110 -40,-100 -60,-60 C-30,-80 -10,-90 0,-120" />
          <path d="M0,-120 C20,-110 40,-100 60,-60 C30,-80 10,-90 0,-120" />
          <path d="M0,-120 C-15,-100 -30,-80 -50,-60 C-20,-70 -5,-100 0,-120" />
          <path d="M0,-120 C15,-100 30,-80 50,-60 C20,-70 5,-100 0,-120" />
          <path d="M0,-120 C-10,-90 -5,-70 0,-40 C5,-70 10,-90 0,-120" />
        </g>
      </g>
      
      {/* Palm tree 2 */}
      <g transform="translate(600, 290)">
        {/* Trunk */}
        <path
          d="M0,0 C-5,-20 -8,-40 -3,-60 C2,-80 0,-100 -5,-120"
          stroke="#8B4513"
          strokeWidth="10"
          fill="none"
        />
        
        {/* Leaves */}
        <g fill="#32CD32">
          <path d="M-5,-120 C-25,-110 -45,-100 -65,-60 C-35,-80 -15,-90 -5,-120" />
          <path d="M-5,-120 C15,-110 35,-100 55,-60 C25,-80 5,-90 -5,-120" />
          <path d="M-5,-120 C-20,-100 -35,-80 -55,-60 C-25,-70 -10,-100 -5,-120" />
          <path d="M-5,-120 C10,-100 25,-80 45,-60 C15,-70 0,-100 -5,-120" />
          <path d="M-5,-120 C-15,-90 -10,-70 -5,-40 C0,-70 5,-90 -5,-120" />
        </g>
      </g>
      
      {/* Boat */}
      <g transform="translate(500, 350)">
        <path
          d="M-40,0 C-20,-15 20,-15 40,0"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="#2E86C1"
        />
        <path
          d="M0,-15 L0,-50"
          stroke="#8B4513"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M0,-50 L30,-30 L0,-20 Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Beach umbrella */}
      <g transform="translate(250, 320)">
        <path
          d="M0,0 L0,-50"
          stroke="#8B4513"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M-30,-50 Q0,-75 30,-50"
          stroke="#FF5252"
          strokeWidth="2"
          fill="#FF5252"
        />
      </g>
      
      {/* Beach chair */}
      <g transform="translate(270, 320)">
        <rect x="-15" y="-5" width="30" height="5" fill="#FF5252" />
        <rect x="-15" y="-15" width="30" height="5" fill="#FF5252" />
        <rect x="-15" y="-25" width="30" height="5" fill="#FF5252" />
        <line x1="-15" y1="0" x2="-15" y2="-30" stroke="#8B4513" strokeWidth="2" />
        <line x1="15" y1="0" x2="15" y2="-20" stroke="#8B4513" strokeWidth="2" />
        <line x1="-15" y1="-30" x2="15" y2="-20" stroke="#8B4513" strokeWidth="2" />
      </g>
      
      {/* Miami text */}
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
        MIAMI
      </text>
    </svg>
  );
};

export default Destination1;
