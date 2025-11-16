import React from 'react';

const LOGO_URL = 'https://www.dropbox.com/scl/fi/u3askuvh1khb2srpbrulk/da3561ac-eed0-42e4-ba60-fad08c0fc30e.png?rlkey=mru84xggd8xqwhmv3e82sy7md&raw=1';

interface HeaderProps {
    onMenuClick: () => void;
}

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 bg-slate-800/80 backdrop-blur-md shadow-lg p-4 z-10 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 rounded-md hover:bg-slate-700 transition-colors">
            <MenuIcon />
        </button>
        <img src={LOGO_URL} alt="MayuGPT Logo" className="w-8 h-8 rounded-full" />
        <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-wide">
          MayuGPT
        </h1>
      </div>
    </header>
  );
};
