import axios from "./axios";
import type { IconType } from "../components/IconSelector";

export type AssetListItem = {
  id: string;
  identifier: string;
  type: string;
  category: string;
  icon: string | null;
  iconType: IconType | null;
  word: string | null;
};

export type MissingAsset = {
  assetId: string;
  identifier: string;
  type: string;
  category: string;
  icon: string | null;
  iconType: IconType | null;
  referenceWord: string;
  pendingWord: string | null;
  pendingTranslationId: string | null;
};

export type MissingExercise = {
  identifier: string;
  category: string;
  topic: string;
  difficulty: string;
  reference: {
    id: string;
    sentence: string;
    solution: string;
    hint: string;
  };
  pending: {
    id: string;
    sentence: string;
    solution: string;
    hint: string;
  } | null;
};

export type PendingTranslation = {
  id: string;
  word: string;
  language: string;
  approved: boolean;
  updatedAt: string;
  asset: {
    identifier: string;
    category: string;
    type: string;
  };
  updatedBy?: { id: string; name: string | null; email: string } | null;
};

export type PendingExercise = {
  id: string;
  identifier: string;
  language: string;
  category: string;
  topic: string;
  difficulty: string;
  sentence: string;
  solution: string;
  hint: string;
  approved: boolean;
  updatedAt: string;
  updatedBy?: { id: string; name: string | null; email: string } | null;
};

export async function fetchMissingAssets(params: {
  referenceLanguage: string;
  targetLanguage: string;
  category?: string;
  type?: string;
}) {
  const { data } = await axios.get<{ count: number; data: MissingAsset[] }>(
    "/assets/missing",
    { params }
  );
  return data;
}

export async function saveAssetTranslations(body: {
  userId?: string;
  items: Array<{
    identifier: string;
    category: string;
    language: string;
    word: string;
  }>;
}) {
  const { data } = await axios.put("/assets/translations", body);
  return data;
}

export async function fetchAssets(params: {
  type?: string;
  category?: string;
  language?: string;
}) {
  const { data } = await axios.get<{ count: number; data: AssetListItem[] }>(
    "/assets",
    { params }
  );
  return data;
}

export async function updateAssetIcon(
  assetId: string,
  body: { icon: string | null; iconType: IconType | null; userId?: string }
) {
  const { data } = await axios.patch<{
    message: string;
    data: AssetListItem;
  }>(`/assets/${assetId}/icon`, body);
  return data;
}

export type UserProfile = {
  id: string;
  name: string | null;
  email?: string;
  location: string | null;
  bio: string | null;
  isPublic: boolean;
  createdAt: string;
  stats: {
    submitted: number;
    approved: number;
    rejected: number;
    icons: number;
  };
  recent: Array<{
    id: string;
    kind: string;
    action: string;
    identifier: string;
    language: string | null;
    category: string | null;
    payload: Record<string, unknown>;
    createdAt: string;
    actor?: { id: string; name: string | null } | null;
    contributor?: { id: string; name: string | null } | null;
  }>;
};

export async function upsertUser(body: {
  email: string;
  name?: string;
  location?: string;
  bio?: string;
  isPublic?: boolean;
}) {
  const { data } = await axios.post<{ data: {
    id: string;
    email: string;
    name: string | null;
    location: string | null;
    bio: string | null;
    isPublic: boolean;
  } }>("/users", body);
  return data.data;
}

export async function fetchUserProfile(userId: string, viewerId?: string) {
  const { data } = await axios.get<{
    private: boolean;
    isOwner?: boolean;
    message?: string;
    data: UserProfile | { id: string; name: string | null; isPublic: false };
  }>(`/users/${userId}/profile`, {
    params: viewerId ? { viewerId } : undefined,
    validateStatus: (status) => status < 500,
  });
  return data;
}

export async function updateUserProfile(
  userId: string,
  body: {
    viewerId: string;
    name?: string;
    location?: string;
    bio?: string;
    isPublic?: boolean;
  }
) {
  const { data } = await axios.patch<{ data: UserProfile }>(
    `/users/${userId}`,
    body
  );
  return data.data;
}

export async function fetchMissingExercises(params: {
  referenceLanguage: string;
  targetLanguage: string;
  category?: string;
}) {
  const { data } = await axios.get<{ count: number; data: MissingExercise[] }>(
    "/exercises/missing",
    { params }
  );
  return data;
}

export async function saveExerciseTranslations(body: {
  userId?: string;
  items: Array<{
    identifier: string;
    language: string;
    category: string;
    topic: string;
    difficulty: string;
    sentence: string;
    solution: string;
    hint: string;
  }>;
}) {
  const { data } = await axios.put("/exercises/translations", body);
  return data;
}

export async function fetchPendingApprovals(kind: "all" | "translation" | "exercise" = "all") {
  const { data } = await axios.get<{
    translations: { count: number; data: PendingTranslation[] };
    exercises: { count: number; data: PendingExercise[] };
  }>("/approvals/pending", { params: { kind } });
  return data;
}

export async function decideApproval(body: {
  kind: "translation" | "exercise";
  id: string;
  approved: boolean;
  reviewerId?: string;
}) {
  const { data } = await axios.post("/approvals/decide", body);
  return data;
}
