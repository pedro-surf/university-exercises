import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context";
import {
  IconSelector,
  type IconSelection,
  type IconType,
} from "./IconSelector";
import {
  fetchAssets,
  fetchMissingAssets,
  fetchMissingExercises,
  saveAssetTranslations,
  saveExerciseTranslations,
  updateAssetIcon,
  type AssetListItem,
  type MissingAsset,
  type MissingExercise,
} from "../utils/api";

type ContentKind = "vocabulary" | "exercises" | "icons";

type ExerciseDraft = {
  sentence: string;
  solution: string;
  hint: string;
};

export function AssetsInspector() {
  const navigate = useNavigate();
  const { userLanguage, targetLanguage, userId } = useAppContext();

  const [kind, setKind] = useState<ContentKind>("vocabulary");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [assets, setAssets] = useState<MissingAsset[]>([]);
  const [iconAssets, setIconAssets] = useState<AssetListItem[]>([]);
  const [exercises, setExercises] = useState<MissingExercise[]>([]);
  const [wordDrafts, setWordDrafts] = useState<Record<string, string>>({});
  const [exerciseDrafts, setExerciseDrafts] = useState<
    Record<string, ExerciseDraft>
  >({});
  const [savingIconId, setSavingIconId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (kind !== "icons" && (!userLanguage || !targetLanguage)) {
      setError("Set origin and target languages in onboarding first.");
      return;
    }

    if (kind === "icons" && !userLanguage) {
      setError("Set an origin language in onboarding first.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (kind === "vocabulary") {
        const result = await fetchMissingAssets({
          referenceLanguage: userLanguage,
          targetLanguage,
        });
        setAssets(result.data);
        setWordDrafts(
          Object.fromEntries(
            result.data
              .filter((item) => item.pendingWord)
              .map((item) => [item.identifier, item.pendingWord!])
          )
        );
      } else if (kind === "exercises") {
        const result = await fetchMissingExercises({
          referenceLanguage: userLanguage,
          targetLanguage,
        });
        setExercises(result.data);
        setExerciseDrafts(
          Object.fromEntries(
            result.data.map((item) => [
              item.identifier,
              {
                sentence: item.pending?.sentence ?? "",
                solution: item.pending?.solution ?? "",
                hint: item.pending?.hint ?? "",
              },
            ])
          )
        );
      } else {
        const result = await fetchAssets({
          type: "VOCABULARY",
          language: userLanguage,
        });
        setIconAssets(result.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load data from the backend.");
    } finally {
      setLoading(false);
    }
  }, [kind, targetLanguage, userLanguage]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const values =
      kind === "vocabulary"
        ? assets.map((item) => item.category)
        : kind === "exercises"
          ? exercises.map((item) => item.category)
          : iconAssets.map((item) => item.category);
    return ["all", ...Array.from(new Set(values)).sort()];
  }, [assets, exercises, iconAssets, kind]);

  const filteredAssets = useMemo(
    () =>
      selectedCategory === "all"
        ? assets
        : assets.filter((item) => item.category === selectedCategory),
    [assets, selectedCategory]
  );

  const filteredExercises = useMemo(
    () =>
      selectedCategory === "all"
        ? exercises
        : exercises.filter((item) => item.category === selectedCategory),
    [exercises, selectedCategory]
  );

  const filteredIconAssets = useMemo(
    () =>
      selectedCategory === "all"
        ? iconAssets
        : iconAssets.filter((item) => item.category === selectedCategory),
    [iconAssets, selectedCategory]
  );

  const saveVocabulary = async () => {
    const items = filteredAssets
      .map((item) => ({
        identifier: item.identifier,
        category: item.category,
        language: targetLanguage,
        word: (wordDrafts[item.identifier] || "").trim(),
      }))
      .filter((item) => item.word);

    if (items.length === 0) {
      setError("Enter at least one translation before saving.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await saveAssetTranslations({
        userId: userId || undefined,
        items,
      });
      setMessage(`${result.count} translation(s) saved for admin review.`);
      await load();
    } catch (err) {
      console.error(err);
      setError("Failed to save translations.");
    } finally {
      setSaving(false);
    }
  };

  const saveExercises = async () => {
    const items = filteredExercises
      .map((item) => {
        const draft = exerciseDrafts[item.identifier];
        return {
          identifier: item.identifier,
          language: targetLanguage,
          category: item.category,
          topic: item.topic,
          difficulty: item.difficulty,
          sentence: draft?.sentence?.trim() || "",
          solution: draft?.solution?.trim() || "",
          hint: draft?.hint?.trim() || "",
        };
      })
      .filter((item) => item.sentence && item.solution);

    if (items.length === 0) {
      setError("Fill sentence and solution for at least one exercise.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await saveExerciseTranslations({
        userId: userId || undefined,
        items,
      });
      setMessage(`${result.count} exercise(s) saved for admin review.`);
      await load();
    } catch (err) {
      console.error(err);
      setError("Failed to save exercises.");
    } finally {
      setSaving(false);
    }
  };

  const handleIconChange = async (
    assetId: string,
    selection: IconSelection
  ) => {
    setSavingIconId(assetId);
    setError(null);
    try {
      const result = await updateAssetIcon(assetId, {
        icon: selection.icon,
        iconType: selection.iconType,
        userId: userId || undefined,
      });
      setIconAssets((prev) =>
        prev.map((item) =>
          item.id === assetId
            ? {
                ...item,
                icon: result.data.icon,
                iconType: result.data.iconType as IconType | null,
              }
            : item
        )
      );
      setMessage(`Icon saved for asset.`);
    } catch (err) {
      console.error(err);
      setError("Failed to save icon.");
    } finally {
      setSavingIconId(null);
    }
  };

  const subtitle =
    kind === "icons"
      ? `Assign icons to vocabulary (${userLanguage || "?"})`
      : `Fill missing ${kind} from ${userLanguage || "?"} → ${targetLanguage || "?"}`;

  const listCount =
    kind === "vocabulary"
      ? filteredAssets.length
      : kind === "exercises"
        ? filteredExercises.length
        : filteredIconAssets.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="mt-2 text-4xl font-black">Content Inspector</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["vocabulary", "Vocabulary"],
                ["exercises", "Exercises"],
                ["icons", "Icons"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedCategory("all");
                  setKind(id);
                }}
                className={`rounded-xl px-4 py-2 font-semibold ${
                  kind === id ? "bg-black text-white" : "bg-white border"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate("/admin")}
              className="rounded-xl border bg-white px-4 py-2 font-semibold"
            >
              Admin
            </button>
          </div>
        </div>

        {(error || message) && (
          <div
            className={`rounded-2xl border px-4 py-3 ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="flex gap-6">
          <aside className="w-56 shrink-0 space-y-2 rounded-2xl border bg-white p-4">
            <h2 className="mb-2 font-bold">Categories</h2>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full rounded-xl border px-3 py-2 text-left capitalize ${
                  selectedCategory === category
                    ? "border-blue-400 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                {category.toLowerCase()}
              </button>
            ))}
          </aside>

          <section className="flex-1 rounded-3xl border bg-white p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold capitalize">
                {kind === "icons" ? "Vocabulary icons" : "Missing"} ({listCount}
                )
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={load}
                  disabled={loading}
                  className="rounded-xl border px-4 py-2"
                >
                  Refresh
                </button>
                {kind !== "icons" && (
                  <button
                    onClick={
                      kind === "vocabulary" ? saveVocabulary : saveExercises
                    }
                    disabled={saving || loading}
                    className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save to DB"}
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading…</p>
            ) : kind === "vocabulary" ? (
              filteredAssets.length === 0 ? (
                <p className="text-green-600">
                  Nothing missing for this selection.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredAssets.map((item) => (
                    <div
                      key={`${item.category}:${item.identifier}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
                    >
                      <div>
                        <div className="font-bold">
                          {item.icon ? `${item.icon} ` : ""}
                          {item.referenceWord}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.identifier} · {item.category.toLowerCase()}
                          {item.pendingWord ? " · pending review" : ""}
                        </div>
                      </div>
                      <input
                        value={wordDrafts[item.identifier] || ""}
                        onChange={(e) =>
                          setWordDrafts((prev) => ({
                            ...prev,
                            [item.identifier]: e.target.value,
                          }))
                        }
                        placeholder={`Translation in ${targetLanguage}`}
                        className="w-full max-w-md rounded-lg border px-3 py-2 md:w-80"
                      />
                    </div>
                  ))}
                </div>
              )
            ) : kind === "exercises" ? (
              filteredExercises.length === 0 ? (
                <p className="text-green-600">
                  Nothing missing for this selection.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredExercises.map((item) => {
                    const draft = exerciseDrafts[item.identifier] || {
                      sentence: "",
                      solution: "",
                      hint: "",
                    };

                    return (
                      <div
                        key={item.identifier}
                        className="space-y-3 rounded-2xl border p-4"
                      >
                        <div>
                          <div className="font-bold">{item.identifier}</div>
                          <div className="text-sm text-gray-500">
                            {item.category} · {item.topic} · {item.difficulty}
                            {item.pending ? " · pending review" : ""}
                          </div>
                          <div className="mt-2 rounded-xl bg-gray-50 p-3 text-sm">
                            <div>
                              <span className="font-semibold">
                                Ref sentence:
                              </span>{" "}
                              {item.reference.sentence}
                            </div>
                            <div>
                              <span className="font-semibold">
                                Ref solution:
                              </span>{" "}
                              {item.reference.solution}
                            </div>
                          </div>
                        </div>

                        <input
                          value={draft.sentence}
                          onChange={(e) =>
                            setExerciseDrafts((prev) => ({
                              ...prev,
                              [item.identifier]: {
                                ...draft,
                                sentence: e.target.value,
                              },
                            }))
                          }
                          placeholder="Sentence"
                          className="w-full rounded-lg border px-3 py-2"
                        />
                        <input
                          value={draft.solution}
                          onChange={(e) =>
                            setExerciseDrafts((prev) => ({
                              ...prev,
                              [item.identifier]: {
                                ...draft,
                                solution: e.target.value,
                              },
                            }))
                          }
                          placeholder="Solution"
                          className="w-full rounded-lg border px-3 py-2"
                        />
                        <input
                          value={draft.hint}
                          onChange={(e) =>
                            setExerciseDrafts((prev) => ({
                              ...prev,
                              [item.identifier]: {
                                ...draft,
                                hint: e.target.value,
                              },
                            }))
                          }
                          placeholder="Hint (optional)"
                          className="w-full rounded-lg border px-3 py-2"
                        />
                      </div>
                    );
                  })}
                </div>
              )
            ) : filteredIconAssets.length === 0 ? (
              <p className="text-gray-500">No vocabulary assets found.</p>
            ) : (
              <div className="space-y-4">
                {filteredIconAssets.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-2xl border p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-bold">
                          {item.word || item.identifier}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.identifier} · {item.category.toLowerCase()}
                          {savingIconId === item.id ? " · saving…" : ""}
                        </div>
                      </div>
                    </div>

                    <IconSelector
                      compact
                      label={`Icon for ${item.identifier}`}
                      value={{
                        icon: item.icon,
                        iconType: item.iconType,
                      }}
                      onChange={(selection) =>
                        handleIconChange(item.id, selection)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AssetsInspector;
