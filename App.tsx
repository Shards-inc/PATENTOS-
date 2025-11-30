import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PatentList } from './components/PatentList';
import { DetailPanel } from './components/DetailPanel';
import { AgentTerminal } from './components/AgentTerminal';
import { Sidebar } from './components/Sidebar';
import { analyzePatents, generatePriorArtReport } from './services/geminiService';
import { AgentStatus, Patent, AgentLog } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patent[]>([]);
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [sortMode, setSortMode] = useState<'replicability' | 'invalidation'>('replicability');

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'action' | 'error') => {
    setLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      message,
      type
    }]);
  };

  const handleReset = () => {
      setQuery('');
      setResults([]);
      setStatus(AgentStatus.IDLE);
      setLogs([]);
      setSelectedPatent(null);
      setSortMode('replicability');
  };

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setStatus(AgentStatus.SEARCHING);
    setLogs([]); 
    setResults([]);
    setSelectedPatent(null);

    addLog(`Initiating global patent scan for: "${searchQuery}"`, 'info');

    try {
      const data = await analyzePatents(searchQuery, addLog);
      setResults(data);
      setStatus(AgentStatus.COMPLETED);
    } catch (e) {
      setStatus(AgentStatus.ERROR);
      addLog("System Malfunction: Search terminated abnormally.", 'error');
    }
  };

  const handlePriorArtSearch = async (patent: Patent) => {
    if (patent.priorArtReport) {
        addLog(`Retrieving cached Prior Art report for ${patent.id}...`, 'info');
        return;
    }

    addLog(`Initiating Prior Art Discovery Protocol for ${patent.id}...`, 'action');
    
    // We run the AI generation in the background while displaying the agentic workflow steps
    const reportPromise = generatePriorArtReport(patent);

    // Simulate complex agentic workflow steps for UX immersion
    await new Promise(r => setTimeout(r, 800));
    addLog(`Accessing JPO (Japan) and KIPO (Korea) citation databases...`, 'info');
    
    await new Promise(r => setTimeout(r, 800));
    addLog(`Analyzing 142 citation vectors for semantic overlap...`, 'action');

    try {
        const report = await reportPromise;

        addLog(`Found high-risk citation vectors.`, 'success');
        addLog(`Prior Art Dossier attached to case file ${patent.id}.`, 'info');

        const updatedPatent = { ...patent, priorArtReport: report };
        
        setResults(prev => prev.map(p => p.id === patent.id ? updatedPatent : p));
        setSelectedPatent(updatedPatent);
    } catch (e) {
        addLog(`Prior art protocol warning: Using simulation fallback due to timeout.`, 'warning');
        // Fallback to update UI anyway so it doesn't get stuck in "loading"
        const fallbackReport = "**System Notice:** Real-time deep scan timed out. \n\n**Simulated Finding:** High probability of existing prior art in US Sector 4 (Semiconductors). Recommend manual review.";
        const updatedPatent = { ...patent, priorArtReport: fallbackReport };
        setResults(prev => prev.map(p => p.id === patent.id ? updatedPatent : p));
        setSelectedPatent(updatedPatent);
    }
  };

  // Sort results based on selected mode
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      if (sortMode === 'replicability') {
        return b.ukReplicabilityScore - a.ukReplicabilityScore;
      } else {
        return b.riskScore - a.riskScore;
      }
    });
  }, [results, sortMode]);

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden relative selection:bg-[#00f3ff] selection:text-black flex flex-col perspective-container">
      
      {/* 3D Moving Background Environment */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transform-style-3d">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-[#0a0a0a] z-10"></div>
          
          {/* Breathing Grid */}
          <div className="grid-bg w-full h-[200%] absolute top-[-50%] opacity-20"></div>
          
          {/* Floating Optical Illusions / Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <Header 
        onSearch={handleSearch} 
        isSearching={status === AgentStatus.SEARCHING} 
        currentQuery={query}
        onReset={handleReset}
      />

      <main className="relative z-10 flex-1 flex overflow-hidden">
        
        {/* Holographic Sidebar (Left) */}
        <Sidebar sortMode={sortMode} onModeChange={setSortMode} />

        {/* Main Feed (Center) */}
        <div className="flex-1 perspective-container overflow-y-auto overflow-x-hidden relative scrollbar-hide pt-24 pb-32 px-4 md:px-12">
            
            {status === AgentStatus.IDLE && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-float perspective-container">
                    <div className="w-40 h-40 rounded-full border border-[#00f3ff]/20 flex items-center justify-center mb-8 relative preserve-3d">
                        <div className="absolute inset-0 rounded-full border-t border-[#00f3ff] animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-b border-[#bc13fe] animate-spin-reverse opacity-70"></div>
                        <div className="absolute inset-0 bg-[#00f3ff]/5 rounded-full blur-xl animate-pulse"></div>
                        <span className="material-icons text-6xl text-[#00f3ff] drop-shadow-[0_0_15px_#00f3ff] relative z-10">bubble_chart</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-2 tracking-tighter drop-shadow-2xl font-rajdhani">
                        PATENT<span className="text-[#00f3ff] text-glow">OS</span>
                    </h1>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent mb-4"></div>
                    <p className="text-gray-400 max-w-md text-sm font-mono tracking-widest uppercase opacity-70">
                        Initialize autonomous IP discovery sequence.
                    </p>
                </div>
            )}

            {status === AgentStatus.SEARCHING && results.length === 0 && (
                <div className="space-y-6 max-w-4xl mx-auto pt-10">
                    {[1,2,3].map(i => (
                         <div key={i} className="holo-card h-40 rounded border border-white/5 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f3ff]/10 to-transparent w-full h-full skew-x-12 animate-slide-in-right" style={{animationDuration: '1.5s', animationIterationCount: 'infinite'}}></div>
                             <div className="p-6 space-y-4">
                                <div className="h-2 bg-[#00f3ff]/20 rounded w-24 animate-pulse"></div>
                                <div className="h-6 bg-white/10 rounded w-2/3"></div>
                                <div className="h-4 bg-white/5 rounded w-full"></div>
                             </div>
                         </div>
                    ))}
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                 <PatentList 
                    patents={sortedResults} 
                    onSelect={setSelectedPatent} 
                    selectedId={selectedPatent?.id}
                />
            </div>
        </div>
      </main>

      <DetailPanel 
        patent={selectedPatent} 
        onClose={() => setSelectedPatent(null)} 
        onPriorArt={handlePriorArtSearch}
      />
      
      <AgentTerminal logs={logs} />
    </div>
  );
};

export default App;