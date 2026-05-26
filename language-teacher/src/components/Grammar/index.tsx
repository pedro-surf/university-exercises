import React from "react";
import Table from "./Table";
import { useAppContext } from "../../Context";
import { grammar, menuItems, type GrammarCategory } from "../../constants/grammar";
import { useNavigate } from "react-router-dom";

export default function GrammarScreen() {
    const navigate = useNavigate();

    const {
        userLanguage: originLanguage,
        targetLanguage,
        origin: {
            pronouns: ogPronouns,
            adjectives: ogAdjectives,
            articles: ogArticles,
            prepositions: ogPrepositions,
            possessives: ogPossessives,
            verbs: ogVerbs,
        },
        translations: {
            pronouns,
            adjectives,
            articles,
            prepositions,
            possessives,
            verbs,
        },
    } = useAppContext();

    const [selectedCategory, setSelectedCategory] =
        React.useState<GrammarCategory>("pronouns");

    const getTranslationData = () => {
        switch (selectedCategory) {
            case "pronouns":
                return {
                    title: grammar[targetLanguage].pronouns,
                    data: pronouns,
                };

            case "adjectives":
                return {
                    title: grammar[targetLanguage].adjectives,
                    data: adjectives,
                };

            case "articles":
                return {
                    title: grammar[targetLanguage].articles,
                    data: articles,
                };

            case "prepositions":
                return {
                    title: grammar[targetLanguage].prepositions,
                    data: prepositions,
                };

            case "possessives":
                return {
                    title: grammar[targetLanguage].possessives,
                    data: possessives,
                };
            case "verbs":
                return {
                    title: grammar[targetLanguage].verbs,
                    data: verbs,
                };

            default:
                return {
                    title: grammar[targetLanguage].pronouns,
                    data: pronouns,
                };
        }
    };

    const getOriginData = () => {
        switch (selectedCategory) {
            case "pronouns":
                return {
                    title: grammar[originLanguage].pronouns,
                    data: ogPronouns,
                };
            case "adjectives":
                return {
                    title: grammar[originLanguage].adjectives,
                    data: ogAdjectives,
                };

            case "articles":
                return {
                    title: grammar[originLanguage].articles,
                    data: ogArticles,
                };

            case "prepositions":
                return {
                    title: grammar[originLanguage].prepositions,
                    data: ogPrepositions,
                };

            case "possessives":
                return {
                    title: grammar[originLanguage].possessives,
                    data: ogPossessives,
                };
            case "verbs":
                return {
                    title: grammar[originLanguage].verbs,
                    data: ogVerbs,
                };

            default:
                return {
                    title: grammar[originLanguage].pronouns,
                    data: ogPronouns,
                };
        }
    };

    const translations = getTranslationData();

    const natives = getOriginData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/')}
            >
                Go back
            </button>
            <div className="max-w-7xl mx-auto p-6 md:p-10">
                <div className="mb-10">
                    <div className="text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold mb-4">
                        Grammar
                    </div>
                    <p className="text-sm w-full text-center text-gray-600 mt-5">
                        Compare grammatical structures between languages and understand how
                        meaning is constructed.
                    </p>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-10">
                    {menuItems.map((item) => {
                        const isSelected = selectedCategory === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelectedCategory(item.id)}
                                className={`rounded-2xl px-6 py-4 text-lg font-semibold transition-all ${isSelected
                                    ? "bg-black text-white shadow-xl"
                                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                <span className="mr-3">{item.emoji}</span>

                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <Table
                    targetTitle={translations.title}
                    originTitle={natives.title}
                    originLanguageLabel={originLanguage}
                    targetLanguageLabel={targetLanguage}
                    originPronouns={natives.data}
                    targetPronouns={translations.data}
                />
            </div>
        </div>
    );
}
