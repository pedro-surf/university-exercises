import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { auth } from "../middleware/auth";
import { parseCategory, parseLanguage } from "../lib/mappers";
import type { Difficulty, Topic } from "../../generated/prisma/client";

const router = Router();

/**
 * GET /exercises/missing?referenceLanguage=&targetLanguage=&category?=
 * Exercises that exist (approved) in the reference language but have no
 * approved counterpart with the same identifier in the target language.
 */
router.get("/missing", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const referenceLanguage = parseLanguage(req.query.referenceLanguage);
    const targetLanguage = parseLanguage(req.query.targetLanguage);
    const category = req.query.category
      ? parseCategory(req.query.category)
      : null;

    if (!referenceLanguage || !targetLanguage) {
      return res.status(400).json({
        error: "referenceLanguage and targetLanguage are required",
      });
    }

    if (req.query.category && !category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const referenceExercises = await prisma.exercise.findMany({
      where: {
        language: referenceLanguage,
        approved: true,
        ...(category ? { category } : {}),
      },
      orderBy: { identifier: "asc" },
    });

    const identifiers = referenceExercises.map((ex) => ex.identifier);
    const targetExercises = await prisma.exercise.findMany({
      where: {
        language: targetLanguage,
        identifier: { in: identifiers },
      },
    });

    const targetByIdentifier = new Map(
      targetExercises.map((ex) => [ex.identifier, ex])
    );

    const missing = referenceExercises
      .map((reference) => {
        const target = targetByIdentifier.get(reference.identifier);
        if (target?.approved) return null;

        return {
          identifier: reference.identifier,
          category: reference.category,
          topic: reference.topic,
          difficulty: reference.difficulty,
          reference: {
            id: reference.id,
            sentence: reference.sentence,
            solution: reference.solution,
            hint: reference.hint,
          },
          pending: target && !target.approved
            ? {
                id: target.id,
                sentence: target.sentence,
                solution: target.solution,
                hint: target.hint,
              }
            : null,
        };
      })
      .filter(Boolean);

    return res.json({ count: missing.length, data: missing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error while fetching missing exercises.",
    });
  }
});

/**
 * PUT /exercises/translations
 * Body: {
 *   userId?,
 *   items: [{
 *     identifier, language, category, topic, difficulty,
 *     sentence, solution, hint
 *   }]
 * }
 */
router.put(
  "/translations",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, items } = req.body as {
        userId?: string;
        items?: Array<{
          identifier: string;
          language: string;
          category: string;
          topic: Topic;
          difficulty: Difficulty;
          sentence: string;
          solution: string;
          hint: string;
        }>;
      };

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items array is required" });
      }

      const saved = [];

      for (const item of items) {
        const language = parseLanguage(item.language);
        const category = parseCategory(item.category);

        if (
          !language ||
          !category ||
          !item.identifier ||
          !item.topic ||
          !item.difficulty ||
          !item.sentence?.trim() ||
          !item.solution?.trim()
        ) {
          return res.status(400).json({
            error:
              "Each item needs identifier, language, category, topic, difficulty, sentence, and solution",
          });
        }

        const exercise = await prisma.exercise.upsert({
          where: {
            identifier_language: {
              identifier: item.identifier,
              language,
            },
          },
          create: {
            identifier: item.identifier,
            language,
            category,
            topic: item.topic,
            difficulty: item.difficulty,
            sentence: item.sentence.trim(),
            solution: item.solution.trim(),
            hint: item.hint?.trim() || "",
            approved: false,
            updatedById: userId || null,
          },
          update: {
            category,
            topic: item.topic,
            difficulty: item.difficulty,
            sentence: item.sentence.trim(),
            solution: item.solution.trim(),
            hint: item.hint?.trim() || "",
            approved: false,
            updatedById: userId || null,
          },
        });

        saved.push(exercise);
      }

      return res.json({
        message: "Exercises saved for review",
        count: saved.length,
        data: saved,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Internal server error while saving exercise translations.",
      });
    }
  }
);

export default router;
