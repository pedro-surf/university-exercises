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
  origin: Translation;
  translations: Translation;
  setUserName: (username: string) => void;
  userName?: string;
  setUserEmail: (email: string) => void;
  userEmail?: string;
  setUserLocation: (location: string) => void;
  userLocation?: string;
  userId?: string;
  setUserId: (id: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  userBio: string;
  setUserBio: (bio: string) => void;
};

const STORAGE_KEY = "language-teacher-user";

type StoredUser = {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userLocation?: string;
  userLanguage?: string;
  targetLanguage?: string;
  isPublic?: boolean;
  userBio?: string;
  theme?: string;
};

function readStoredUser(): StoredUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : {};
  } catch {
    return {};
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const stored = readStoredUser();

  const [theme, setTheme] = useState<"light" | "dark" | string>(
    stored.theme || "light"
  );
  const [userLanguage, setUserLanguage] = useState<string>(
    stored.userLanguage || ""
  );
  const [targetLanguage, setTargetLanguage] = useState<string>(
    stored.targetLanguage || ""
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [translations, setTranslations] = useState<Translation>(
    {} as Translation
  );
  const [origin, setOrigin] = useState<Translation>({} as Translation);
  const [userName, setUserName] = useState<string>(stored.userName || "");
  const [userEmail, setUserEmail] = useState<string>(stored.userEmail || "");
  const [userLocation, setUserLocation] = useState<string>(
    stored.userLocation || ""
  );
  const [userId, setUserId] = useState<string>(stored.userId || "");
  const [isPublic, setIsPublic] = useState<boolean>(
    Boolean(stored.isPublic)
  );
  const [userBio, setUserBio] = useState<string>(stored.userBio || "");

  useEffect(() => {
    const payload: StoredUser = {
      userId,
      userName,
      userEmail,
      userLocation,
      userLanguage,
      targetLanguage,
      isPublic,
      userBio,
      theme,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    userId,
    userName,
    userEmail,
    userLocation,
    userLanguage,
    targetLanguage,
    isPublic,
    userBio,
    theme,
  ]);

  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    fetchVoices();
    speechSynthesis.onvoiceschanged = fetchVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const loadOrigins = async () => {
      const payload = await loadTranslation(userLanguage);
      if (payload) setOrigin(payload);
    };
    if (userLanguage) {
      loadOrigins();
    }
  }, [userLanguage]);

  useEffect(() => {
    const loadTranslations = async () => {
      const payload = await loadTranslation(targetLanguage);
      if (payload) setTranslations(payload);
    };
    if (targetLanguage) {
      loadTranslations();
    }
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
        origin,
        translations,
        userName,
        setUserName,
        userLocation,
        setUserLocation,
        userEmail,
        setUserEmail,
        userId,
        setUserId,
        isPublic,
        setIsPublic,
        userBio,
        setUserBio,
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
