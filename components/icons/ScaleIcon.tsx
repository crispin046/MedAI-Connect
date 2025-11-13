import React from 'react';

export const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M16 16.5a2.5 2.5 0 0 0-5 0" />
    <path d="M8 16.5a2.5 2.5 0 0 0-5 0" />
    <path d="M12 4v16" />
    <path d="M3 7h18" />
    <path d="M3 12h5" />
    <path d="M16 12h5" />
    <path d="m18 7-3-3-3 3" />
    <path d="m6 7 3-3 3 3" />
  </svg>
);