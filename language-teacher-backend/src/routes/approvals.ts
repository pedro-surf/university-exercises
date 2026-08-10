import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { auth } from "../middleware/auth";

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
 * Body: { kind: "translation"|"exercise", id: string, approved: boolean }
 * approved=true keeps the row and marks it approved;
 * approved=false rejects by deleting the pending row.
 */
router.post("/decide", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { kind, id, approved } = req.body as {
      kind?: "translation" | "exercise";
      id?: string;
      approved?: boolean;
    };

    if (!kind || !id || typeof approved !== "boolean") {
      return res.status(400).json({
        error: "kind, id, and approved (boolean) are required",
      });
    }

    if (kind === "translation") {
      const existing = await prisma.assetTranslation.findUnique({
        where: { id },
      });
      if (!existing) {
        return res.status(404).json({ error: "Translation not found" });
      }

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

export default router;
