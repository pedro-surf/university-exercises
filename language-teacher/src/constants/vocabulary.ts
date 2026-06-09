
export type VocabularyCategory =
    | "food"
    | "travel"
    | "emotions"
    | "business"
    | "surfing";

export type MenuItem = {
    id: VocabularyCategory;
    label: string;
    emoji: string;
    title: { [key: string]: string };
    description: { [key: string]: string };
};


export const foodMap = {
    'en-US': 'Food',
    'pt-BR': 'Comida',
    'es-ES': 'Comida',
    'fr-FR': 'Nourriture',
    'cs-CZ': 'Jídlo',
    'de-DE': 'Essen',
    'it-IT': 'Cibo',
    'id-ID': 'Makanan'
}

export const travelMap = {
    'en-US': 'Travel',
    'pt-BR': 'Viagem',
    'es-ES': 'Viaje',
    'fr-FR': 'Voyage',
    'cs-CZ': 'Cestování',
    'de-DE': 'Reisen',
    'it-IT': 'Viaggio',
    'id-ID': 'Perjalanan'
};

export const emotionsMap = {
    'en-US': 'Emotions',
    'pt-BR': 'Emoções',
    'es-ES': 'Emociones',
    'fr-FR': 'Émotions',
    'cs-CZ': 'Emoce',
    'de-DE': 'Emotionen',
    'it-IT': 'Emozioni',
    'id-ID': 'Emosi'
};

export const businessMap = {
    'en-US': 'Business',
    'pt-BR': 'Negócios',
    'es-ES': 'Negocios',
    'fr-FR': 'Affaires',
    'cs-CZ': 'Obchod',
    'de-DE': 'Geschäft',
    'it-IT': 'Affari',
    'id-ID': 'Bisnis'
};

export const foodDescriptionMap = {
    'en-US': 'Learn food and restaurant vocabulary.',
    'pt-BR': 'Aprenda vocabulário de comida e restaurante.',
    'es-ES': 'Aprende vocabulario de comida y restaurante.',
    'fr-FR': 'Apprenez le vocabulaire de la nourriture et des restaurants.',
    'cs-CZ': 'Naučte se slovní zásobu jídla a restaurací.',
    'de-DE': 'Lernen Sie Lebensmittel- und Restaurantvokabular.',
    'it-IT': 'Impara il vocabolario del cibo e dei ristoranti.',
    'id-ID': 'Pelajari kosakata makanan dan restoran.'
};

export const travelDescriptionMap = {
    "en-US": "Learn travel and transportation vocabulary.",
    "pt-BR": "Aprenda vocabulário de viagens e transporte.",
    "es-ES": "Aprende vocabulario de viajes y transporte.",
    "fr-FR": "Apprenez le vocabulaire des voyages et des transports.",
    "cs-CZ": "Naučte se slovní zásobu cestování a dopravy.",
    "de-DE": "Lernen Sie Reise- und Transportvokabular.",
    "it-IT": "Impara il vocabolario dei viaggi e dei trasporti.",
    "id-ID": "Pelajari kosakata perjalanan dan transportasi.",
};

export const emotionsDescriptionMap = {
    "en-US": "Express feelings and emotional states.",
    "pt-BR": "Expresse sentimentos e estados emocionais.",
    "es-ES": "Expresa sentimientos y estados emocionales.",
    "fr-FR": "Exprimez vos sentiments et états émotionnels.",
    "cs-CZ": "Vyjadřujte pocity a emocionální stavy.",
    "de-DE": "Drücken Sie Gefühle und emotionale Zustände aus.",
    "it-IT": "Esprimi sentimenti e stati emotivi.",
    "id-ID": "Ekspresikan perasaan dan keadaan emosional.",
};

export const businessDescriptionMap = {
    "en-US": "Professional and workplace vocabulary.",
    "pt-BR": "Vocabulário profissional e do ambiente de trabalho.",
    "es-ES": "Vocabulario profesional y del entorno laboral.",
    "fr-FR": "Vocabulaire professionnel et du monde du travail.",
    "cs-CZ": "Profesionální slovní zásoba a slovní zásoba pracovního prostředí.",
    "de-DE": "Berufs- und Arbeitsvokabular.",
    "it-IT": "Vocabolario professionale e del luogo di lavoro.",
    "id-ID": "Kosakata profesional dan lingkungan kerja.",
};

export const surfingMap = {
    "en-US": "Surfing",
    "pt-BR": "Surfing",
    "es-ES": "Surfing",
    "fr-FR": "Surfing",
    "cs-CZ": "Surfing",
    "de-DE": "Surfing",
    "it-IT": "Surfing",
    "id-ID": "Surfing",
};

export const surfingDescriptionMap = {
    "en-US": "Ocean, surfing, and beach culture words.",
    "pt-BR": "Palavras relacionadas ao oceano, surf e cultura de praia.",
    "es-ES": "Palabras relacionadas con el océano, el surf y la cultura de playa.",
    "fr-FR": "Mots liés à l'océan, au surf et à la culture de plage.",
    "cs-CZ": "Slova související s oceánem, surfováním a plážovou kulturou.",
    "de-DE": "Wörter rund um Ozean, Surfen und Strandkultur.",
    "it-IT": "Parole legate all'oceano, al surf e alla cultura della spiaggia.",
    "id-ID": "Kata-kata tentang laut, selancar, dan budaya pantai.",
};

export const menuItems: MenuItem[] = [
    {
        id: "food",
        label: "Food",
        emoji: "🍞",
        title: foodMap,
        description: foodDescriptionMap,
    },

    {
        id: "travel",
        label: "Travel",
        emoji: "✈️",
        title: travelMap,
        description: travelDescriptionMap,
    },

    {
        id: "emotions",
        label: "Emotions",
        emoji: "❤️",
        title: emotionsMap,
        description: emotionsDescriptionMap,
    },

    {
        id: "business",
        label: "Business",
        emoji: "💼",
        title: businessMap,
        description: businessDescriptionMap,
    },

    {
        id: "surfing",
        label: "Surfing",
        emoji: "🏄",
        title: surfingMap,
        description: surfingDescriptionMap,
    },
];