const translationModules =
    import.meta.glob(
        "../assets/**/*.json"
    );

export const loadModule =
    async (
        language: string,
        file: string
    ) => {
        try {
            const path = `../assets/${language}/${file}.json`;

            const importer =
                translationModules[path];

            if (!importer) {
                throw new Error(
                    `Translation file not found: ${path}`
                );
            }

            // @ts-expected-error
            const module: any =
                await importer();

            return module.default;
        } catch (error) {
            console.error(
                `Error loading translation file: ${file} for language: ${language}`,
                error
            );

            return [];
        }
    };

export const loadTranslation = async (lang: string) => {
    try {
        const [
            verbs,
            pronouns,
            possessives,
            adjectives,
            articles,
            prepositions,
            food,
            travel,
            business,
            surfing,
            emotions,
        ] = await Promise.all([
            loadModule(lang, "grammar/verbs"),
            loadModule(lang, "grammar/pronouns"),
            loadModule(lang, "grammar/possessives"),
            loadModule(lang, "grammar/adjectives"),
            loadModule(lang, "grammar/articles"),
            loadModule(lang, "grammar/prepositions"),
            loadModule(lang, "vocabulary/food"),
            loadModule(lang, "vocabulary/travel"),
            loadModule(lang, "vocabulary/business"),
            loadModule(lang, "vocabulary/surfing"),
            loadModule(lang, "vocabulary/emotions"),
        ])
        return {
            possessives,
            verbs,
            pronouns,
            adjectives,
            articles,
            prepositions,
            food,
            travel,
            business,
            surfing,
            emotions,
        }
    } catch (error) {
        console.error("Error loading translations:", error);
        return null;
    }
};