import { useState } from 'react';

const Menu = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`menu fixed z-50 ${isActive ? 'h-[67vh]' : 'h-0'} w-screen bg-brand-orange transition-all duration-300 ease-out`}>
      <div className="menu-header flex justify-between px-12 py-4 mt-8">
        <a href="/" className="text-[#2D2B2B] text-xl font-light">rejouice</a>
        <button 
          onClick={() => setIsActive(false)}
          className="text-[#2D2B2B] text-xl font-light relative hover:after:scale-x-100 after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-black after:origin-bottom-right after:transition-transform after:duration-350 after:ease-out"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Menu;