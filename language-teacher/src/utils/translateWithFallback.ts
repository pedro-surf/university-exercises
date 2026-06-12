/**
 * Translates a given text using a local dictionary, falling back to the browser's translation API.
 * * @param {string} text - The text to translate.
 * @param {string} sourceLang - The source language code (e.g., 'en').
 * @param {string} targetLang - The target language code (e.g., 'pt').
 * @param {Object} localDictionary - Your local translation map.
 * @returns {Promise<string>} The translated text.
 */
async function translateWithFallback(text, sourceLang, targetLang, localDictionary = {}) {
    // 1. Try to fetch from your local dictionary first
    if (localDictionary[targetLang] && localDictionary[targetLang][text]) {
        return localDictionary[targetLang][text];
    }

    // 2. Fallback: Check if the browser's native Translation API is supported
    if ('translation' in self && 'canTranslate' in self.translation) {
        try {
            const pair = { sourceLanguage: sourceLang, targetLanguage: targetLang };
            const canTranslate = await self.translation.canTranslate(pair);

            if (canTranslate !== 'no') {
                // Create a translator instance (the browser might download language packs here if status is 'readily')
                const translator = await self.translation.create(pair);
                const translatedText = await translator.translate(text);
                
                console.log(`[Translation] Used browser engine for: "${text}"`);
                return translatedText;
            }
        } catch (error) {
            console.warn("[Translation API Error]:", error);
            // If the browser fails, we fall back to the original text
        }
    }

    // 3. Ultimate Fallback: Return original text if nothing else works
    console.warn(`[Translation] No translation found for "${text}". Returning original.`);
    return text;
}

export default translateWithFallback;