export type GrammarCategory =
    | "pronouns"
    | "adjectives"
    | "articles"
    | "prepositions"
    | "possessives"
    | "adverbs"
    | "verbs"
    | "conjunctions";

export const grammarMap = {
    ["en-US"]: {
        pronouns: "pronouns",
        adjectives: "adjectives",
        articles: "articles",
        adverbs: "adverbs",
        conjunctions: "conjunctions",
        verbs: "verbs",
        prepositions: "prepositions",
        possessives: "possessives",
    },
    ["pt-BR"]: {
        pronouns: "pronomes",
        adjectives: "adjetivos",
        articles: "artigos",
        adverbs: "advérbios",
        conjunctions: "conjunções",
        verbs: "verbos",
        prepositions: "preposições",
        possessives: "possessivos",
    },
    ["es-ES"]: {
        pronouns: "pronombres",
        adjectives: "adjetivos",
        articles: "artículos",
        adverbs: "adverbios",
        conjunctions: "conjunciónes",
        verbs: "verbos",
        prepositions: "preposiciones",
        possessives: "posesivos",
    },
    ["fr-FR"]: {
        pronouns: "pronoms",
        adjectives: "adjectifs",
        articles: "articles",
        adverbs: "adverbe",
        conjunctions: "conjonctions",
        verbs: "verbes",
        prepositions: "prépositions",
        possessives: "possessifs",
    },
    ["cs-CZ"]: {
        pronouns: "zájmena",
        adjectives: "přídavná jména",
        articles: "články",
        adverbs: "příslovce",
        conjunctions: "spojka",
        verbs: "slovesa",
        prepositions: "předložky",
        possessives: "přivlastňovací zájmena",
    },
    ["de-DE"]: {
        pronouns: "pronomen",
        adjectives: "adjektive",
        articles: "artikel",
        adverbs: "adverb",
        conjunctions: "konjunktion",
        verbs: "verben",
        prepositions: "präpositionen",
        possessives: "besitzanzeigende pronomen",
    },
    ["nl-NL"]: {
        pronouns: "voornaamwoorden",
        adjectives: "bijvoeglijke naamwoorden",
        articles: "lidwoorden",
        adverbs: "bijwoorden",
        conjunctions: "voegwoorden",
        verbs: "werkwoorden",
        prepositions: "voorzetsels",
        possessives: "bezittelijke voornaamwoorden",
    },
    ["it-IT"]: {
        pronouns: "pronomi",
        adjectives: "aggettivi",
        articles: "articoli",
        adverbs: "avverbio",
        conjunctions: "congiunzione",
        verbs: "verbi",
        prepositions: "preposizioni",
        possessives: "possessivi",
    },
    ["ja-JP"]: {
        pronouns: "代名詞",
        adjectives: "形容詞",
        articles: "冠詞",
        adverbs: "adverbs",
        conjunctions: "conjunctions",
        verbs: "動詞",
        prepositions: "前置詞",
        possessives: "所有格",
    },
    ["zh-CN"]: {
        pronouns: "代词",
        adjectives: "形容词",
        articles: "冠词",
        adverbs: "adverbs",
        conjunctions: "conjunctions",
        verbs: "动词",
        prepositions: "介词",
        possessives: "所有格",
    },
    ["id-ID"]: {
        pronouns: "kata ganti",
        adjectives: "kata sifat",
        articles: "artikel",
        adverbs: "adverbia (Kata keterangan)",
        conjunctions: "konjungsi (Kata hubung)",
        verbs: "kata kerja",
        prepositions: "preposisi",
        possessives: "kata ganti kepemilikan",
    },
}

export interface LanguageGrammar {
    pronouns: string;
    adjectives: string;
    articles: string;
    adverbs: string;
    conjunctions: string;
    verbs: string;
    prepositions: string;
    possessives: string;
}

export const menuItems: {
    id: GrammarCategory;
    label: string;
    emoji: string;
}[] = [
        {
            id: "pronouns",
            label: "Pronouns",
            emoji: "👤",
        },

        {
            id: "adjectives",
            label: "Adjectives",
            emoji: "✨",
        },

        {
            id: "articles",
            label: "Articles",
            emoji: "📄",
        },

        {
            id: "prepositions",
            label: "Prepositions",
            emoji: "🧭",
        },
        {
            id: "conjunctions",
            label: "Conjunctions",
            emoji: "📔",
        },

        {
            id: "adverbs",
            label: "Adverbs",
            emoji: "🚀",
        },
    ];