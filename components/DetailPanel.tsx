import React, { useEffect, useState } from 'react';
import { Patent } from '../types';
import { getDeepDive } from '../services/geminiService';
import { generateLegalTechReport } from '../utils/exportUtils';
import ReactMarkdown from 'react-markdown';

interface DetailPanelProps {
  patent: Patent | null;
  onClose: () => void;
  onPriorArt: (patent: Patent) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ patent, onClose, onPriorArt }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [priorArtLoading, setPriorArtLoading] = useState(false);

  useEffect(() => {
    if (patent) {
      setLoading(true);
      setAnalysis("");
      getDeepDive(patent).then(res => {
        setAnalysis(res);
        setLoading(false);
      });
    }
  }, [patent?.id]);

  const handleDownload = () => {
    if (!patent || !analysis) return;
    generateLegalTechReport(patent, analysis, patent.priorArtReport);
  };

  const handlePriorArtClick = () => {
      if(!patent) return;
      if(!patent.priorArtReport) setPriorArtLoading(true);
      onPriorArt(patent);
  };

  useEffect(() => {
      if(patent?.priorArtReport) setPriorArtLoading(false);
  }, [patent?.priorArtReport]);

  if (!patent) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[70%] lg:w-[50%] z-[60] flex flex-col perspective-container">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500" onClick={onClose}></div>

      {/* Main Glass Panel */}
      <div className="relative h-full flex flex-col bg-[#050505]/90 backdrop-blur-2xl border-l border-[#00f3ff]/30 shadow-[-50px_0_100px_rgba(0,0,0,0.9)] animate-slide-in-right overflow-hidden group">
        
        {/* Animated Scanline Overlay */}
        <div className="scanline"></div>
        
        {/* Decorative Side Glow */}
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#00f3ff] to-transparent opacity-50"></div>

        {/* Header HUD */}
        <div className="flex-none p-6 border-b border-white/10 bg-black/40 flex justify-between items-center relative z-20">
            <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 border border-[#00f3ff] rounded bg-[#00f3ff]/10 flex items-center justify-center relative overflow-hidden">
                     <span className="material-icons text-[#00f3ff] relative z-10">analytics</span>
                     <div className="absolute inset-0 bg-[#00f3ff]/20 animate-pulse"></div>
                 </div>
                 <div>
                     <div className="text-[9px] text-[#00f3ff] font-bold tracking-[0.3em] mb-1 animate-pulse">DATA_STREAM_ACTIVE</div>
                     <h2 className="text-white font-bold text-lg leading-none font-mono tracking-widest">{patent.id}</h2>
                 </div>
            </div>
            
            <div className="flex items-center space-x-3">
                 <button 
                    onClick={handleDownload}
                    className="px-4 py-2 rounded bg-white/5 border border-white/10 hover:bg-[#00f3ff]/20 hover:border-[#00f3ff] hover:text-[#00f3ff] text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] active:scale-95"
                 >
                     Export_Data_Packet
                 </button>
                 <button onClick={onClose} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 active:scale-95 z-50">
                     <span className="material-icons text-sm">close</span>
                 </button>
            </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-hide">
             
             {/* Title Block */}
             <div className="mb-10 relative">
                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-rajdhani hover:text-shadow-glow transition-all">
                     {patent.title}
                 </h1>
                 <div className="flex flex-wrap gap-3 mb-6">
                     <span className={`px-2 py-1 text-[10px] font-bold uppercase border tracking-wider rounded-sm ${
                         patent.status === 'Active' ? 'text-[#ff2a6d] border-[#ff2a6d] bg-[#ff2a6d]/10' : 'text-[#00f3ff] border-[#00f3ff] bg-[#00f3ff]/10'
                     }`}>
                         STATUS: {patent.status}
                     </span>
                     <span className="px-2 py-1 text-[10px] font-bold uppercase border border-gray-700 text-gray-400 bg-gray-900/50 rounded-sm font-mono">
                         FILED: {patent.filingDate}
                     </span>
                 </div>

                 {/* HUD Metrics Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                     
                     {/* Metric Card 1 */}
                     <div className="bg-white/5 p-4 rounded border border-white/5 relative overflow-hidden group hover:border-[#00f3ff]/50 transition-colors">
                         <div className="absolute -right-4 -top-4 text-white/5 text-6xl material-icons group-hover:text-[#00f3ff]/10 transition-colors">verified_user</div>
                         <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">UK Safety Index</div>
                         <div className={`text-4xl font-bold font-rajdhani ${patent.ukReplicabilityScore > 80 ? 'text-[#00f3ff] text-glow' : 'text-yellow-500'}`}>
                             {patent.ukReplicabilityScore}%
                         </div>
                         <div className="w-full h-1 bg-gray-800 mt-3 overflow-hidden rounded-full">
                             <div className="h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" style={{width: `${patent.ukReplicabilityScore}%`}}></div>
                         </div>
                     </div>
                     
                     {/* Metric Card 2 */}
                     <div className="bg-white/5 p-4 rounded border border-white/5 relative overflow-hidden group hover:border-[#ff2a6d]/50 transition-colors">
                         <div className="absolute -right-4 -top-4 text-white/5 text-6xl material-icons group-hover:text-[#ff2a6d]/10 transition-colors">warning</div>
                         <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Risk Probability</div>
                         <div className={`text-4xl font-bold font-rajdhani ${patent.riskScore > 50 ? 'text-[#ff2a6d] text-glow' : 'text-green-500'}`}>
                             {patent.riskScore}
                         </div>
                         <div className="text-[9px] text-gray-400 mt-2 font-mono opacity-70">LITIGATION_VECTOR_CALC</div>
                     </div>

                     {/* Action Card */}
                     <div className="bg-white/5 p-4 rounded border border-white/5 flex flex-col justify-center items-center cursor-pointer hover:bg-[#00f3ff]/10 transition-colors border-dashed hover:border-solid hover:border-[#00f3ff] group relative overflow-hidden" onClick={handlePriorArtClick}>
                         {priorArtLoading && <div className="absolute inset-0 bg-[#00f3ff]/10 animate-pulse"></div>}
                         
                         {priorArtLoading ? (
                             <span className="material-icons animate-spin text-[#00f3ff] text-2xl">refresh</span>
                         ) : patent.priorArtReport ? (
                             <>
                                <span className="material-icons text-green-500 mb-1 text-2xl group-hover:scale-110 transition-transform">check_circle</span>
                                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Scan Complete</span>
                             </>
                         ) : (
                             <>
                                <span className="material-icons text-[#00f3ff] mb-1 text-2xl group-hover:scale-110 transition-transform">radar</span>
                                <span className="text-[9px] text-[#00f3ff] font-bold uppercase tracking-widest">Run Deep Scan</span>
                             </>
                         )}
                     </div>
                 </div>
                 
                 <p className="text-gray-400 leading-relaxed text-lg border-l-2 border-[#00f3ff] pl-6 italic bg-gradient-to-r from-[#00f3ff]/5 to-transparent py-4 font-light">
                     "{patent.abstract}"
                 </p>
             </div>

             {/* Prior Art Module */}
             {patent.priorArtReport && (
                 <div className="mb-8 p-6 bg-[#ff9100]/5 border border-[#ff9100]/30 rounded relative animate-fade-in group hover:bg-[#ff9100]/10 transition-colors">
                     <div className="absolute top-0 left-0 bg-[#ff9100] text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest">Simulation Mode</div>
                     <h3 className="text-[#ff9100] font-bold mb-4 mt-4 flex items-center font-rajdhani text-xl">
                         <span className="material-icons mr-2 text-sm animate-pulse">warning</span>
                         PRIOR ART VECTORS IDENTIFIED
                     </h3>
                     <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-400 prose-headings:text-[#ff9100] font-mono text-xs">
                         <ReactMarkdown>{patent.priorArtReport}</ReactMarkdown>
                     </div>
                 </div>
             )}

             {/* Analysis Content */}
             <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-6">
                    <span className="w-2 h-2 bg-[#00f3ff] animate-pulse shadow-[0_0_10px_#00f3ff]"></span>
                    <h3 className="text-white font-bold tracking-[0.2em] uppercase font-rajdhani">FTO Analysis Matrix</h3>
                </div>

                {loading ? (
                    <div className="space-y-4 opacity-70">
                        <div className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded w-full animate-pulse delay-100"></div>
                        <div className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded w-2/3 animate-pulse delay-200"></div>
                        <div className="h-40 bg-gradient-to-b from-white/5 to-transparent rounded w-full animate-pulse mt-4 border border-white/5"></div>
                        <div className="flex justify-center mt-8">
                             <span className="text-[#00f3ff] font-mono text-xs animate-pulse tracking-widest">PROCESSING_NEURAL_LAYERS...</span>
                        </div>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-lg max-w-none font-sans text-gray-300">
                        <ReactMarkdown 
                            components={{
                                h1: ({node, ...props}) => <h3 className="text-[#00f3ff] font-bold text-xl mt-8 mb-4 border-b border-[#00f3ff]/20 pb-2 font-rajdhani uppercase tracking-wide" {...props} />,
                                h2: ({node, ...props}) => <h4 className="text-white font-bold text-lg mt-6 mb-3 uppercase tracking-widest font-rajdhani pl-2 border-l-2 border-[#ff2a6d]" {...props} />,
                                strong: ({node, ...props}) => <span className="text-[#00f3ff] font-bold text-glow" {...props} />,
                                ul: ({node, ...props}) => <ul className="space-y-2 my-4 border-l border-gray-800 pl-4 bg-white/5 p-4 rounded" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-400 font-light" {...props} />,
                            }}
                        >
                            {analysis}
                        </ReactMarkdown>
                    </div>
                )}
             </div>

             {/* Footer Disclaimer */}
             <div className="mt-16 pt-8 border-t border-gray-800 text-center opacity-50 hover:opacity-100 transition-opacity">
                 <p className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                     Generated by PatentOS Neural Core v2.4<br/>
                     Non-binding technical assessment only.
                 </p>
             </div>
        </div>
      </div>
    </div>
  );
};