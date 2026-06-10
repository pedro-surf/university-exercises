import React, { useEffect } from "react";
import { LANGUAGES } from "../../constants/languages";
import { useAppContext } from "../../Context";


type Props = {
  onChange?: (language: string) => void;
};

export default function LanguageSelectionScreen({
  onChange,
}: Props) {
  const [selectedIndex, setSelectedIndex] =
    React.useState(0);
  const { setUserLanguage } = useAppContext();

  useEffect(() => {
    setUserLanguage(LANGUAGES[selectedIndex].code)
  }, [selectedIndex])


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
        onChange?.(selectedLanguage.code);
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
  }, [selectedLanguage, onChange]);

  return (
    <div className="bg-black text-white px-8 py-16">
      <div className="space-y-3">
        {LANGUAGES.map(
          (language, index) => {
            const isSelected =
              index === selectedIndex;

            return (
              <button
                key={language.code}
                onClick={() => {
                  setSelectedIndex(index);

                  onChange?.(
                    language.code
                  );
                }}
                className={`w-full rounded-3xl px-8 py-6 flex items-center justify-between transition-all duration-200 ${isSelected
                  ? "bg-white text-black scale-[1.02] shadow-2xl"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                ref={
                  isSelected
                    ? (el) => {
                      el?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    : null
                }
              >
                <div className="flex items-center gap-5">
                  <div className="text-4xl">
                    {language.flag}
                  </div>

                  <div className="text-3xl font-bold">
                    {language.name}
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}