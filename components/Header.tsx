
import React from 'react';

const GateLogo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
        <path d="M16.5 12c0-1.93-1.57-3.5-3.5-3.5S9.5 10.07 9.5 12H7.5c0-2.84 2.02-5.2 4.5-5.2s5 2.36 5 5.2h-2.5z" fill="currentColor" opacity="0.7"/>
        <path d="M12 14.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor"/>
    </svg>
);


const Header: React.FC = () => (
  <header className="bg-white shadow-md sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
            <GateLogo />
            <span className="text-xl font-bold text-slate-800">
                Gate Group <span className="font-light text-blue-600">| OPS</span>
            </span>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
