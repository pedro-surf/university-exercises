import React from "react";
import { useAppContext } from "../../Context";
import TranslationTable from "../TranslationTable";
import { useNavigate } from "react-router-dom";
import { type MenuItem, menuItems } from "../../constants/vocabulary";
import { goBackMap } from "../../constants/appTranslations";
import { vocabularyDescriptionMap, vocabularyTitleMap } from "../../constants/menu";
import { speakWord } from "../../utils/speakWord";
import { capitalize } from "../../utils/capitalize";


export default function VocabularyScreen() {
  const navigate = useNavigate();
  const { userLanguage: originLanguage, targetLanguage, translations: target, origin } = useAppContext();
  const [
    selectedCategory,
    setSelectedCategory,
  ] = React.useState<MenuItem>(
    menuItems[0]
  );

  const getTranslationData = () => {
    switch (selectedCategory.id) {
      case "food":
        return target?.food;

      case "travel":
        return target?.travel;

      case "emotions":
        return target?.emotions;

      case "business":
        return target?.business;

      case "surfing":
        return target?.surfing;

      default:
        return target?.food;
    }
  };

  const getOriginData = () => {
    switch (selectedCategory.id) {
      case "food":
        return origin?.food;

      case "travel":
        return origin?.travel;

      case "emotions":
        return origin?.emotions;

      case "business":
        return origin?.business;

      case "surfing":
        return origin?.surfing;

      default:
        return origin?.food;
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
            {vocabularyTitleMap[originLanguage]}
          </div>

          <h1 className="text-6xl font-black tracking-tight">
            {vocabularyTitleMap[targetLanguage]}
          </h1>

          <p onClick={() => speakWord(vocabularyDescriptionMap[targetLanguage], targetLanguage)} className="text-xl w-full text-center text-gray-600 mt-5">
            {vocabularyDescriptionMap[targetLanguage]}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 mb-10">
          {menuItems.map((item) => {
            const isSelected =
              selectedCategory.id === item.id;

            return (
              <button
                key={item.id}
                onClick={() => isSelected ? speakWord(item.label, targetLanguage) :
                  setSelectedCategory(item)
                }
                className={`rounded-2xl px-6 py-4 text-lg font-semibold transition-all ${isSelected
                  ? "bg-black text-white shadow-xl"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                  }`}
              >
                <span className="mr-3">
                  {item.emoji}
                </span>

                {capitalize(item.title[originLanguage])}
              </button>
            );
          })}
        </div>

        <div className="md:mb-8 mb-2">
          <h2 className="text-4xl font-black">
            {capitalize(selectedCategory.title[originLanguage])}
          </h2>

          <p className="text-gray-600 text-lg mt-3">
            {selectedCategory.description[originLanguage]}
          </p>
        </div>

        <TranslationTable
          targetTitle={selectedCategory.title[targetLanguage]}
          originTitle={selectedCategory.title[originLanguage]}
          originData={natives!}
          targetData={translations!}
        />
      </div>
    </div>
  );
}
