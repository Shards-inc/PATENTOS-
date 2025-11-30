import React from 'react';

interface SidebarProps {
  sortMode: 'replicability' | 'invalidation';
  onModeChange: (mode: 'replicability' | 'invalidation') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sortMode, onModeChange }) => {
  return (
    <aside className="hidden lg:flex w-72 flex-col justify-center p-6 perspective-container z-20">
      <div className="glass-panel h-[80%] rounded-xl p-6 border-l-2 border-l-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.05)] transform rotateY(10deg) transition-transform hover:rotateY(0deg) duration-700 relative overflow-hidden group">
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#00f3ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-white/5 relative z-10">
            <span className="material-icons text-[#00f3ff] animate-spin-slow">settings_suggest</span>
            <span className="font-bold tracking-[0.2em] text-xs text-[#00f3ff] font-rajdhani">PROTOCOL_PARAMS</span>
        </div>

        <div className="space-y-6 relative z-10">
            <div className="group/item">
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block group-hover/item:text-[#00f3ff] transition-colors">Target Mode</label>
                  <div className="space-y-2 bg-black/40 p-1 rounded border border-white/5 backdrop-blur-md">
                      
                      <button 
                        onClick={() => onModeChange('replicability')}
                        className={`w-full flex items-center p-2 rounded transition-all duration-300 group ${sortMode === 'replicability' ? 'bg-[#00f3ff]/10 border border-[#00f3ff]/30' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                          <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${sortMode === 'replicability' ? 'bg-[#00f3ff] shadow-[0_0_5px_#00f3ff] animate-pulse' : 'bg-gray-600 group-hover:bg-[#00f3ff]/50'}`}></div>
                          <span className={`text-xs font-medium transition-colors ${sortMode === 'replicability' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>Replicability (UK)</span>
                      </button>

                      <button 
                        onClick={() => onModeChange('invalidation')}
                        className={`w-full flex items-center p-2 rounded transition-all duration-300 group ${sortMode === 'invalidation' ? 'bg-[#ff2a6d]/10 border border-[#ff2a6d]/30' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                          <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${sortMode === 'invalidation' ? 'bg-[#ff2a6d] shadow-[0_0_5px_#ff2a6d] animate-pulse' : 'bg-gray-600 group-hover:bg-[#ff2a6d]/50'}`}></div>
                          <span className={`text-xs font-medium transition-colors ${sortMode === 'invalidation' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>Invalidation Vector</span>
                      </button>

                  </div>
            </div>

            <div className="p-4 bg-[#00f3ff]/5 rounded border border-[#00f3ff]/20 mt-auto">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="w-1 h-1 bg-[#00f3ff] animate-ping"></div>
                    <h4 className="text-[#00f3ff] font-bold text-[10px] uppercase tracking-widest">Live Uplink</h4>
                </div>
                <p className="text-[10px] text-blue-200/60 font-mono leading-relaxed">
                    > Scanning USPTO/EPO<br/>
                    > Filtering: Active UK<br/>
                    > Latency: 42ms<br/>
                    > Encryption: ON
                </p>
            </div>
        </div>
      </div>
    </aside>
  );
};