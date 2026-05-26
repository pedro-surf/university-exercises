import React from "react";
import { useAppContext } from "../../Context";
import Table from "../Grammar/Table";
import { useNavigate } from "react-router-dom";
import { type VocabularyCategory, menuItems } from "../../constants/vocabulary";


export default function VocabularyScreen() {
  const navigate = useNavigate();
  const { userLanguage: originLanguage, targetLanguage, translations: {
    food,
    travel,
    surfing,
    emotions,
    business,
  }, origin } = useAppContext();
  const [
    selectedCategory,
    setSelectedCategory,
  ] = React.useState<VocabularyCategory>(
    "food"
  );

  const getTranslationData = () => {
    switch (selectedCategory) {
      case "food":
        return {
          title: "Food",
          description:
            "Learn food and restaurant vocabulary.",
          data: food,
        };

      case "travel":
        return {
          title: "Travel",
          description:
            "Useful words for trips and transportation.",
          data: travel,
        };

      case "emotions":
        return {
          title: "Emotions",
          description:
            "Express feelings and emotional states.",
          data: emotions,
        };

      case "business":
        return {
          title: "Business",
          description:
            "Professional and workplace vocabulary.",
          data: business,
        };

      case "surfing":
        return {
          title: "Surfing",
          description:
            "Ocean, surfing, and beach culture words.",
          data: surfing,
        };

      default:
        return {
          title: "Food",
          description:
            "Learn food vocabulary.",
          data: food,
        };
    }
  };

  const getOriginData = () => {
    switch (selectedCategory) {
      case "food":
        return {
          title: "Food",
          description:
            "Learn food and restaurant vocabulary.",
          data: origin?.food,
        };

      case "travel":
        return {
          title: "Travel",
          description:
            "Useful words for trips and transportation.",
          data: origin?.travel,
        };

      case "emotions":
        return {
          title: "Emotions",
          description:
            "Express feelings and emotional states.",
          data: origin?.emotions,
        };

      case "business":
        return {
          title: "Business",
          description:
            "Professional and workplace vocabulary.",
          data: origin?.business,
        };

      case "surfing":
        return {
          title: "Surfing",
          description:
            "Ocean, surfing, and beach culture words.",
          data: origin?.surfing,
        };

      default:
        return {
          title: "Food",
          description:
            "Learn food vocabulary.",
          data: origin?.food,
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
            Vocabulary
          </div>

          <h1 className="text-6xl font-black tracking-tight">
            Expand Vocabulary
          </h1>

          <p className="text-xl w-full text-center text-gray-600 mt-5">
            Explore useful words and expressions
            grouped by real-world topics and
            situations.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 mb-10">
          {menuItems.map((item) => {
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

        <div className="mb-8">
          <h2 className="text-4xl font-black">
            {translations.title}
          </h2>

          <p className="text-gray-600 text-lg mt-3">
            {translations.description}
          </p>
        </div>

        <Table
          targetTitle={translations.title}
          originTitle={translations.title}
          originLanguageLabel={originLanguage}
          targetLanguageLabel={targetLanguage}
          originPronouns={natives.data}
          targetPronouns={translations.data}
        />
      </div>
    </div>
  );
}
