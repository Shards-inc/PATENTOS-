import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  currentQuery: string;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, isSearching, currentQuery, onReset }) => {
  const [localQuery, setLocalQuery] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) onSearch(localQuery);
  };

  const handleLogoClick = () => {
      setLocalQuery('');
      onReset();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none perspective-container">
      <div className="w-full max-w-4xl pointer-events-auto transform transition-transform hover:scale-[1.01] duration-500">
          <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center px-2 py-2 relative overflow-hidden group">
            
            {/* Animated Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Top Reflection */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Logo Section */}
            <div className="flex items-center pl-6 pr-6 cursor-pointer border-r border-white/10 mr-2 hover:bg-white/5 transition-colors rounded-l-full" onClick={handleLogoClick}>
                <div className="w-8 h-8 rounded border border-[#00f3ff]/50 flex items-center justify-center mr-3 relative bg-black/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                     <span className="material-icons text-[#00f3ff] text-sm animate-pulse">api</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-bold tracking-widest text-sm leading-none font-rajdhani">PATENT<span className="text-[#00f3ff]">OS</span></span>
                    <span className="text-[9px] text-gray-500 font-mono tracking-[0.3em]">V2.4_PROD</span>
                </div>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSubmit} className="flex-1 relative group/input">
                 <input 
                    type="text" 
                    className="w-full bg-transparent border-none outline-none text-[#e0e0e0] placeholder-gray-600 font-mono text-xs py-3 px-4 focus:placeholder-[#00f3ff]/50 transition-colors tracking-wide uppercase"
                    placeholder="ENTER_SEARCH_VECTOR..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    disabled={isSearching}
                 />
                 
                 {/* Right Actions */}
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                     {localQuery && (
                         <button type="button" onClick={() => setLocalQuery('')} className="text-gray-500 hover:text-[#ff2a6d] transition-colors">
                             <span className="material-icons text-sm">close</span>
                         </button>
                     )}
                     <button 
                        type="submit" 
                        className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#00f3ff]/5 text-[#00f3ff] border border-[#00f3ff]/20 hover:bg-[#00f3ff] hover:text-black transition-all duration-300 ${isSearching ? 'animate-spin' : 'hover:shadow-[0_0_15px_#00f3ff]'}`}
                     >
                         <span className="material-icons text-sm">{isSearching ? 'sync' : 'search'}</span>
                     </button>
                 </div>
            </form>
          </div>
      </div>
    </header>
  );
};