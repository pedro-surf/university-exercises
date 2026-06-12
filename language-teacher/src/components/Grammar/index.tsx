import React from "react";
import TranslationTable from "../TranslationTable";
import { useAppContext } from "../../Context";
import { grammarMap, menuItems, type GrammarCategory } from "../../constants/grammar";
import { useNavigate } from "react-router-dom";
import { goBackMap } from "../../constants/appTranslations";
import { grammarDescriptionMap, grammarTitleMap } from "../../constants/menu";
import { capitalize } from "../../utils/capitalize";

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
                    title: grammarMap[targetLanguage].pronouns,
                    data: pronouns,
                };

            case "adjectives":
                return {
                    title: grammarMap[targetLanguage].adjectives,
                    data: adjectives,
                };

            case "articles":
                return {
                    title: grammarMap[targetLanguage].articles,
                    data: articles,
                };

            case "prepositions":
                return {
                    title: grammarMap[targetLanguage].prepositions,
                    data: prepositions,
                };

            case "possessives":
                return {
                    title: grammarMap[targetLanguage].possessives,
                    data: possessives,
                };
            case "verbs":
                return {
                    title: grammarMap[targetLanguage].verbs,
                    data: verbs,
                };

            default:
                return {
                    title: grammarMap[targetLanguage].pronouns,
                    data: pronouns,
                };
        }
    };

    const getOriginData = () => {
        switch (selectedCategory) {
            case "pronouns":
                return {
                    title: grammarMap[originLanguage].pronouns,
                    data: ogPronouns,
                };
            case "adjectives":
                return {
                    title: grammarMap[originLanguage].adjectives,
                    data: ogAdjectives,
                };

            case "articles":
                return {
                    title: grammarMap[originLanguage].articles,
                    data: ogArticles,
                };

            case "prepositions":
                return {
                    title: grammarMap[originLanguage].prepositions,
                    data: ogPrepositions,
                };

            case "possessives":
                return {
                    title: grammarMap[originLanguage].possessives,
                    data: ogPossessives,
                };
            case "verbs":
                return {
                    title: grammarMap[originLanguage].verbs,
                    data: ogVerbs,
                };

            default:
                return {
                    title: grammarMap[originLanguage].pronouns,
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
                {goBackMap[originLanguage]}
            </button>
            <div className="max-w-7xl mx-auto p-2 md:p-10">
                <div className="mb-10">
                    <div className="text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold mb-4">
                        {grammarTitleMap[originLanguage]}
                    </div>
                    <h1 className="text-6xl font-black tracking-tight">
                        {grammarTitleMap[targetLanguage]}
                    </h1>
                    <p className="text-sm w-full text-center text-gray-600 mt-5">
                        {grammarDescriptionMap[originLanguage]}
                    </p>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-10">
                    {menuItems.map((item) => {
                        const isSelected = selectedCategory === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelectedCategory(item.id)}
                                className={`rounded-2xl px-4 py-4 text-lg font-semibold transition-all ${isSelected
                                    ? "bg-black text-white shadow-xl"
                                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                <span className="mr-3">{item.emoji}</span>

                                {capitalize(grammarMap[originLanguage]?.[item.id] ?? item.label)}
                            </button>
                        );
                    })}
                </div>

                <TranslationTable
                    targetTitle={translations.title}
                    originTitle={natives.title}
                    originPronouns={natives.data}
                    targetPronouns={translations.data}
                />
            </div>
        </div>
    );
}
