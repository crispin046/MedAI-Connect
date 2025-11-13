import React from 'react';

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-5 11.23a.7.7 0 0 1-.35.85l-.65.43A2 2 0 0 0 5 16h14a2 2 0 0 0 .9-1.5c0-.4-.1-.8-.4-1.1l-.6-.4a.7.7 0 0 1-.4-.8A7 7 0 0 0 12 2Z" />
  </svg>
);