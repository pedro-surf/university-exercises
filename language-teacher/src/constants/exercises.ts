import type { GrammarCategory } from "./grammar";
import type { VocabularyCategory } from "./vocabulary";

export type Exercise = {
    id: string;
    identifier: string;
    language: string;
    category: string;
    topic: GrammarCategory & VocabularyCategory;
    difficulty: string;
    sentence: string;
    solution: string | null;
    hint?: string;
    options?: string[];
};

export const BLANK_WORD_SPACE = "____"

