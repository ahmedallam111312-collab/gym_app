
import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0Zm-4.5-4.5a3.75 3.75 0 0 0-3.75 3.75h7.5a3.75 3.75 0 0 0-3.75-3.75ZM15 3.75a3 3 0 0 0-3-3V.75a3 3 0 0 0-3 3v.75A3 3 0 0 0 9 7.5v1.5a3 3 0 0 0 3 3v.75a3 3 0 0 0 3-3v-1.5a3 3 0 0 0-3-3V3.75Z" />
  </svg>
);

export default TrophyIcon;
