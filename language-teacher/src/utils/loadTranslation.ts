export const loadTranslation = async (language: string, file: string) => {
    try {
        console.log(`Loading translation file: ${file} for language: ${language}`);
        const module = await import(`../../assets/${language}/${file}.json`);
        return module.default;
    } catch (error) {
        console.error(`Error loading translation file: ${file} for language: ${language}`, error);
        return null;
    }
};