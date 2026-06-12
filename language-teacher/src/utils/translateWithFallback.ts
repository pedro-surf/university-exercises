

export interface LocalDictionary {
  [targetLang: string]: {
    [originalText: string]: string;
  };
}

/**
 * Translates a given text using a local dictionary, falling back to the browser's translation API.
 */
async function translateWithFallback(
  text: string,
  sourceLang: string,
  targetLang: string,
  localDictionary: LocalDictionary = {}
): Promise<string> {

  // 1. Try to fetch from your local dictionary first
  if (localDictionary[targetLang] && localDictionary[targetLang][text]) {
    return localDictionary[targetLang][text];
  }

  // 2. Fallback: Checagem nativa isolando o objeto translation com tipo explícito
  const currentWindow = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : null);

  // Extraímos a API forçando o tipo exato 'TranslationAPI'
  // Substitua aquela linha antiga por esta:
  const translationAPI = currentWindow
    ? (currentWindow).translation as TranslationAPI | undefined
    : undefined;
  if (translationAPI && typeof translationAPI.canTranslate === 'function') {
    try {
      const pair: TranslationPair = { sourceLanguage: sourceLang, targetLanguage: targetLang };

      // Aqui o TS é obrigado a aceitar porque 'translationAPI' foi tipado diretamente acima
      const canTranslate = await translationAPI.canTranslate(pair);

      if (canTranslate !== 'no') {
        const translator = await translationAPI.create(pair);
        const translatedText = await translator.translate(text);

        console.log(`[Translation] Used browser engine for: "${text}"`);
        return translatedText;
      }
    } catch (error) {
      console.warn("[Translation API Error]:", error);
    }
  }

  // 3. Ultimate Fallback
  console.warn(`[Translation] No translation found for "${text}". Returning original.`);
  return text;
}

export default translateWithFallback;