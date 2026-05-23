import React from "react";

const LANGUAGES = [
  {
    code: "en-US",
    name: "English",
    flag: "🇺🇸",
  },

  {
    code: "pt-BR",
    name: "Português",
    flag: "🇧🇷",
  },

  {
    code: "es-ES",
    name: "Español",
    flag: "🇪🇸",
  },

  {
    code: "fr-FR",
    name: "Français",
    flag: "🇫🇷",
  },

  {
    code: "de-DE",
    name: "Deutsch",
    flag: "🇩🇪",
  },

  {
    code: "it-IT",
    name: "Italiano",
    flag: "🇮🇹",
  },

  {
    code: "cs-CZ",
    name: "Čeština",
    flag: "🇨🇿",
  },

  {
    code: "ja-JP",
    name: "日本語",
    flag: "🇯🇵",
  },

  {
    code: "ko-KR",
    name: "한국어",
    flag: "🇰🇷",
  },

  {
    code: "zh-CN",
    name: "中文",
    flag: "🇨🇳",
  },
];

type Props = {
  onSelect?: (language: string) => void;
};

export default function LanguageSelectionScreen({
  onSelect,
}: Props) {
  const [selectedIndex, setSelectedIndex] =
    React.useState(0);

  const selectedLanguage =
    LANGUAGES[selectedIndex];

  React.useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0
            ? LANGUAGES.length - 1
            : prev - 1
        );
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev === LANGUAGES.length - 1
            ? 0
            : prev + 1
        );
      }

      if (event.key === "Enter") {
        onSelect?.(selectedLanguage.code);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedLanguage, onSelect]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-4xl px-8">
        <div className="mb-14 text-center">
          <p className="text-white/50 text-xl mt-6">
            Use arrow keys ↑ ↓ or click
          </p>
        </div>

        <div className="space-y-3 max-h-[500px] flex flex-col justify-center">
          {LANGUAGES.map(
            (language, index) => {
              const isSelected =
                index === selectedIndex;

              return (
                <button
                  key={language.code}
                  onClick={() => {
                    setSelectedIndex(index);

                    onSelect?.(
                      language.code
                    );
                  }}
                  className={`w-full rounded-3xl px-8 py-6 flex items-center justify-between transition-all duration-200 ${isSelected
                    ? "bg-white text-black scale-[1.02] shadow-2xl"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <div className="text-4xl">
                      {language.flag}
                    </div>

                    <div className="text-3xl font-bold">
                      {language.name}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="text-sm uppercase tracking-[0.2em] font-bold">
                      Selected
                    </div>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
