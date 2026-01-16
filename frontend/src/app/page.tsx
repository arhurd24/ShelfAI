"use client";
import React, { useState, ChangeEvent } from 'react';
import { Plus, FileText, Headphones, Music, Loader2, Zap, Clock, Play, Download } from 'lucide-react';

interface FileData {
  name: string;
  audioUrl: string;
  status?: string;
}

export default function ShelfAI_v2() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<FileData | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setFiles(prev => [data, ...prev]);
      setActiveFile(data);
    } catch (err) {
      alert("Cloud Brain Offline. Check your Google Run service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050507] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* SIDEBAR: Glassmorphism Effect */}
      <aside className="w-80 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Shelf<span className="text-indigo-500 italic">AI</span></h1>
        </div>
        
        <label className="group relative block p-6 border border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all duration-300 mb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Import High-Yield Source</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>

        <nav className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Your Intelligence Bank</h2>
          {files.map((f, i) => (
            <div 
              key={i} 
              onClick={() => setActiveFile(f)}
              className={`group p-4 rounded-2xl cursor-pointer transition-all border ${activeFile?.name === f.name ? 'bg-indigo-600/10 border-indigo-500/40 shadow-lg' : 'bg-white/[0.03] border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${activeFile?.name === f.name ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate text-white uppercase tracking-tight">{f.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Emma Ready</p>
                </div>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col bg-gradient-to-b from-[#0a0a0f] to-[#050507]">
        
        {/* HEADER AREA */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-12">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Cloud Backend Online</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-xs font-bold text-slate-400 hover:text-white transition">Docs</button>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
            </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
          
          {/* Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

          {loading ? (
            <div className="z-10 text-center animate-in fade-in duration-700">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                <Loader2 className="w-16 h-16 animate-spin text-indigo-500 mx-auto relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Synthesizing Medical Logic</h3>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Emma Holliday Agent v2.4.0</p>
            </div>
          ) : activeFile ? (
            <div className="z-10 w-full max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-12 backdrop-blur-md shadow-2xl">
                <div className="flex items-start justify-between mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase">{activeFile.name}</h2>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">3:45 Duration</span>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-400">
                            <Zap className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">High Yield Analysis</span>
                        </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group">
                        <Download className="w-5 h-5 text-slate-300 group-hover:text-white" />
                    </button>
                    <button 
                      onClick={() => new Audio(activeFile.audioUrl).play()}
                      className="flex items-center gap-3 px-8 py-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition shadow-[0_10px_30px_rgba(79,70,229,0.3)] group"
                    >
                        <Play className="w-5 h-5 text-white fill-current group-hover:scale-110 transition" />
                        <span className="font-black text-xs uppercase tracking-[0.1em]">Begin Briefing</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Anki Readiness</p>
                        <p className="text-xl font-bold text-white">94% <span className="text-[10px] text-green-500">+2.1</span></p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Complexity</p>
                        <p className="text-xl font-bold text-white uppercase tracking-tight">Medium</p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Source Health</p>
                        <p className="text-xl font-bold text-white">Verified</p>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="z-10 text-center">
              <div className="w-24 h-24 bg-indigo-600/5 rounded-[2rem] border border-white/5 flex items-center justify-center mb-8 mx-auto rotate-12 group hover:rotate-0 transition-transform duration-500">
                <Headphones className="w-10 h-10 text-slate-700" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tighter italic">Ready for Briefing</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-loose">
                Upload your shelf materials and Emma will transform them into high-yield audio and flashcards.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER PLAYER (Minimalist) */}
        {activeFile && (
            <footer className="h-24 border-t border-white/5 bg-[#050507] flex items-center px-12 gap-8 z-20">
                <div className="flex items-center gap-4 w-64">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">{activeFile.name}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">Listening Live</p>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-indigo-500" />
                    </div>
                    <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        <span>1:12</span>
                        <span>3:45</span>
                    </div>
                </div>

                <div className="w-64 flex justify-end gap-4">
                    <button className="text-slate-500 hover:text-white transition">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </footer>
        )}
      </main>
    </div>
  );
}
