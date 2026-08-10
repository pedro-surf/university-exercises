import prisma from "./prisma";
import type {
  ContributionAction,
  ContributionKind,
  Language,
  Prisma,
} from "../../generated/prisma/client";

type LogInput = {
  kind: ContributionKind;
  action: ContributionAction;
  actorId?: string | null;
  contributorId?: string | null;
  targetId?: string | null;
  identifier: string;
  language?: Language | null;
  category?: string | null;
  payload: Prisma.InputJsonValue;
  note?: string | null;
};

export async function logContribution(input: LogInput) {
  return prisma.contributionLog.create({
    data: {
      kind: input.kind,
      action: input.action,
      actorId: input.actorId || null,
      contributorId: input.contributorId || null,
      targetId: input.targetId || null,
      identifier: input.identifier,
      language: input.language || null,
      category: input.category || null,
      payload: input.payload,
      note: input.note || null,
    },
  });
}

export async function logContributions(inputs: LogInput[]) {
  if (inputs.length === 0) return { count: 0 };
  return prisma.contributionLog.createMany({
    data: inputs.map((input) => ({
      kind: input.kind,
      action: input.action,
      actorId: input.actorId || null,
      contributorId: input.contributorId || null,
      targetId: input.targetId || null,
      identifier: input.identifier,
      language: input.language || null,
      category: input.category || null,
      payload: input.payload,
      note: input.note || null,
    })),
  });
}
