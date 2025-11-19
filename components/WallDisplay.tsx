
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface WallDisplayProps {
  onStartPrototype: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

const WallDisplay: React.FC<WallDisplayProps> = ({ onStartPrototype, language, onToggleLanguage }) => {
  const t = translations[language].wallDisplay;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center relative">
      {/* Language Toggle */}
      <div className="absolute top-6 right-8">
        <button 
          onClick={onToggleLanguage}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-full text-sm font-bold text-slate-300 hover:text-white hover:border-slate-400 transition-all flex items-center space-x-2"
        >
          <span>{language === 'en' ? '🇺🇸 EN' : '🇯🇵 JA'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500 group-hover:text-slate-400">Switch</span>
        </button>
      </div>

      <header className="mb-12 text-center mt-8">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
          {t.title}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full mb-12">
        
        {/* Column 1: Inputs */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-yellow-400">
            <span className="bg-yellow-500/20 p-2 rounded-lg mr-3 text-lg">01</span>
            {t.inputPhase.title}
          </h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            {t.inputPhase.description}
          </p>
          <div className="mt-auto bg-black/30 rounded-lg p-4 font-mono text-sm text-green-400 border-l-4 border-green-500">
            {t.inputPhase.badge}
          </div>
        </div>

        {/* Column 2: The Brain (Gemini Flash) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <svg className="w-24 h-24 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-400">
            <span className="bg-blue-500/20 p-2 rounded-lg mr-3 text-lg">02</span>
            {t.reasoningPhase.title}
          </h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            {t.reasoningPhase.description}
          </p>
          <div className="mt-auto space-y-2">
            {t.reasoningPhase.logs.map((log: string, i: number) => (
              <div key={i} className="bg-black/30 rounded p-2 font-mono text-xs text-blue-300 truncate">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: The Artist (Nano Banana) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-purple-400">
             <span className="bg-purple-500/20 p-2 rounded-lg mr-3 text-lg">03</span>
            {t.renderPhase.title}
          </h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            {t.renderPhase.description}
          </p>
          <div className="mt-auto flex space-x-2">
            {t.renderPhase.frames.map((frame: string, i: number) => (
              <div key={i} className="h-12 w-12 bg-purple-900/50 border border-purple-500/30 rounded flex items-center justify-center text-xs text-center">
                {frame}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="inline-block p-[2px] rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          <button 
            onClick={onStartPrototype}
            className="px-12 py-4 bg-slate-900 rounded-full text-white font-bold text-lg hover:bg-slate-800 transition-all flex items-center"
          >
            {t.startButton}
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        <p className="mt-4 text-slate-500 text-sm">
          {t.readyText}
        </p>
      </div>
    </div>
  );
};

export default WallDisplay;
