import React from "react";
import PronounsTable from "./Pronouns";
import { useAppContext } from "../../Context";

type GrammarCategory =
    | "pronouns"
    | "adjectives"
    | "articles"
    | "prepositions";

// type WordItem = {
//     id: string;
//     word: string;
// };

// type GrammarScreenProps = {
//     originLanguageLabel: string;
//     targetLanguageLabel: string;

//     pronouns: {
//         origin: WordItem[];
//         target: WordItem[];
//     };

//     adjectives: {
//         origin: WordItem[];
//         target: WordItem[];
//     };

//     articles: {
//         origin: WordItem[];
//         target: WordItem[];
//     };

//     prepositions: {
//         origin: WordItem[];
//         target: WordItem[];
//     };
// };

const MENU_ITEMS: {
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

export default function GrammarScreen() {
    const { userLanguage: originLanguage, targetLanguage, translations: {
        pronouns,
        adjectives,
        articles,
        prepositions,
    } } = useAppContext();

    const [selectedCategory, setSelectedCategory] =
        React.useState<GrammarCategory>(
            "pronouns"
        );

    const getCurrentData = () => {
        switch (selectedCategory) {
            case "pronouns":
                return {
                    title: "Pronouns",
                    data: pronouns,
                };

            case "adjectives":
                return {
                    title: "Adjectives",
                    data: adjectives,
                };

            case "articles":
                return {
                    title: "Articles",
                    data: articles,
                };

            case "prepositions":
                return {
                    title: "Prepositions",
                    data: prepositions,
                };

            default:
                return {
                    title: "Pronouns",
                    data: pronouns,
                };
        }
    };

    const current = getCurrentData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
            <div className="max-w-7xl mx-auto p-6 md:p-10">
                <div className="mb-10">
                    <div className="text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold mb-4">
                        Grammar
                    </div>
                    <p className="text-sm w-full text-center text-gray-600 mt-5">
                        Compare grammatical structures
                        between languages and understand
                        how meaning is constructed.
                    </p>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-10">
                    {MENU_ITEMS.map((item) => {
                        const isSelected =
                            selectedCategory === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() =>
                                    setSelectedCategory(item.id)
                                }
                                className={`rounded-2xl px-6 py-4 text-lg font-semibold transition-all ${isSelected
                                    ? "bg-black text-white shadow-xl"
                                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                <span className="mr-3">
                                    {item.emoji}
                                </span>

                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <PronounsTable
                    title={current.title}
                    originLanguageLabel={
                        originLanguage
                    }
                    targetLanguageLabel={
                        targetLanguage
                    }
                    originPronouns={[{ id: "i", word: "I" }, { id: "you", word: "You" }, { id: "he", word: "He" }, { id: "she", word: "She" },]} 
                    targetPronouns={[{ id: "i", word: "Eu" }, { id: "you", word: "Você" }, { id: "he", word: "Ele" }, { id: "she", word: "Ela" },]}
                />
            </div>
        </div>
    );
}
