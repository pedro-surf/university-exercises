const translationModules =
    import.meta.glob(
        "../assets/**/*.json"
    );

export const loadTranslation =
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