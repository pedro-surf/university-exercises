type LanguageDictionary = {
    id: string;
    word: string;
};

const languageModules = import.meta.glob(
    "../../assets/**/*.json"
);

const CATEGORY_PATHS = [
    "grammar/pronouns",
    "grammar/verbs",
    "grammar/adjectives",
    "grammar/prepositions",
    "grammar/articles",

    "vocabulary/food",
    "vocabulary/travel",
    "vocabulary/emotions",
    "vocabulary/business",
    "vocabulary/surfing",
];

export const getWord = async (
    id: string,
    language: string
): Promise<LanguageDictionary | null> => {
    for (const category of CATEGORY_PATHS) {
        const path =
            `../../assets/${language}/${category}.json`;

        const importer = languageModules[path];

        if (!importer) {
            continue;
        }

        try {
            const module = await importer();

            const items: LanguageDictionary[] =
            // @ts-expect-error okok
                module.default;

            const match = items.find(
                (item) => item.id === id
            );

            if (match) {
                return match;
            }
        } catch (error) {
            console.error(
                `Failed loading ${path}`,
                error
            );
        }
    }

    return null;
};