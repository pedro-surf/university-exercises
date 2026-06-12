import { grammarMap } from "./grammar";
import { vocabularyMap } from "./vocabulary";

export const grammarTitleMap = {
    "en-US": "Grammar",
    "pt-BR": "Gramática",
    "es-ES": "Gramática",
    "fr-FR": "Grammaire",
    "cs-CZ": "Gramatika",
    "de-DE": "Grammatik",
    "it-IT": "Grammatica",
    "id-ID": "Tata Bahasa",
    "nl-NL": "Grammatica",
    "ja-JP": "文法"
};

export const vocabularyTitleMap = {
    "en-US": "Vocabulary",
    "pt-BR": "Vocabulário",
    "es-ES": "Vocabulario",
    "fr-FR": "Vocabulaire",
    "cs-CZ": "Slovní zásoba",
    "de-DE": "Wortschatz",
    "it-IT": "Vocabolario",
    "id-ID": "Kosakata",
    "nl-NL": "Woordenschat",
    "ja-JP": "単語"
};

export const exercisesTitleMap = {
    "en-US": "Exercises",
    "pt-BR": "Exercícios",
    "es-ES": "Ejercicios",
    "fr-FR": "Exercices",
    "cs-CZ": "Cvičení",
    "de-DE": "Übungen",
    "it-IT": "Esercizi",
    "id-ID": "Latihan",
    "nl-NL": "Oefeningen",
    "ja-JP": "練習問題"
};

export const grammarDescriptionMap = {
    "en-US": "Learn sentence structure, verb conjugation, pronouns, and the foundations of the language.",
    "pt-BR": "Aprenda estrutura de frases, conjugação de verbos, pronomes e os fundamentos da língua.",
    "es-ES": "Aprende la estructura de las oraciones, conjugación de verbos, pronombres y los fundamentos del idioma.",
    "fr-FR": "Apprenez la structure des phrases, la conjugaison des verbes, les pronoms et les bases de la langue.",
    "cs-CZ": "Naučte se strukturu vět, časování sloves, zájmena a základy jazyka.",
    "de-DE": "Lernen Sie Satzstruktur, Verbkonjugation, Pronomen und die Grundlagen der Sprache.",
    "it-IT": "Impara la struttura delle frasi, la coniugazione dei verbi, i pronomi e le basi della lingua.",
    "id-ID": "Pelajari struktur kalimat, konjugasi kata kerja, kata ganti, dan dasar-dasar bahasa.",
    "nl-NL": "Leer zinsbouw, werkwoordvervoeging, voornaamwoorden en de basis doelen van de taal.",
    "ja-JP": "文章の構造、動詞の活用、代名詞、そして言語の基礎を学びます。"
};

export const vocabularyDescriptionMap = {
    "en-US": "Expand your vocabulary with useful words and real-world categories.",
    "pt-BR": "Expanda seu vocabulário com palavras úteis e categorias do mundo real.",
    "es-ES": "Expande tu vocabulario con palabras útiles y categorías del mundo real.",
    "fr-FR": "Élargissez votre vocabulaire avec des mots utiles et des catégories du monde réel.",
    "cs-CZ": "Rozšiřte svou slovní zásobu o užitečná slova a kategorie ze skutečného světa.",
    "de-DE": "Erweitern Sie Ihren Wortschatz mit nützlichen Wörtern und realen Kategorien.",
    "it-IT": "Espandi il tuo vocabolario con parole utili e categorie del mondo reale.",
    "id-ID": "Perluas kosakata Anda dengan kata-kata yang berguna dan kategori dunia nyata.",
    "nl-NL": "Breid je woordenschat uit met nuttige woorden en alledaagse categorieën.",
    "ja-JP": "実用的な単語や日常生活のカテゴリーで語彙力を広げましょう。"
};

export const exercisesDescriptionMap = {
    "en-US": "Practice actively with fill-in-the-blank, listening, pronunciation, and matching exercises.",
    "pt-BR": "Pratique ativamente com exercícios de preenchimento, audição, pronúncia e correspondência.",
    "es-ES": "Practica activamente con ejercicios de llenar el espacio en blanco, escucha, pronunciación y emparejamiento.",
    "fr-FR": "Pratiquez activement avec des exercices de remplissage, d'écoute, de prononciation et d'association.",
    "cs-CZ": "Procvičujte aktivně s cvičeními na doplňování, poslech, výslovnost a párování.",
    "de-DE": "Üben Sie aktiv mit Lückentexten, Hörverständnis, Aussprache und Zuordnungsübungen.",
    "it-IT": "Pratica attivamente con esercizi di completamento, ascolto, pronuncia e abbinamento.",
    "id-ID": "Berlatih secara aktif dengan latihan mengisi tempat kosong, mendengarkan, pengucapan, dan mencocokkan.",
    "nl-NL": "Oefen actief met invuloefeningen, luisteren, uitspraak en het combineren de juiste woorden.",
    "ja-JP": "穴埋め問題、リスニング、発音、マッチングクイズなどで能動的に練習しましょう。"
};

export const APP_MENU_OPTIONS = [
    {
        id: "grammar",
        title: grammarTitleMap,
        emoji: "📚",
        description:
            grammarDescriptionMap,
        items: grammarMap,
        examples: []
    },

    {
        id: "vocabulary",
        title: vocabularyTitleMap,
        emoji: "🧠",
        description:
            vocabularyDescriptionMap,
        examples: [],
        items: vocabularyMap,
    },

    {
        id: "exercises",
        title: exercisesTitleMap,
        emoji: "✍️",
        description:
            exercisesDescriptionMap,
        examples: [],
        items: [],
    },
] as const;