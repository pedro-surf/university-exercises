import { useMemo } from "react";
import { useAppContext } from "../Context";
import { languages } from "../constants/languages";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hideHelpText?: boolean;
};

const LanguageInput = ({ value, onChange, hideHelpText }: Props) => {
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
    <div className="flex flex-col justify-center items-center w-full">
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
      {!hideHelpText && <p>Note: The language options are based on the voices available in your browser.</p>
      }    </div>

  );
};

export default LanguageInput;