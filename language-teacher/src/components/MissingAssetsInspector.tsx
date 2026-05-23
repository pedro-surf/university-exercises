type AssetItem = {
  id: string;
  word: string;
};

type MissingAssetsInspectorProps = {
  originLanguage: string;
  targetLanguage: string;

  originAssets: AssetItem[];
  targetAssets: AssetItem[];
};

export function MissingAssetsInspector({
  originLanguage,
  targetLanguage,
  originAssets,
  targetAssets,
}: MissingAssetsInspectorProps) {
  const targetIds = new Set(
    targetAssets.map((item) => item.id)
  );

  const missingAssets = originAssets.filter(
    (item) => !targetIds.has(item.id)
  );

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border bg-white p-8 shadow-xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold">
          Missing Language Assets
        </h2>

        <p className="text-gray-600 mt-2">
          Detect concepts that exist in{" "}
          <strong>{originLanguage}</strong> but
          are missing in{" "}
          <strong>{targetLanguage}</strong>.
        </p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-5">
        <div className="text-lg font-semibold">
          Missing Entries:
        </div>

        <div className="text-4xl font-black mt-2">
          {missingAssets.length}
        </div>
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
                <div className="font-bold text-lg">
                  {item.word}
                </div>

                <div className="text-sm text-gray-600">
                  ID: {item.id}
                </div>
              </div>

              <div className="text-red-700 font-semibold">
                Missing
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
