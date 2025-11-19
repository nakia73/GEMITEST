
import React, { useState } from 'react';
import WallDisplay from './components/WallDisplay';
import TweenGenerator from './components/TweenGenerator';
import { AppMode, Language } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.BLUEPRINT);
  const [language, setLanguage] = useState<Language>('ja'); // Defaulting to Japanese as per latest request implication, or 'en'

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="antialiased">
      {mode === AppMode.BLUEPRINT ? (
        <WallDisplay 
          onStartPrototype={() => setMode(AppMode.PROTOTYPE)} 
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      ) : (
        <TweenGenerator 
          onBack={() => setMode(AppMode.BLUEPRINT)} 
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      )}
    </div>
  );
};

export default App;
