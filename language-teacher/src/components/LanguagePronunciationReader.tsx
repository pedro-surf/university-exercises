import { useCallback } from "react";
import { useAppContext } from "../Context";

export default function LanguagePronunciationReader() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const translations = {
    "en-US": `Learning languages becomes much easier when you can hear the pronunciation of every word individually.`,
    "fr-FR": `Apprendre des langues devient beaucoup plus facile lorsque vous pouvez entendre la prononciation de chaque mot individuellement.`,
    "pt-BR": `Aprender línguas torna-se muito mais fácil quando pode ouvir a pronúncia de cada palavra individualmente.`,
    "cs-CZ": `Učit se jazyky je mnohem jednodušší, když můžete slyšet výslovnost každého slova jednotlivě.`,
    "de-DE": `Das Erlernen von Sprachen wird viel einfacher, wenn Sie die Aussprache jedes Wortes einzeln hören können.`,
    "it-IT": `Imparare le lingue diventa molto più facile quando puoi sentire la pronuncia di ogni parola individualmente.`,
    "ja-JP": `言語を学ぶことは、個々の単語の発音を聞くことができると、はるかに簡単になります。`,
    "id-ID": `Belajar bahasa menjadi jauh lebih mudah ketika Anda dapat mendengar pengucapan setiap kata secara individual.`,
    "es-ES": `Aprender idiomas se vuelve mucho más fácil cuando puedes escuchar la pronunciación de cada palabra individualmente.`,
    "zh-CN": `当你能听到每个单词的发音时，学习语言会变得更容易。`
  };

  const {
     // userLanguage,
      targetLanguage: selectedLanguage,
    } = useAppContext();
    const speakWord = useCallback((word: string) => {
      if (!("speechSynthesis" in window)) {
        alert("Your browser does not support speech synthesis.");
        return;
      }

      // Stop any currently playing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Optional: try selecting a matching voice
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((voice) =>
        voice.lang.toLowerCase().startsWith(selectedLanguage.toLowerCase().split("-")[0])
      );

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, [selectedLanguage]);

    const speakSentence = useCallback(() => {
      if (!("speechSynthesis" in window)) {
        alert("Your browser does not support speech synthesis.");
        return;
      }
      console.log({ selectedLanguage })

      // Stop any currently playing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(translations[selectedLanguage]);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Optional: try selecting a matching voice
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((voice) =>
        voice.lang.toLowerCase().startsWith(selectedLanguage.toLowerCase().split("-")[0])
      );

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, [selectedLanguage, translations]);

    const copySentence = () => {
      navigator.clipboard.writeText(translations[selectedLanguage])
    };

    const words = translations[selectedLanguage]?.split(/(\s+)/) ?? [];

    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Interactive Pronunciation Reader
            </h1>
            <p className="text-gray-600 mt-2">
              Click any word to hear its pronunciation.
            </p>
          </div>

          <div className="text-xl leading-10 border rounded-2xl p-6 bg-gray-50">
            {words.map((token, index) => {
              const isWhitespace = /^\s+$/.test(token);

              if (isWhitespace) {
                return <span key={index}>{token}</span>;
              }

              const cleanWord = token.replace(/[.,!?;:]/g, "");

              return (
                <button
                  key={index}
                  onClick={() => speakWord(cleanWord)}
                  className="inline hover:bg-gray-200 rounded-lg px-1 transition-colors cursor-pointer"
                >
                  {token}
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={speakSentence}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Hear Whole Sentence
            </button>
            <button
              onClick={copySentence}
              className="ml-2 mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Copy Sentence
            </button>
          </div>
        </div>
      </div>
    );
  }