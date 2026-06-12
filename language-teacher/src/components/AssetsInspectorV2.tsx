import { useMemo, useState } from "react";
import { useAppContext } from "../Context";

type AssetMap = Record<string, AssetItem[]>;

export function AssetsInspector() {
  const {
    userLanguage,
    targetLanguage,
    origin,
    translations,
  } = useAppContext();

  const [selectedCategory, setSelectedCategory] =
    useState<string>("verbs");

  const [editedTranslations, setEditedTranslations] =
    useState<Record<string, string>>({});

  const categories = useMemo(
    () =>
      Array.from(
        new Set([
          ...Object.keys(origin || {}),
          ...Object.keys(translations || {}),
        ])
      ),
    [origin, translations]
  );

  const categoryOrigin: AssetItem[] =
    (origin as AssetMap)?.[selectedCategory] ||
    [];

  const categoryTarget: AssetItem[] =
    (translations as AssetMap)?.[
      selectedCategory
    ] || [];

  const targetMap = new Map(
    categoryTarget.map((item) => [
      item.id,
      item,
    ])
  );

  const originMap = new Map(
    categoryOrigin.map((item) => [
      item.id,
      item,
    ])
  );

  const missingEntries =
    categoryOrigin.filter(
      (item) => !targetMap.has(item.id)
    );

  const extraEntries =
    categoryTarget.filter(
      (item) => !originMap.has(item.id)
    );

  const handleInputChange = (
    id: string,
    value: string
  ) => {
    setEditedTranslations((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const downloadJson = (
    filename: string,
    data: unknown
  ) => {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  const exportCategory = () => {
    const currentTarget =
      categoryTarget.map((item) => ({
        ...item,
      }));

    missingEntries.forEach((entry) => {
      const translation =
        editedTranslations[entry.id];

      if (!translation?.trim()) {
        return;
      }

      currentTarget.push({
        id: entry.id,
        word: translation.trim(),
      });
    });

    downloadJson(
      `${selectedCategory}.json`,
      currentTarget.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
    );
  };

  const exportAll = () => {
    const result: AssetMap = {};

    categories.forEach((category) => {
      const originAssets =
        (origin as AssetMap)?.[
          category
        ] || [];

      const targetAssets =
        (translations as AssetMap)?.[
          category
        ] || [];

      const targetIds = new Set(
        targetAssets.map(
          (item) => item.id
        )
      );

      const merged = [
        ...targetAssets,
        ...originAssets
          .filter(
            (item) =>
              !targetIds.has(item.id)
          )
          .filter(
            (item) =>
              editedTranslations[
                item.id
              ]?.trim()
          )
          .map((item) => ({
            id: item.id,
            word:
              editedTranslations[
                item.id
              ].trim(),
          })),
      ];

      result[category] = merged.sort(
        (a, b) =>
          a.id.localeCompare(b.id)
      );
    });

    downloadJson(
      `${targetLanguage}.json`,
      result
    );
  };

  return (
    <div className="flex gap-6 h-[80vh]">
      <div className="w-64 border rounded-2xl bg-white p-4 overflow-y-auto">
        <h2 className="font-bold text-xl mb-4">
          Categories
        </h2>

        <div className="space-y-2">
          {categories.map((category) => {
            const originAssets =
              (origin as AssetMap)?.[
                category
              ] || [];

            const targetAssets =
              (translations as AssetMap)?.[
                category
              ] || [];

            const targetIds =
              new Set(
                targetAssets.map(
                  (item) => item.id
                )
              );

            const missing =
              originAssets.filter(
                (item) =>
                  !targetIds.has(
                    item.id
                  )
              ).length;

            return (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedCategory ===
                  category
                    ? "bg-blue-100 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold capitalize">
                  {category}
                </div>

                <div className="text-sm text-gray-500">
                  Missing: {missing}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {selectedCategory}
            </h1>

            <div className="text-gray-500">
              {userLanguage} →{" "}
              {targetLanguage}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportCategory}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white"
            >
              Export Category
            </button>

            <button
              onClick={exportAll}
              className="px-4 py-2 rounded-xl bg-green-500 text-white"
            >
              Export All
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Missing Entries (
              {missingEntries.length})
            </h2>

            {missingEntries.length ===
            0 ? (
              <div className="text-green-600">
                Nothing missing 🎉
              </div>
            ) : (
              <div className="space-y-3">
                {missingEntries.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="border rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold">
                          {
                            item.word
                          }
                        </div>

                        <div className="text-sm text-gray-500">
                          {item.id}
                        </div>
                      </div>

                      <input
                        value={
                          editedTranslations[
                            item.id
                          ] || ""
                        }
                        onChange={(
                          e
                        ) =>
                          handleInputChange(
                            item.id,
                            e.target
                              .value
                          )
                        }
                        placeholder="Translation..."
                        className="border rounded-lg px-3 py-2 w-80"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-yellow-600">
              Extra Entries (
              {extraEntries.length})
            </h2>

            {extraEntries.length ===
            0 ? (
              <div>
                No extras found.
              </div>
            ) : (
              <div className="space-y-3">
                {extraEntries.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="border rounded-2xl p-4 bg-yellow-50"
                    >
                      <div className="font-bold">
                        {item.word}
                      </div>

                      <div className="text-sm text-gray-500">
                        {item.id}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Existing Entries (
              {categoryTarget.length}
              )
            </h2>

            <div className="grid md:grid-cols-2 gap-3">
              {categoryTarget.map(
                (item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-3"
                  >
                    <div className="font-medium">
                      {item.word}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.id}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}