import { useMemo } from "react";
import { useAppContext } from "../Context";



export function MissingLanguageWarning() {
  const { targetLanguage: selectedLanguage, voices } = useAppContext();

  const exists = useMemo(() => voices.some((voice) =>
    voice.lang
      .toLowerCase()
      .startsWith(selectedLanguage.toLowerCase())
  ), [voices, selectedLanguage]);


  return (
    <div className="rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-5 space-y-3">
      {!exists && <><div className="text-xl font-bold text-yellow-900">
        Voice Not Installed
      </div>

        <p className="text-yellow-800">
          Your operating system does not appear to have a voice
          installed for:
        </p>

        <div className="font-semibold text-lg text-yellow-900">
          {selectedLanguage}
        </div>

        <div className="text-sm text-yellow-700 space-y-1">
          <p>
            Install the language voice in your operating system
            settings for much better pronunciation quality.
          </p>

          <p>
            After installation, restart your browser.
          </p>
        </div>
      </>}
      <div className="text-sm text-yellow-600">
        Current languages: {voices.map((v) => v.lang).join(", ")}
      </div>
    </div>
  );
}