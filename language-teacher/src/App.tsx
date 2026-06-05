import './App.css'
import Onboarding from './components/Onboarding'
import { useAppContext } from './Context'
import Menu from './components/Menu'
import { useEffect } from 'react'

const DEFAULT_APP_LANGUAGE = "en-US";

function App() {
  const {
    setUserEmail,
    setUserLocation,
    userLanguage,
    targetLanguage,
    userName,
    setTargetLanguage,
    theme, setTheme,
    setUserLanguage,
    setUserName,
    userEmail,
    userLocation,
  } = useAppContext();
  useEffect(() => {
    const getStoredConfig = () => {
      const storedUserLanguage = localStorage.getItem('userLanguage');
      const storedTargetLanguage = localStorage.getItem('targetLanguage');
      if (storedTargetLanguage) {
        setTargetLanguage(storedTargetLanguage);
        setUserLanguage(storedUserLanguage || DEFAULT_APP_LANGUAGE);
        setTheme(localStorage.getItem('theme') || 'light');
        setUserName(localStorage.getItem('name') || '');
        setUserEmail(localStorage.getItem('email') || '');
        setUserLocation(localStorage.getItem('location') || '');
      }
    }
    getStoredConfig();
  }, []);
  useEffect(() => {
    if (targetLanguage) {
      localStorage.setItem("targetLanguage", targetLanguage);
    }
    if (userLanguage) {
      localStorage.setItem("userLanguage", userLanguage);
    }
    if (theme) {
      localStorage.setItem("theme", theme);
    }
    if (userName) {
      localStorage.setItem("name", userName);
    }
    if (userEmail) {
      localStorage.setItem("email", userEmail);
    }
    if (userLocation) {
      localStorage.setItem("location", userLocation);
    }
  }, [targetLanguage, userLanguage, theme, userName, userEmail, userLocation]);

  const hasConfigured = !!userLanguage && !!userName && !!targetLanguage;
  return hasConfigured ?
    <Menu /> :
    <Onboarding />
}

export default App
