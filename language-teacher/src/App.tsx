import './App.css'
import Onboarding from './components/Onboarding/Onboarding'
import { useAppContext } from './Context'
import Menu from './components/Menu'
import { useEffect } from 'react'

const DEFAULT_APP_LANGUAGE = "en-US";

function App() {
  const { setUserEmail, setUserLocation, userLanguage, targetLanguage, setTargetLanguage, setTheme, setUserLanguage, setUserName } = useAppContext();
  useEffect(() => {
    const getStoredConfig = () => {
      const storedUserLanguage = localStorage.getItem('userLanguage');
      const storedTargetLanguage = localStorage.getItem('targetLanguage');
      if (storedTargetLanguage) {
        setTargetLanguage(storedTargetLanguage);
        setUserLanguage(storedUserLanguage || DEFAULT_APP_LANGUAGE);
        setTheme(localStorage.getItem('themeMode') || 'light');
        setUserName(localStorage.getItem('name') || '');
        setUserEmail(localStorage.getItem('email') || '');
        setUserLocation(localStorage.getItem('location') || '');
      }
    }
    getStoredConfig();
  }, [])
  const hasConfigured = Boolean(userLanguage) && Boolean(targetLanguage);
  return hasConfigured ? <Menu /> : <Onboarding />
}

export default App
