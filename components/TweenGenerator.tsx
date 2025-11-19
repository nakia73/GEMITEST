
import React, { useState, useRef, useEffect } from 'react';
import { planAnimationPrompts, generateFrameFromReference } from '../services/geminiService';
import { AnimationFrame, Language } from '../types';
import { translations } from '../translations';

interface TweenGeneratorProps {
  onBack: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

const TweenGenerator: React.FC<TweenGeneratorProps> = ({ onBack, language, onToggleLanguage }) => {
  const t = translations[language].tweenGenerator;

  // State
  const [startImage, setStartImage] = useState<string | null>(null);
  const [motionPrompt, setMotionPrompt] = useState<string>('');
  const [frameCount, setFrameCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [frames, setFrames] = useState<AnimationFrame[]>([]);
  
  // Refs for preview animation
  const [previewIndex, setPreviewIndex] = useState(0);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation Loop
  useEffect(() => {
    if (frames.length > 0) {
      animationRef.current = setInterval(() => {
        setPreviewIndex(prev => (prev + 1) % frames.length);
      }, 200); // 5 FPS
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [frames]);

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setStartImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!startImage || !motionPrompt) return;
    
    setIsGenerating(true);
    setFrames([]);
    setPreviewIndex(0); // Reset preview index to prevent out-of-bounds errors
    
    const currentT = translations[language].tweenGenerator;
    setStatusMessage(currentT.statusPhase1);

    try {
      // Extract MIME type and Base64 data safely
      const match = startImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) {
        throw new Error("Invalid image data format");
      }
      const mimeType = match[1];
      const rawBase64 = match[2];

      // 1. Plan Animation (Get Prompts)
      const prompts = await planAnimationPrompts(
        rawBase64,
        mimeType,
        motionPrompt,
        frameCount
      );

      setStatusMessage(currentT.statusPhase2.replace('{n}', prompts.length.toString()));

      // 2. Generate Images (Sequential loop to allow progress updates, but technically independent)
      const generatedFrames: AnimationFrame[] = [];
      
      // Add Original Start Frame as Frame 0
      generatedFrames.push({ 
        id: 'start', 
        url: startImage, 
        prompt: 'Original Source', 
        type: 'start', 
        index: 0 
      });
      // Update state immediately to show start frame
      setFrames([...generatedFrames]);

      for (let i = 0; i < prompts.length; i++) {
        setStatusMessage(currentT.statusRendering.replace('{n}', (i + 1).toString()).replace('{total}', prompts.length.toString()));
        
        // Generate using Original Image + Planned Prompt
        const imgData = await generateFrameFromReference(rawBase64, mimeType, prompts[i]);
        
        const newFrame: AnimationFrame = {
          id: `gen-${i}`,
          url: imgData,
          prompt: prompts[i],
          type: 'generated',
          index: i + 1
        };
        
        generatedFrames.push(newFrame);
        setFrames([...generatedFrames]); // Update UI incrementally
      }

      setStatusMessage(currentT.statusComplete);

    } catch (error: any) {
      console.error(error);
      // Show a more descriptive error if available
      const errorMessage = error?.message || "Unknown Error";
      setStatusMessage(`${currentT.statusError} (${errorMessage})`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center">
            <svg className="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">{t.backButton}</span>
          </button>
          <h1 className="text-xl font-bold text-yellow-400">{t.title}</h1>
        </div>
        <div className="flex items-center space-x-4">
            <button 
              onClick={onToggleLanguage}
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-xs font-bold text-slate-300 hover:text-white hover:border-slate-400 transition-all"
            >
              {language === 'en' ? '🇺🇸 EN' : '🇯🇵 JA'}
            </button>
            <div className="flex items-center space-x-2 text-sm text-slate-400 border-l border-slate-700 pl-4">
              <span className={`h-2 w-2 rounded-full ${process.env.API_KEY ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{t.apiKeyStatus}</span>
            </div>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">{t.keyframes}</h3>
            
            {/* Start Image Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">{t.startFrame}</label>
              <div className="relative aspect-square bg-slate-900 rounded border-2 border-dashed border-slate-600 hover:border-slate-400 transition-colors flex items-center justify-center overflow-hidden group">
                {startImage ? (
                  <img src={startImage} alt="Start" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-slate-600 text-center px-4">{t.uploadStart}</span>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Motion Prompt Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">{t.motionPromptLabel}</label>
              <textarea
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
                placeholder={t.motionPromptPlaceholder}
                className="w-full h-24 bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-100 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">{t.settings}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t.totalFrames}: <span className="text-yellow-400 font-mono">{frameCount}</span>
              </label>
              <input 
                type="range" 
                min="3" 
                max="10" 
                value={frameCount} 
                onChange={(e) => setFrameCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!startImage || !motionPrompt || isGenerating}
              className={`w-full py-3 rounded-lg font-bold text-lg shadow-lg transition-all ${
                !startImage || !motionPrompt || isGenerating
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? t.generating : t.generateButton}
            </button>
          </div>
        </div>

        {/* Center: Workspace / Results */}
        <div className="lg:col-span-6 space-y-6">
           <div className="bg-slate-800/50 rounded-lg p-6 min-h-[600px] border border-slate-700 flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                {t.filmStrip}
              </h2>

              {isGenerating && (
                 <div className="flex items-center justify-center p-4 bg-slate-900/50 rounded-lg mb-4 border border-yellow-500/20">
                   <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce mr-2"></div>
                   <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce mr-2 delay-100"></div>
                   <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce mr-4 delay-200"></div>
                   <p className="text-yellow-400 font-mono text-sm">{statusMessage}</p>
                 </div>
              )}

              {!isGenerating && frames.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                  <p className="max-w-xs text-center">{t.placeholderText}</p>
                </div>
              )}

              {frames.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 max-h-[600px] custom-scrollbar">
                  {frames.map((frame, idx) => (
                    <div key={frame.id} className={`relative group rounded-xl overflow-hidden border-2 ${frame.type === 'generated' ? 'border-purple-500/30' : 'border-green-500/30'}`}>
                      <img src={frame.url} alt={frame.prompt} className="w-full h-48 object-contain bg-slate-900" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs text-slate-300 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="font-bold text-white mr-2">#{idx}</span>
                        {frame.prompt.slice(0, 80)}...
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-xs font-bold uppercase tracking-wider text-white">
                        {frame.type === 'start' ? 'BASE' : `+ ${(idx * (100 / (frames.length -1))).toFixed(0)}%`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* Right Sidebar: Preview */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">{t.livePreview}</h3>
            <div className="aspect-square bg-black rounded-lg border border-slate-600 flex items-center justify-center overflow-hidden shadow-inner mb-4">
               {frames.length > 0 && frames[previewIndex] ? (
                 <img src={frames[previewIndex].url} alt="Preview" className="w-full h-full object-contain" />
               ) : (
                 <div className="text-slate-600 text-sm text-center">
                   {t.waitingForFrames}
                 </div>
               )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-slate-400 font-mono bg-slate-900 p-3 rounded">
              <span>{t.fps}: 5</span>
              <span>{t.frame}: {frames.length > 0 ? previewIndex : 0} / {frames.length > 0 ? frames.length -1 : 0}</span>
            </div>
            
            {frames.length > 0 && (
               <div className="mt-4 p-4 bg-slate-900/50 rounded border border-slate-700/50">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{t.debugInfo}</h4>
                  <p className="text-xs text-slate-400">
                    {t.model1}: <span className="text-blue-400">gemini-2.5-flash</span>
                    <br/>
                    {t.model2}: <span className="text-purple-400">gemini-2.5-flash-image</span>
                  </p>
               </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default TweenGenerator;
