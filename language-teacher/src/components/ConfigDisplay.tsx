import { useState } from 'react';
import { useAppContext } from '../Context';
import ThemeInput from './ThemeInput'
// import { MissingLanguageWarning } from './components/MissingLanguageWarning'

export default function ConfigDisplay() {
  const { userLanguage, targetLanguage } = useAppContext();
  const [showConfig, setShowConfig] = useState(false);

  if (!showConfig) {
    return (
      <div className="text-left p-4 text-blue-700" role="alert">
        <button
          onClick={() => setShowConfig(true)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          ⚙ Config
        </button>
      </div>
    );
  }

  return (
    <div>
      <ThemeInput />
      <p className="font-bold">User language: {userLanguage}. Selected language: {targetLanguage}</p>
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700" role="alert">
        <p>Some features may not work properly as {targetLanguage} is not supported.</p>
      </div>
    </div>
  );
}