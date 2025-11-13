
import React from 'react';

export const PawPrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="4" cy="8" r="2" />
    <path d="M9 10.1c0 1 .8 2 2 2s2-.9 2-2" />
    <path d="M15.5 12.3c0 1.2 1 2.2 2.2 2.2s2.3-1 2.3-2.2" />
    <path d="m2.5 12.3c0 1.2 1 2.2 2.2 2.2s2.3-1 2.3-2.2" />
    <path d="M9.5 17.5c0 .9.8 1.7 1.7 1.7s1.8-.8 1.8-1.7" />
  </svg>
);
