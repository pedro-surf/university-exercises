import { useState } from 'react';
import { useAppContext } from '../Context';
import ThemeInput from './ThemeInput';
import LanguageInput from './LanguageInput';
import { originLanguageMap, targetLanguageMap } from '../constants/appTranslations';

export default function ConfigDisplay() {
  const { userLanguage, targetLanguage, setUserLanguage, setTargetLanguage } = useAppContext();
  const [showConfig, setShowConfig] = useState(false);


  if (!showConfig) {
    return (
      <div className="text-left p-4 text-blue-700" role="alert">
        <button
          onClick={() => setShowConfig(true)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          ⚙ Config
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 p-3 flex flex-col justify-center">
      <button
        onClick={() => setShowConfig(false)}
        className="btn btn-blue cursor-pointer my-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        ⚙ Hide Config
      </button>
      <ThemeInput />
      <div className="my-4">
        <p className="font-bold mb-2">{originLanguageMap[userLanguage]}</p>
        <LanguageInput
          value={userLanguage}
          onChange={(newLanguage) => setUserLanguage(newLanguage)}
        />
      </div>
      <div className="my-4">
        <p className="font-bold mb-2">{targetLanguageMap[userLanguage]}</p>
        <LanguageInput
          value={targetLanguage}
          onChange={(newLanguage) => setTargetLanguage(newLanguage)}
        />
      </div>
    </div>
  );
}