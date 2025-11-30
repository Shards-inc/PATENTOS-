import React, { useEffect, useRef, useState } from 'react';
import { AgentLog } from '../types';

interface AgentTerminalProps {
  logs: AgentLog[];
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  useEffect(() => {
      if(logs.length > 0 && logs.length < 2) setIsOpen(true);
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className={`fixed bottom-6 right-6 w-[400px] bg-[#050505] border border-[#00f3ff]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 transition-all duration-500 ease-out flex flex-col font-mono text-xs overflow-hidden rounded ${isOpen ? 'h-64' : 'h-10'} group perspective-container`}>
      
      {/* CRT Scanline */}
      <div className="scanline"></div>

      {/* Header */}
      <div 
        className="bg-[#0a0a0a] px-3 h-10 border-b border-[#00f3ff]/20 flex justify-between items-center cursor-pointer hover:bg-[#111] transition-colors relative z-20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full ${logs[logs.length-1]?.type === 'error' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-[#00f3ff] shadow-[0_0_10px_#00f3ff] animate-pulse'}`}></div>
          <span className="text-[#00f3ff] font-bold tracking-widest text-[10px]">KERNEL_PANEL_v2.4</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono group-hover:text-white transition-colors">
             {isOpen ? '[-]' : '[+]'}
        </div>
      </div>

      {/* Logs Content */}
      {isOpen && (
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-[#050505]/95 text-[#00f3ff] font-mono relative z-10 scrollbar-hide">
            {logs.map((log) => (
            <div key={log.id} className="flex items-start leading-tight opacity-90 hover:opacity-100 transition-opacity group/log">
                <span className="text-gray-700 mr-3 w-14 text-right shrink-0 select-none group-hover/log:text-gray-500 text-[9px]">
                    {log.timestamp.toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                </span>
                <span className={`break-words flex-1 text-[10px] ${
                log.type === 'action' ? 'text-white font-bold' : 
                log.type === 'success' ? 'text-green-400' : 
                log.type === 'warning' ? 'text-yellow-400' :
                log.type === 'error' ? 'text-red-500' :
                'text-[#00f3ff]/70'
                }`}>
                {log.type === 'action' && <span className="mr-2 text-[#00f3ff]">></span>}
                {log.type === 'success' && <span className="mr-2 text-green-400">SUCCESS:</span>}
                {log.type === 'error' && <span className="mr-2 text-red-500">FATAL:</span>}
                {log.message}
                {log.type === 'action' && <span className="inline-block w-1.5 h-3 bg-[#00f3ff] ml-1 animate-pulse align-middle"></span>}
                </span>
            </div>
            ))}
            <div ref={endRef} />
        </div>
      )}
    </div>
  );
};