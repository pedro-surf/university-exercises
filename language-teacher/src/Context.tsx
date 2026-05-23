import React, { createContext, useState, useEffect, useContext } from "react";
import { loadTranslation } from "./utils/loadTranslation";

type AppContextType = {
  theme: "light" | "dark" | string;
  setTheme: (theme: "light" | "dark" | string) => void;
  userLanguage: string;
  setUserLanguage: (language: string) => void;
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
  voices: SpeechSynthesisVoice[];
  translations: Translation;
  setUserName: (username: string) => void;
  userName?: string;
  setUserEmail: (email: string) => void;
  userEmail?: string;
  setUserLocation: (location: string) => void;
  userLocation?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translation = { [key: string]: any };

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark" | string>("light");
  const [userLanguage, setUserLanguage] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [translations, setTranslations] = useState<Translation>({});
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userLocation, setUserLocation] = useState<string>("");

  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Fetch voices and handle onvoiceschanged
    fetchVoices();
    speechSynthesis.onvoiceschanged = fetchVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null; // Cleanup
    };
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const vocabulary = await loadTranslation(targetLanguage, "grammar/pronouns");
        const verbs = await loadTranslation(targetLanguage, "grammar/pronouns");

        setTranslations({ vocabulary, verbs });
      } catch (error) {
        console.error("Error loading translations:", error);
        setTranslations({ vocabulary: null, verbs: null });
      }
    };

    loadTranslations();
  }, [targetLanguage]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        userLanguage,
        setUserLanguage,
        targetLanguage,
        setTargetLanguage,
        voices,
        translations,
        userName,
        setUserName,
        userLocation,
        setUserLocation,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};