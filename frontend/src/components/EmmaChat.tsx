"use client";
import React, { useState } from 'react';
import { askEmma } from '../app/actions';

export default function EmmaChat() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support speech recognition.");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsProcessing(true);
      
      // Trigger the AI Action
      await askEmma(text);
      
      // Play the response
      const audio = new Audio('/audio/emma_response.mp3?t=' + Date.now());
      audio.play();
      setIsProcessing(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
      {transcript && (
        <div className="bg-indigo-600 text-white p-4 rounded-2xl max-w-xs shadow-2xl text-sm border border-indigo-400">
          <p className="font-bold text-[10px] uppercase opacity-70 mb-1">Your Question</p>
          "{transcript}"
          {isProcessing && <p className="text-[10px] mt-2 animate-pulse font-bold text-indigo-200">EMMA IS THINKING...</p>}
        </div>
      )}
      <button 
        onClick={startListening}
        className={`h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-500 hover:scale-110 shadow-indigo-500/50'}`}
      >
        <span className="text-2xl text-white">{isListening ? '⬢' : '🎙️'}</span>
      </button>
    </div>
  );
}
