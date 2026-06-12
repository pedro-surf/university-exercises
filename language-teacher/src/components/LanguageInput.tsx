import { useMemo } from "react";
import { useAppContext } from "../Context";
import { APP_SUPPORTED_LANGUAGES } from "../constants/languages";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const LanguageInput = ({ value, onChange }: Props) => {
  const {
    voices,
  } = useAppContext();

  const availableLanguages = useMemo(() => {
    return Array.from(
      new Set(voices.map((voice) => voice.lang))
    ).map((lang) => {
      const label = new Intl.DisplayNames(["en"], { type: "language" }).of(
        lang.split("-")[0]
      );
      return { code: lang, label: label || lang };
    });
  }, [voices]);

  console.log("Available browser languages:", availableLanguages);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-xl px-3 py-2 bg-gray-100 w-full"
      >
        <option key="null" value={undefined}>Select...</option>
        {Object.keys(APP_SUPPORTED_LANGUAGES).map((lang) => (
          <option key={lang} value={lang}>
            {APP_SUPPORTED_LANGUAGES[lang]}
          </option>
        ))}
      </select>
    </div>

  );
};

export default LanguageInput;