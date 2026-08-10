import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { auth } from "../middleware/auth";
import { logContribution } from "../lib/contributionLog";

const router = Router();

/** GET /approvals/pending?kind=translation|exercise|all */
router.get("/pending", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const kind = String(req.query.kind || "all");

    const [translations, exercises] = await Promise.all([
      kind === "exercise"
        ? Promise.resolve([])
        : prisma.assetTranslation.findMany({
            where: { approved: false },
            include: {
              asset: true,
              updatedBy: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { updatedAt: "desc" },
          }),
      kind === "translation"
        ? Promise.resolve([])
        : prisma.exercise.findMany({
            where: { approved: false },
            include: {
              updatedBy: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { updatedAt: "desc" },
          }),
    ]);

    return res.json({
      translations: {
        count: translations.length,
        data: translations,
      },
      exercises: {
        count: exercises.length,
        data: exercises,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching pending approvals." });
  }
});

/**
 * POST /approvals/decide
 * Body: { kind, id, approved, reviewerId? }
 * Approve keeps the row; reject deletes it after logging a snapshot.
 */
router.post("/decide", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { kind, id, approved, reviewerId } = req.body as {
      kind?: "translation" | "exercise";
      id?: string;
      approved?: boolean;
      reviewerId?: string;
    };

    if (!kind || !id || typeof approved !== "boolean") {
      return res.status(400).json({
        error: "kind, id, and approved (boolean) are required",
      });
    }

    const action = approved ? "APPROVED" : "REJECTED";

    if (kind === "translation") {
      const existing = await prisma.assetTranslation.findUnique({
        where: { id },
        include: { asset: true },
      });
      if (!existing) {
        return res.status(404).json({ error: "Translation not found" });
      }

      await logContribution({
        kind: "TRANSLATION",
        action,
        actorId: reviewerId || null,
        contributorId: existing.updatedById,
        targetId: existing.id,
        identifier: existing.asset.identifier,
        language: existing.language,
        category: existing.asset.category,
        payload: {
          word: existing.word,
          assetId: existing.assetId,
          type: existing.asset.type,
          approvedBefore: existing.approved,
        },
      });

      if (approved) {
        const data = await prisma.assetTranslation.update({
          where: { id },
          data: { approved: true },
        });
        return res.json({ message: "Translation approved", data });
      }

      await prisma.assetTranslation.delete({ where: { id } });
      return res.json({ message: "Translation rejected and removed" });
    }

    if (kind === "exercise") {
      const existing = await prisma.exercise.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Exercise not found" });
      }

      await logContribution({
        kind: "EXERCISE",
        action,
        actorId: reviewerId || null,
        contributorId: existing.updatedById,
        targetId: existing.id,
        identifier: existing.identifier,
        language: existing.language,
        category: existing.category,
        payload: {
          sentence: existing.sentence,
          solution: existing.solution,
          hint: existing.hint,
          topic: existing.topic,
          difficulty: existing.difficulty,
          approvedBefore: existing.approved,
        },
      });

      if (approved) {
        const data = await prisma.exercise.update({
          where: { id },
          data: { approved: true },
        });
        return res.json({ message: "Exercise approved", data });
      }

      await prisma.exercise.delete({ where: { id } });
      return res.json({ message: "Exercise rejected and removed" });
    }

    return res.status(400).json({ error: "kind must be translation or exercise" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while deciding approval." });
  }
});

/** GET /approvals/history?contributorId=&limit= */
router.get("/history", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const contributorId =
      typeof req.query.contributorId === "string"
        ? req.query.contributorId
        : undefined;
    const limit = Math.min(Number(req.query.limit) || 50, 200);

    const data = await prisma.contributionLog.findMany({
      where: contributorId
        ? {
            OR: [
              { contributorId },
              { actorId: contributorId },
            ],
          }
        : undefined,
      include: {
        actor: { select: { id: true, name: true, email: true } },
        contributor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return res.json({ count: data.length, data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching history." });
  }
});

export default router;
