import { useMemo } from "react";
import { useAppContext } from "../Context";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const LanguageInput = ({ value, onChange }: Props) => {
  const {
    voices,
  } = useAppContext();

  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "pt-BR", label: "Portuguese (Brazil)" },
    { code: "es-ES", label: "Spanish (Spain)" },
    { code: "fr-FR", label: "French" },
    { code: "id-ID", label: "Indonesian" },
    { code: "cs-CZ", label: "Czech" },
    { code: "de-DE", label: "German" },
    { code: "it-IT", label: "Italian" },
    { code: "ja-JP", label: "Japanese" },
    { code: "zh-CN", label: "Chinese (Mandarin)" },
  ];



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
        {(languages || availableLanguages).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>

  );
};

export default LanguageInput;