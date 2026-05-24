import { useMemo } from "react";
import { useAppContext } from "../Context";
import { languages } from "../constants/languages";

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

  return (
    <div className="flex justify-center items-center w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-xl px-3 py-2 bg-gray-100 w-full"
      >
        {(availableLanguages).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {languages[lang.label] ?? lang.label}
          </option>
        ))}
      </select>
    </div>

  );
};

export default LanguageInput;