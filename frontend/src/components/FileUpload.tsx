"use client";
import React, { useState } from 'react';
import { processUWorldUpload } from '../app/actions';

export default function FileUpload() {
  const [status, setStatus] = useState<string>("");

  async function handleUpload(formData: FormData) {
    setStatus("Analyzing...");
    try {
      const result = await processUWorldUpload(formData);
      if (result.success) {
        setStatus("✅ Analysis Ready!");
      } else {
        setStatus("❌ Error uploading.");
      }
    } catch (e) {
      setStatus("❌ Server Error");
    }
  }

  return (
    <form action={handleUpload} className="w-full">
      <div className="w-full p-4 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-800 transition-colors">
        <label className="cursor-pointer flex flex-col items-center justify-center">
          <span className="text-indigo-400 font-bold mb-2">+ Add Medical Source</span>
          <span className="text-xs text-slate-500">{status || "Upload UWorld PDF or Word Docs"}</span>
          <input 
            name="file" 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx" 
            onChange={(e) => {
               if (e.target.files?.length) {
                 e.target.form?.requestSubmit();
               }
            }} 
          />
        </label>
      </div>
    </form>
  );
}
