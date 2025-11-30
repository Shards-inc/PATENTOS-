import React from 'react';
import { Patent } from '../types';

interface PatentListProps {
  patents: Patent[];
  onSelect: (patent: Patent) => void;
  selectedId?: string;
}

export const PatentList: React.FC<PatentListProps> = ({ patents, onSelect, selectedId }) => {
  if (patents.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 pt-6 pb-20">
      
      {/* List Header */}
      <div className="flex justify-between items-end border-b border-[#00f3ff]/20 pb-4 mb-4 sticky top-0 bg-[#050505]/80 backdrop-blur z-20">
         <div>
             <h2 className="text-xl font-bold text-white tracking-widest flex items-center font-rajdhani">
                 <span className="w-2 h-2 bg-[#00f3ff] rounded-full mr-3 animate-pulse shadow-[0_0_10px_#00f3ff]"></span>
                 OPPORTUNITY_MATRIX
             </h2>
             <span className="text-[10px] text-[#00f3ff] font-mono mt-1 block tracking-[0.2em]">IDENTIFIED_VECTORS: {patents.length}</span>
         </div>
         <div className="flex space-x-1">
             <div className="w-1 h-1 bg-white/20"></div>
             <div className="w-1 h-1 bg-white/20"></div>
             <div className="w-1 h-1 bg-white/20"></div>
         </div>
      </div>
      
      {patents.map((patent, index) => (
        <div 
          key={patent.id}
          onClick={() => onSelect(patent)}
          className={`holo-card group rounded p-0 cursor-pointer ${
              selectedId === patent.id ? 'border-[#00f3ff] shadow-[0_0_40px_rgba(0,243,255,0.2)] bg-[#00f3ff]/5' : 'border-white/5'
          }`}
          style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both'
          }}
        >
          {/* Status Strip */}
          <div className="bg-black/40 border-b border-white/5 p-3 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-[#00f3ff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center space-x-3">
                  <span className="font-mono text-[#00f3ff] text-[10px] tracking-wider border border-[#00f3ff]/30 px-2 py-0.5 rounded bg-[#00f3ff]/5 shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                      {patent.id}
                  </span>
                  {patent.opportunityType === 'Territorial Gap' && (
                      <span className="text-[9px] font-bold text-[#bc13fe] bg-[#bc13fe]/10 px-2 py-0.5 rounded border border-[#bc13fe]/30 animate-pulse-glow">
                          GAP_DETECTED
                      </span>
                  )}
              </div>
              <span className="font-mono text-[10px] text-gray-500">{patent.filingDate}</span>
          </div>

          <div className="p-5 relative z-10">
              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#00f3ff] transition-colors leading-tight font-rajdhani glitch-text">
                  {patent.title}
              </h3>
              
              <div className="flex items-center text-[10px] text-gray-500 mb-4 font-mono tracking-wider">
                  <span className="mr-2 text-[#00f3ff]">></span>
                  <span className="text-white uppercase opacity-70">{patent.assignee}</span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-light opacity-80 group-hover:opacity-100 transition-opacity">
                  {patent.abstract}
              </p>

              {/* Data Visualization Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  
                  {/* Circular Score Viz */}
                  <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                           {/* Outer Ring */}
                           <div className="absolute inset-0 rounded-full border border-white/10"></div>
                           {/* Active Ring */}
                           <svg className="w-full h-full transform -rotate-90">
                               <circle cx="24" cy="24" r="20" stroke="transparent" strokeWidth="2" fill="none" />
                               <circle 
                                cx="24" cy="24" r="20" 
                                stroke={patent.ukReplicabilityScore > 80 ? '#00f3ff' : patent.ukReplicabilityScore > 50 ? '#fbbf24' : '#ef4444'} 
                                strokeWidth="2" fill="none" 
                                strokeDasharray="125" 
                                strokeDashoffset={125 - (patent.ukReplicabilityScore * 1.25)} 
                                className="transition-all duration-1000 ease-out" 
                               />
                           </svg>
                           <span className="absolute text-[10px] font-bold text-white font-mono">{patent.ukReplicabilityScore}</span>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Safety Index</span>
                          <span className={`text-[10px] font-bold ${
                               patent.ukReplicabilityScore > 80 ? 'text-[#00f3ff] text-glow' : 
                               patent.ukReplicabilityScore > 50 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                              {patent.ukReplicabilityScore > 80 ? 'OPTIMAL' : 'CAUTION'}
                          </span>
                      </div>
                  </div>

                  {/* Jurisdiction Badges */}
                  <div className="flex flex-col items-end justify-center">
                      <span className="text-[9px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Active Regions</span>
                      <div className="flex space-x-1">
                          {patent.jurisdictions.slice(0,4).map(j => (
                              <span key={j} className={`text-[9px] px-1.5 py-0.5 border font-mono rounded-sm transition-transform hover:scale-110 ${
                                  j === 'US' ? 'border-[#00f3ff]/50 text-[#00f3ff] bg-[#00f3ff]/10 shadow-[0_0_5px_rgba(0,243,255,0.2)]' : 
                                  j === 'GB' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-gray-700 text-gray-500'
                              }`}>
                                  {j}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
};