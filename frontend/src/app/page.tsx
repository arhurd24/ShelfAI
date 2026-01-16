"use client";
import React, { useState, ChangeEvent } from 'react';
import { Plus, FileText, Headphones, Music, Loader2 } from 'lucide-react';

interface FileData {
  name: string;
  audioUrl: string;
  status?: string;
}

export default function CloudShelf() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, { 
        method: 'POST', 
        body: formData 
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiles(prev => [data, ...prev]);
    } catch (err) {
      console.error("Cloud Connection Failed", err);
      alert("Emma is offline. Check Google Cloud Run status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-sans">
      <aside className="w-80 border-r border-gray-800 p-6 flex flex-col">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 text-center">Shelf Intelligence</h2>
        
        <label className="block p-4 border-2 border-dashed border-gray-800 rounded-2xl text-center cursor-pointer hover:bg-indigo-500/5 transition mb-8 group">
          <Plus className="mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase">Upload Source</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>

        <div className="flex-1 overflow-y-auto space-y-3">
          {files.map((f, i) => (
            <div key={i} className="p-4 bg-[#16161a] border border-gray-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-[11px] font-bold truncate text-gray-400">{f.name}</span>
              </div>
              <button 
                onClick={() => new Audio(f.audioUrl).play()}
                className="p-2 bg-indigo-600 rounded-full hover:scale-110 transition shrink-0"
              >
                <Music className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        {loading ? (
          <div className="space-y-4 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mx-auto" />
            <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest">Emma is generating in Google Cloud...</p>
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="w-64 h-64 bg-indigo-600/5 rounded-full flex items-center justify-center mb-8 border border-white/5 mx-auto">
                <Headphones className="w-16 h-16 text-gray-800" />
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tighter italic">Emma Holliday</h1>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold">Live Cloud Intelligence Platform</p>
          </div>
        )}
      </main>
    </div>
  );
}
