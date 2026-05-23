import React from "react";
import { useAppContext } from "../../Context";

type VocabularyCategory =
  | "food"
  | "travel"
  | "emotions"
  | "business"
  | "surfing";

const MENU_ITEMS: {
  id: VocabularyCategory;
  label: string;
  emoji: string;
}[] = [
    {
      id: "food",
      label: "Food",
      emoji: "🍞",
    },

    {
      id: "travel",
      label: "Travel",
      emoji: "✈️",
    },

    {
      id: "emotions",
      label: "Emotions",
      emoji: "❤️",
    },

    {
      id: "business",
      label: "Business",
      emoji: "💼",
    },

    {
      id: "surfing",
      label: "Surfing",
      emoji: "🏄",
    },
  ];

export default function VocabularyScreen() {
  const { userLanguage: originLanguage, targetLanguage, translations: {
    food,
    travel,
    surfing,
    emotions,
    business,
  } } = useAppContext();
  const [
    selectedCategory,
    setSelectedCategory,
  ] = React.useState<VocabularyCategory>(
    "food"
  );

  const getCurrentData = () => {
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

  const current = getCurrentData();

  const targetMap = new Map(
    current.data?.target.map((item) => [
      item.id,
      item.word,
    ])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-10">
          <div className="text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold mb-4">
            Vocabulary
          </div>

          <h1 className="text-6xl font-black tracking-tight">
            Expand Vocabulary
          </h1>

          <p className="text-xl text-gray-600 mt-5 max-w-3xl">
            Explore useful words and expressions
            grouped by real-world topics and
            situations.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
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

        <div className="mb-8">
          <h2 className="text-4xl font-black">
            {current.title}
          </h2>

          <p className="text-gray-600 text-lg mt-3">
            {current.description}
          </p>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl">
          <div className="grid grid-cols-2 bg-black text-white">
            <div className="p-6 text-2xl font-bold border-r border-white/10">
              {originLanguage}
            </div>

            <div className="p-6 text-2xl font-bold">
              {targetLanguage}
            </div>
          </div>

          <div>
            {current.data.origin.map(
              (originWord, index) => {
                const targetWord =
                  targetMap.get(
                    originWord.id
                  ) ?? "—";

                return (
                  <div
                    key={originWord.id}
                    className={`grid grid-cols-2 items-center ${index !==
                        current.data.origin.length -
                        1
                        ? "border-b border-gray-100"
                        : ""
                      }`}
                  >
                    <div className="p-6 border-r border-gray-100">
                      <div className="text-3xl font-bold">
                        {originWord.word}
                      </div>

                      <div className="text-sm text-gray-400 mt-1">
                        {originWord.id}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-3xl font-bold text-gray-700">
                        {targetWord as string}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
