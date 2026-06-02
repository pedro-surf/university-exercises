import type { GrammarCategory } from "./grammar";
import type { VocabularyCategory } from "./vocabulary";

export type ExerciseType

export type Exercise = {
    id: string;
    type: ExerciseType;
    topic: GrammarCategory & VocabularyCategory;
   // translations
    [lang: string]: {
            sentence: string;
            solution: string;
            hint: string;
    }
}