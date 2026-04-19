import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const Cursor = () => {
  const [cursorText, setCursorText] = useState('Play Reel');

  useEffect(() => {
    const cursor = document.querySelector(".cursor");
    
    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5
      });
    };

    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div className="cursor w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center fixed -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
      <h4 className="text-[#1a1919] text-xs font-light">{cursorText}</h4>
    </div>
  );
};

export default Cursor;