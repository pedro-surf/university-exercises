import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../Context";
import {
  fetchUserProfile,
  updateUserProfile,
  upsertUser,
  type UserProfile,
} from "../utils/api";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    userId,
    userName,
    userEmail,
    userLocation,
    userBio,
    isPublic,
    setUserId,
    setUserName,
    setUserLocation,
    setUserBio,
    setIsPublic,
  } = useAppContext();

  const profileId = id || userId;
  const isOwnProfile = Boolean(profileId && profileId === userId);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [draftName, setDraftName] = useState(userName || "");
  const [draftLocation, setDraftLocation] = useState(userLocation || "");
  const [draftBio, setDraftBio] = useState(userBio || "");
  const [draftPublic, setDraftPublic] = useState(isPublic);

  const load = useCallback(async () => {
    if (!profileId) {
      setError("No user profile yet. Finish onboarding with an email first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserProfile(profileId, userId || undefined);
      if (result.private) {
        setIsPrivate(true);
        setProfile(null);
        return;
      }

      setIsPrivate(false);
      const data = result.data as UserProfile;
      setProfile(data);
      if (result.isOwner) {
        setDraftName(data.name || "");
        setDraftLocation(data.location || "");
        setDraftBio(data.bio || "");
        setDraftPublic(data.isPublic);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [profileId, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!profileId || !userId || !isOwnProfile) return;

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await updateUserProfile(profileId, {
        viewerId: userId,
        name: draftName,
        location: draftLocation,
        bio: draftBio,
        isPublic: draftPublic,
      });
      setUserName(draftName);
      setUserLocation(draftLocation);
      setUserBio(draftBio);
      setIsPublic(draftPublic);
      setMessage(
        draftPublic
          ? "Profile saved and is now public."
          : "Profile saved and is now private."
      );
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: updated.name,
              location: updated.location,
              bio: updated.bio,
              isPublic: updated.isPublic,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="mt-2 text-4xl font-black">
              {isOwnProfile ? "Your profile" : "Teacher profile"}
            </h1>
            <p className="text-gray-600">
              {isOwnProfile
                ? "Control what others can see about your contributions."
                : "Public contribution history"}
            </p>
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

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : isPrivate ? (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-2xl font-bold">This profile is private</h2>
            <p className="mt-2 text-gray-600">
              The teacher has chosen not to share their profile publicly.
            </p>
          </div>
        ) : !profile ? (
          <div className="rounded-3xl border bg-white p-8 space-y-4">
            <p className="text-gray-600">
              {userEmail
                ? "Your local session is missing a linked account. Sync it to create or restore your profile."
                : "Add your email in onboarding to create a profile."}
            </p>
            {userEmail && (
              <button
                className="rounded-xl bg-black px-4 py-2 font-semibold text-white"
                onClick={async () => {
                  try {
                    const user = await upsertUser({
                      email: userEmail,
                      name: userName,
                      location: userLocation,
                      bio: userBio,
                      isPublic,
                    });
                    setUserId(user.id);
                    setMessage("Profile synced.");
                  } catch (err) {
                    console.error(err);
                    setError("Failed to sync profile.");
                  }
                }}
              >
                Sync profile
              </button>
            )}
          </div>
        ) : (
          <>
            <section className="rounded-3xl border bg-white p-6 space-y-4">
              {isOwnProfile ? (
                <>
                  <label className="block space-y-1">
                    <span className="text-sm text-gray-600">Name</span>
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-sm text-gray-600">Location</span>
                    <input
                      value={draftLocation}
                      onChange={(e) => setDraftLocation(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-sm text-gray-600">Bio</span>
                    <textarea
                      value={draftBio}
                      onChange={(e) => setDraftBio(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border px-3 py-2"
                      placeholder="Short intro for other learners…"
                    />
                  </label>
                  <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                    <div>
                      <div className="font-semibold">Public profile</div>
                      <div className="text-sm text-gray-500">
                        When on, anyone with your link can see stats and history.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraftPublic((v) => !v)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        draftPublic
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {draftPublic ? "Public" : "Private"}
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Email (private): {profile.email || userEmail}
                  </div>
                  <button
                    onClick={save}
                    disabled={saving}
                    className="rounded-xl bg-black px-4 py-2 font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save profile"}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black">
                    {profile.name || "Anonymous teacher"}
                  </h2>
                  {profile.location && (
                    <p className="text-gray-600">{profile.location}</p>
                  )}
                  {profile.bio && (
                    <p className="text-lg text-gray-700">{profile.bio}</p>
                  )}
                </>
              )}
            </section>

            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(
                [
                  ["Submitted", profile.stats.submitted],
                  ["Approved", profile.stats.approved],
                  ["Rejected", profile.stats.rejected],
                  ["Icons", profile.stats.icons],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border bg-white p-4 text-center"
                >
                  <div className="text-3xl font-black">{value}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </section>

            <section className="rounded-3xl border bg-white p-6">
              <h2 className="mb-4 text-2xl font-bold">Contribution history</h2>
              {profile.recent.length === 0 ? (
                <p className="text-gray-500">No contributions logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {profile.recent.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold">
                          {item.action} · {item.kind}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.identifier}
                        {item.category ? ` · ${item.category}` : ""}
                        {item.language ? ` · ${item.language}` : ""}
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
