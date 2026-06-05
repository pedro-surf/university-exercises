export function speakWord(word: string, language: string) {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
  
    // Stop any currently playing speech
    window.speechSynthesis.cancel();
  
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
  
    // Optional: try selecting a matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(language.toLowerCase().split("-")[0])
    );
  
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
  
    window.speechSynthesis.speak(utterance);
  }