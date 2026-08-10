import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  decideApproval,
  fetchPendingApprovals,
  type PendingExercise,
  type PendingTranslation,
} from "../utils/api";
import { BACKEND_TO_LANGUAGE } from "../utils/languageCodes";
import { useAppContext } from "../Context";

export default function AdminApprovals() {
  const navigate = useNavigate();
  const { userId } = useAppContext();
  const [translations, setTranslations] = useState<PendingTranslation[]>([]);
  const [exercises, setExercises] = useState<PendingExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPendingApprovals("all");
      setTranslations(result.translations.data);
      setExercises(result.exercises.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending approvals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (
    kind: "translation" | "exercise",
    id: string,
    approved: boolean
  ) => {
    setBusyId(id);
    setError(null);
    try {
      await decideApproval({
        kind,
        id,
        approved,
        reviewerId: userId || undefined,
      });
      await load();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${approved ? "approve" : "reject"} item.`);
    } finally {
      setBusyId(null);
    }
  };

  const langLabel = (code: string) =>
    BACKEND_TO_LANGUAGE[code] || code;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="mt-2 text-4xl font-black">Admin Approvals</h1>
            <p className="text-gray-600">
              Review teacher submissions for vocabulary and exercises.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/assets")}
              className="rounded-xl border bg-white px-4 py-2 font-semibold"
            >
              Inspector
            </button>
            <button
              onClick={load}
              disabled={loading}
              className="rounded-xl bg-black px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <>
            <section className="rounded-3xl border bg-white p-6">
              <h2 className="mb-4 text-2xl font-bold">
                Vocabulary ({translations.length})
              </h2>
              {translations.length === 0 ? (
                <p className="text-green-600">No pending translations.</p>
              ) : (
                <div className="space-y-3">
                  {translations.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
                    >
                      <div>
                        <div className="font-bold">{item.word}</div>
                        <div className="text-sm text-gray-500">
                          {item.asset.identifier} ·{" "}
                          {item.asset.category.toLowerCase()} ·{" "}
                          {langLabel(item.language)}
                          {item.updatedBy?.email
                            ? ` · ${item.updatedBy.email}`
                            : ""}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === item.id}
                          onClick={() => decide("translation", item.id, true)}
                          className="rounded-xl bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={busyId === item.id}
                          onClick={() => decide("translation", item.id, false)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border bg-white p-6">
              <h2 className="mb-4 text-2xl font-bold">
                Exercises ({exercises.length})
              </h2>
              {exercises.length === 0 ? (
                <p className="text-green-600">No pending exercises.</p>
              ) : (
                <div className="space-y-3">
                  {exercises.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border p-4"
                    >
                      <div className="max-w-xl space-y-1">
                        <div className="font-bold">{item.identifier}</div>
                        <div className="text-sm text-gray-500">
                          {item.category} · {item.topic} ·{" "}
                          {langLabel(item.language)}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Sentence:</span>{" "}
                          {item.sentence}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Solution:</span>{" "}
                          {item.solution}
                        </div>
                        {item.hint && (
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">Hint:</span>{" "}
                            {item.hint}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === item.id}
                          onClick={() => decide("exercise", item.id, true)}
                          className="rounded-xl bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={busyId === item.id}
                          onClick={() => decide("exercise", item.id, false)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
