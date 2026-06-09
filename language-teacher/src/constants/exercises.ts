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


export const fillInTheBlankMap = {
    'en-US': "Fill in the blank",
    'pt-BR': "Preencha a lacuna",
    'es-ES': "Rellena el espacio en blanco",
    'fr-FR': "Remplissez le blanc",
    'cz-CZ': "Vyplňte mezery",
    'de-DE': "Füllen Sie die Lücke",
    'it-IT': "Riempi lo spazio vuoto",
    'id-ID': "Isi bagian yang kosong",
};

export const typeYourAnswerMap = {
    'en-US': "Type your answer...",
    'pt-BR': "Digite sua resposta...",
    'es-ES': "Escribe tu respuesta...",
    'fr-FR': "Tapez votre réponse...",
    'cz-CZ': "Napište svou odpověď...",
    'de-DE': "Geben Sie Ihre Antwort ein...",
    'it-IT': "Digita la tua risposta...",
    'id-ID': "Ketik jawaban Anda..."
};

export const completeTheSentenceMap = {
    'en-US': "Complete the sentence.",
    'pt-BR': "Complete a frase.",
    'es-ES': "Completa la frase.",
    'fr-FR': "Complétez la phrase.",
    'cz-CZ': "Doplňte větu.",
    'de-DE': "Vervollständigen Sie den Satz.",
    'it-IT': "Completa la frase.",
    'id-ID': "Lengkapi kalimat."
};

export const checkAnswerMap = {
    'en-US': "Check Answer",
    'pt-BR': "Verificar Resposta",
    'es-ES': "Verificar Respuesta",
    'fr-FR': "Vérifier la réponse",
    'cz-CZ': "Zkontrolovat odpověď",
    'de-DE': "Antwort überprüfen",
    'it-IT': "Controlla la risposta",
    'id-ID': "Periksa Jawaban"
};

export const correctAnswerMap = {
    'en-US': "Correct answer:",
    'pt-BR': "Resposta correta:",
    'es-ES': "Respuesta correcta:",
    'fr-FR': "Réponse correcte:",
    'cz-CZ': "Správná odpověď:",
    'de-DE': "Richtige Antwort:",
    'it-IT': "Risposta corretta:",
    'id-ID': "Jawaban benar:"
};

export const hintMap = {
    'en-US': "Hint",
    'pt-BR': "Dica",
    'es-ES': "Pista",
    'fr-FR': "Indice",
    'cz-CZ': "Nápověda",
    'de-DE': "Hinweis",
    'it-IT': "Suggerimento",
    'id-ID': "Petunjuk"
};