import { useMemo, useState } from 'react';
import { useAppContext } from '../Context';
import ThemeInput from './ThemeInput'
import { languages } from '../constants/languages';
// import { MissingLanguageWarning } from './components/MissingLanguageWarning'

export default function ConfigDisplay() {
  const { userLanguage, targetLanguage, voices } = useAppContext();
  const [showConfig, setShowConfig] = useState(false);

  const renderUserLanguage = useMemo(() => {
    return languages.find(lang => lang.code === userLanguage)?.label || userLanguage;
  }, [userLanguage]);

  const renderTargetLanguage = useMemo(() => {
    return languages.find(lang => lang.code === targetLanguage)?.label || targetLanguage;
  }, [targetLanguage]);

  const isTargetLanguageSupported = useMemo(() => {
    return voices.some(voice => voice.lang === targetLanguage);
  }, [voices, targetLanguage]);

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
    <div className="mb-8 p-3 flex flex-col justify-center border">
      <button
        onClick={() => setShowConfig(false)}
        className="btn btn-blue my-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        ⚙ Hide Config
      </button>
      <ThemeInput />
      <p className="font-bold">User language: {renderUserLanguage}</p>
      <p>Target learning language: {renderTargetLanguage}</p>
      {!isTargetLanguageSupported &&
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
          role="alert">
          <p>
            Some features may not work properly as {targetLanguage} is not supported.
          </p>
        </div>}
    </div>
  );
}