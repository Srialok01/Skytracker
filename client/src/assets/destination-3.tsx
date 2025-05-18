import React from "react";

const Destination3: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      width="800"
      height="500"
      {...props}
    >
      <defs>
        <linearGradient id="skyGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2193b0" />
          <stop offset="100%" stopColor="#6dd5ed" />
        </linearGradient>
      </defs>
      
      {/* Sky */}
      <rect width="800" height="500" fill="url(#skyGradient3)" />
      
      {/* Sun */}
      <circle cx="100" cy="100" r="50" fill="#FFCE54" />
      
      {/* Hollywood Hills */}
      <path
        d="M0,300 Q100,250 200,280 Q300,310 400,270 Q500,230 600,260 Q700,290 800,250 L800,500 L0,500 Z"
        fill="#C0CA33"
      />
      
      {/* Hollywood Sign */}
      <g transform="translate(150, 270) scale(0.5)">
        <rect x="0" y="0" width="300" height="40" fill="#FFFFFF" />
        <text
          x="150"
          y="30"
          fontFamily="'Arial', sans-serif"
          fontSize="30"
          fontWeight="bold"
          textAnchor="middle"
          fill="#000000"
        >
          HOLLYWOOD
        </text>
      </g>
      
      {/* Ocean */}
      <path
        d="M0,500 L800,500 L800,400 Q600,380 400,420 Q200,460 0,430 Z"
        fill="#039BE5"
      />
      
      {/* Palm trees */}
      {[100, 200, 500, 600, 700].map((x, i) => (
        <g key={i} transform={`translate(${x}, 350)`}>
          {/* Trunk */}
          <path
            d="M0,0 C3,-30 -3,-60 0,-90"
            stroke="#8B4513"
            strokeWidth="6"
            fill="none"
          />
          
          {/* Leaves */}
          <g fill="#2E7D32">
            <path d="M0,-90 C-20,-80 -30,-60 -35,-40 C-20,-60 -10,-80 0,-90" />
            <path d="M0,-90 C20,-80 30,-60 35,-40 C20,-60 10,-80 0,-90" />
            <path d="M0,-90 C-15,-80 -25,-60 -30,-40 C-15,-60 -5,-80 0,-90" />
            <path d="M0,-90 C15,-80 25,-60 30,-40 C15,-60 5,-80 0,-90" />
            <path d="M0,-90 C-5,-80 -10,-60 -15,-40 C-5,-60 0,-80 0,-90" />
            <path d="M0,-90 C5,-80 10,-60 15,-40 C5,-60 0,-80 0,-90" />
            <path d="M0,-90 C0,-80 0,-60 0,-40 C0,-60 0,-80 0,-90" />
          </g>
        </g>
      ))}
      
      {/* Downtown LA */}
      <g transform="translate(400, 380)">
        {/* US Bank Tower */}
        <rect x="-10" y="-150" width="20" height="150" fill="#B0BEC5" />
        <rect x="-8" y="-170" width="16" height="20" fill="#90A4AE" />
        <rect x="-6" y="-180" width="12" height="10" fill="#78909C" />
        
        {/* Wilshire Grand */}
        <rect x="20" y="-140" width="20" height="140" fill="#78909C" />
        <polygon points="20,-140 40,-140 30,-170 20,-140" fill="#607D8B" />
        
        {/* AON Center */}
        <rect x="-40" y="-130" width="20" height="130" fill="#90A4AE" />
        
        {/* Other buildings */}
        <rect x="-70" y="-100" width="15" height="100" fill="#B0BEC5" />
        <rect x="-90" y="-90" width="15" height="90" fill="#78909C" />
        <rect x="50" y="-110" width="15" height="110" fill="#90A4AE" />
        <rect x="70" y="-80" width="15" height="80" fill="#B0BEC5" />
        <rect x="90" y="-95" width="15" height="95" fill="#78909C" />
      </g>
      
      {/* Beach */}
      <path
        d="M0,430 Q200,460 400,420 Q600,380 800,400 L800,440 Q600,420 400,460 Q200,500 0,470 Z"
        fill="#FFF176"
      />
      
      {/* Roads */}
      <path
        d="M0,390 L800,390"
        stroke="#78909C"
        strokeWidth="8"
        fill="none"
      />
      <path
        d="M400,270 L400,500"
        stroke="#78909C"
        strokeWidth="10"
        fill="none"
      />
      
      {/* Cars on road */}
      {[100, 250, 350, 550, 650].map((x, i) => (
        <rect key={i} x={x} y="386" width="20" height="8" rx="2" fill={['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#9C27B0'][i % 5]} />
      ))}
      
      {/* Los Angeles text */}
      <text
        x="400"
        y="450"
        fontFamily="'Arial', sans-serif"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="1"
      >
        LOS ANGELES
      </text>
    </svg>
  );
};

export default Destination3;
