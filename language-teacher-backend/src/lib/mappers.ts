import type {
  AssetCategory,
  Category,
  Language,
} from "../../generated/prisma/client";

const LANGUAGE_BY_CODE: Record<string, Language> = {
  "en-US": "EN",
  "es-ES": "ES",
  "fr-FR": "FR",
  "de-DE": "DE",
  "pt-BR": "PT",
  "cs-CZ": "CZ",
  "nl-NL": "NL",
  "it-IT": "IT",
  "id-ID": "ID",
  "ja-JP": "JA",
  EN: "EN",
  ES: "ES",
  FR: "FR",
  DE: "DE",
  PT: "PT",
  CZ: "CZ",
  NL: "NL",
  IT: "IT",
  ID: "ID",
  JA: "JA",
};

const CODE_BY_LANGUAGE: Record<Language, string> = {
  EN: "en-US",
  ES: "es-ES",
  FR: "fr-FR",
  DE: "de-DE",
  PT: "pt-BR",
  CZ: "cs-CZ",
  NL: "nl-NL",
  IT: "it-IT",
  ID: "id-ID",
  JA: "ja-JP",
};

const ASSET_CATEGORY_BY_NAME: Record<string, AssetCategory> = {
  food: "FOOD",
  travel: "TRAVEL",
  emotions: "EMOTIONS",
  business: "BUSINESS",
  surfing: "SURFING",
  pronouns: "PRONOUNS",
  adjectives: "ADJECTIVES",
  articles: "ARTICLES",
  adverbs: "ADVERBS",
  conjunctions: "CONJUNCTIONS",
  verbs: "VERBS",
  prepositions: "PREPOSITIONS",
  possessives: "POSSESSIVES",
  FOOD: "FOOD",
  TRAVEL: "TRAVEL",
  EMOTIONS: "EMOTIONS",
  BUSINESS: "BUSINESS",
  SURFING: "SURFING",
  PRONOUNS: "PRONOUNS",
  ADJECTIVES: "ADJECTIVES",
  ARTICLES: "ARTICLES",
  ADVERBS: "ADVERBS",
  CONJUNCTIONS: "CONJUNCTIONS",
  VERBS: "VERBS",
  PREPOSITIONS: "PREPOSITIONS",
  POSSESSIVES: "POSSESSIVES",
};

const CATEGORY_BY_NAME: Record<string, Category> = {
  vocabulary: "VOCABULARY",
  grammar: "GRAMMAR",
  listening: "LISTENING",
  reading: "READING",
  VOCABULARY: "VOCABULARY",
  GRAMMAR: "GRAMMAR",
  LISTENING: "LISTENING",
  READING: "READING",
};

export function parseLanguage(value: unknown): Language | null {
  if (typeof value !== "string") return null;
  return LANGUAGE_BY_CODE[value] ?? LANGUAGE_BY_CODE[value.toUpperCase()] ?? null;
}

export function languageToCode(language: Language): string {
  return CODE_BY_LANGUAGE[language];
}

export function parseAssetCategory(value: unknown): AssetCategory | null {
  if (typeof value !== "string") return null;
  return (
    ASSET_CATEGORY_BY_NAME[value] ??
    ASSET_CATEGORY_BY_NAME[value.toLowerCase()] ??
    ASSET_CATEGORY_BY_NAME[value.toUpperCase()] ??
    null
  );
}

export function parseCategory(value: unknown): Category | null {
  if (typeof value !== "string") return null;
  return (
    CATEGORY_BY_NAME[value] ??
    CATEGORY_BY_NAME[value.toLowerCase()] ??
    CATEGORY_BY_NAME[value.toUpperCase()] ??
    null
  );
}

export { LANGUAGE_BY_CODE, ASSET_CATEGORY_BY_NAME };
