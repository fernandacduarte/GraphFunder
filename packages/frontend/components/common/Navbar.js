import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const SVGGraph = (props) => (
    <svg
      width="28px"
      height="28px"
      viewBox="0 0 36 36"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <style>{".cls-1{fill:none;}"}</style>
      </defs>
      <title>{"network--2"}</title>
      <path d="M19.125 19.125h5.785a4.5 4.5 0 1 0 0 -2.25H19.125V7.875h5.785a4.5 4.5 0 1 0 0 -2.25H19.125a2.253 2.253 0 0 0 -2.25 2.25v9H11.09a4.5 4.5 0 1 0 0 2.25H16.875v9a2.253 2.253 0 0 0 2.25 2.25h5.785a4.5 4.5 0 1 0 0 -2.25H19.125Zm10.125 -3.375a2.25 2.25 0 1 1 -2.25 2.25A2.253 2.253 0 0 1 29.25 15.75ZM29.25 4.5a2.25 2.25 0 1 1 -2.25 2.25A2.253 2.253 0 0 1 29.25 4.5ZM6.75 20.25a2.25 2.25 0 1 1 2.25 -2.25A2.253 2.253 0 0 1 6.75 20.25Zm22.5 6.75a2.25 2.25 0 1 1 -2.25 2.25A2.253 2.253 0 0 1 29.25 27Z" />
    </svg>
  );

  return (
    <nav
      className={`navbar sticky top-0 z-50 w-full drop-shadow-md transition-all duration-300 ${
        scrolling ? 'bg-opacity-50 bg-[#333333]' : 'bg-[#333333]'
      }`}
    >
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        <div className="menu horizontal items-center justify-center">
          <div className="flex items-center justify-center w-12 h-12 mr-2 rounded-full bg-[#CBC8C8]">
              <SVGGraph />
          </div>
          <Link href="/" className="text-2xl font-bold text-[#CBC8C8] hover:text-[#FFFFFF]">
            GraphFunder
          </Link>
        </div>
        <div className="flex items-center justify-left">
        <div>
          <Link
            href={"/"}
            className="text-[#C1BDBD] px-4 py-2 rounded transition-colors duration-200 hover:text-[#FFFFFF] active:text-[#FFFFFF]"
          >
            Explore
          </Link>
          <Link 
            href={"/publish"}
            className="text-[#C1BDBD] px-4 py-2 mr-4 rounded transition-colors duration-200 hover:text-[#FFFFFF] active:text-[#FFFFFF]"
          >
            Publish
          </Link>
        </div>
        <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
