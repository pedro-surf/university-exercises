export const grammar = {
    ["en-US"]: {
        pronouns: "pronouns",
        adjectives: "adjectives",
        articles: "articles",
        verbs: "verbs",
        prepositions: "prepositions",
        possessives: "possessives",
    },
    ["pt-BR"]: {
        pronouns: "pronomes",
        adjectives: "adjetivos",
        articles: "artigos",
        verbs: "verbos",
        prepositions: "preposições",
        possessives: "possessivos",
    },
    ["es-ES"]: {
        pronouns: "pronombres",
        adjectives: "adjetivos",
        articles: "artículos",
        verbs: "verbos",
        prepositions: "preposiciones",
        possessives: "posesivos",
    },
    ["fr-FR"]: {
        pronouns: "pronoms",
        adjectives: "adjectifs",
        articles: "articles",
        verbs: "verbes",
        prepositions: "prépositions",
        possessives: "possessifs",
    },
    ["cs-CZ"]: {
        pronouns: "zájmena",
        adjectives: "přídavná jména",
        articles: "články",
        verbs: "slovesa",
        prepositions: "předložky",
        possessives: "přivlastňovací zájmena",
    },
    ["de-DE"]: {
        pronouns: "pronomen",
        adjectives: "adjektive",
        articles: "artikel",
        verbs: "verben",
        prepositions: "präpositionen",
        possessives: "besitzanzeigende pronomen",
    },
    ["it-IT"]: {
        pronouns: "pronomi",
        adjectives: "aggettivi",
        articles: "articoli",
        verbs: "verbi",
        prepositions: "preposizioni",
        possessives: "possessivi",
    },
    ["ja-JP"]: {
        pronouns: "代名詞",
        adjectives: "形容詞",
        articles: "冠詞",
        verbs: "動詞",
        prepositions: "前置詞",
        possessives: "所有格",
    },
    ["zh-CN"]: {
        pronouns: "代词",
        adjectives: "形容词",
        articles: "冠词",
        verbs: "动词",
        prepositions: "介词",
        possessives: "所有格",
    },
    ["id-ID"]: {
        pronouns: "kata ganti",
        adjectives: "kata sifat",
        articles: "artikel",
        verbs: "kata kerja",
        prepositions: "preposisi",
        possessives: "kata ganti kepemilikan",
    },
}


export type GrammarCategory =
    | "pronouns"
    | "adjectives"
    | "articles"
    | "prepositions"
    | "possessives"
    | "verbs";

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
    ];