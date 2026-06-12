// src/types/global.d.ts

// NOTA: Não coloque nenhum "export" ou "import" neste arquivo!
// Deixe as interfaces soltas dentro do declare global.

declare global {
  interface TranslationPair {
    sourceLanguage: string;
    targetLanguage: string;
  }

  interface Translator {
    translate(text: string): Promise<string>;
    destroy(): void;
  }

  interface TranslationAPI {
    canTranslate(pair: TranslationPair): Promise<'no' | 'readily' | 'after-download'>;
    create(pair: TranslationPair): Promise<Translator>;
  }

  interface Window {
    translation?: TranslationAPI;
  }

  interface WorkerGlobalScope {
    translation?: TranslationAPI;
  }

  type TranslationCategory =
  | 'pronouns' | 'adjectives' | 'articles' | 'adverbs'
  | 'conjunctions' | 'verbs' | 'prepositions' | 'possessives'
  | 'food' | 'emotions' | 'business' | 'travel' | 'surfing';

// 2. O TypeScript gera o objeto inteiro para você de forma limpa!
type Translation = Record<TranslationCategory, AssetItem[] | null | undefined> | null;

  interface AssetItem {
    id: string;
    word: string;
  };

}

// Isso aqui em baixo é um truque para forçar o TS a entender este arquivo como global, 
// caso você esteja usando um ambiente com módulos (como Vite/Next.js)
export { };