import type { SupportedLanguage } from "../constants/languages";

/** Backend Language enum ↔ frontend BCP-47 codes */
export const LANGUAGE_TO_BACKEND: Record<SupportedLanguage, string> = {
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
};

export const BACKEND_TO_LANGUAGE: Record<string, SupportedLanguage> = {
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

export function toBackendLanguage(code: string): string {
  return LANGUAGE_TO_BACKEND[code as SupportedLanguage] ?? code.toUpperCase();
}
