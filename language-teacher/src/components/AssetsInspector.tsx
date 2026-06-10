import { useState } from "react";
import { useAppContext } from "../Context";

type AssetItem = {
  id: string;
  word: string;
};

export function AssetsInspector() {
  const { userLanguage, targetLanguage, origin, translations } = useAppContext();
  console.log(JSON.stringify({ userLanguage, targetLanguage, origin, translations }))
  // Convert origin and translations into arrays of AssetItem
  const originAssets: AssetItem[] = Object.entries(origin).map(([id, word]) => ({
    id,
    word,
  }));

  const targetAssets: AssetItem[] = Object.entries(translations).map(([id, word]) => ({
    id,
    word,
  }));

  const targetIds = new Set(targetAssets.map((item) => item.id));

  const missingAssets = originAssets.filter((item) => !targetIds.has(item.id));

  // State to store user inputs for missing translations
  const [editedTranslations, setEditedTranslations] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, value: string) => {
    setEditedTranslations((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    const updatedTranslations = { ...translations };

    // Add the new translations to the existing translations
    Object.entries(editedTranslations).forEach(([id, word]) => {
      updatedTranslations[id] = word;
    });

    // Simulate saving the updated translations (you can replace this with an API call or other logic)
    console.log("Updated Translations JSON:", updatedTranslations);

    alert("Translations saved successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border bg-white p-8 shadow-xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Missing Language Assets</h2>

        <p className="text-gray-600 mt-2">
          Detect concepts that exist in <strong>{userLanguage}</strong> but are missing in{" "}
          <strong>{targetLanguage}</strong>.
        </p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-5">
        <div className="text-lg font-semibold">Missing Entries:</div>

        <div className="text-4xl font-black mt-2">{missingAssets.length}</div>
      </div>

      <div className="space-y-3">
        {missingAssets.length === 0 ? (
          <div className="rounded-2xl border border-green-300 bg-green-50 p-5 text-green-800 font-medium">
            All assets are synchronized 🎉
          </div>
        ) : (
          missingAssets.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-red-300 bg-red-50 p-5 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-lg">{item.word}</div>
                <div className="text-sm text-gray-600">ID: {item.id}</div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Enter translation"
                  value={editedTranslations[item.id] || ""}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  className="border rounded-lg px-3 py-2 w-64"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {missingAssets.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Save Translations
          </button>
        </div>
      )}
    </div>
  );
}