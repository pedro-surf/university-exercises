import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { generateExercisesFromAI } from "../services/OpenAIService";
import { getUserScore } from "../services/ExerciseService";
import { auth } from "../middleware/auth";
import {
  Category,
  Difficulty,
  Language,
  Topic,
} from "../../generated/prisma/enums";

// --- IN-MEMORY QUOTA CONFIGURATION ---
// This lives in the RAM of your running Node process.
// When the server restarts, these reset back to their initial values.
const MAX_GENERATIONS_PER_SERVER_LIFETIME = 3;
let totalGenerationsExecuted = 0;

const router = Router();

router.get("/", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { language, category, difficulty } = req.query;

    if (!language || !category) {
      return res
        .status(400)
        .json({ error: "Missing required parameters: language and category" });
    }

    const includePending = req.query.includePending === "true";

    const exercises = await prisma.exercise.findMany({
      where: {
        language: language as Language,
        category: category as Category,
        ...(difficulty && { difficulty: difficulty as Difficulty }),
        ...(!includePending && { approved: true }),
      },
    });

    return res.json({ count: exercises.length, data: exercises });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching exercises." });
  }
});

router.get(
  "/scores/:userId",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.params;
      const score = await getUserScore(userId as string);
      return res.json({ userId, score });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error while fetching user score." });
    }
  },
);

// POST: Trigger AI generation for new exercises and persist
router.post(
  "/generate",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      // 1. Check if the server-lifetime quota has been exceeded
      if (totalGenerationsExecuted > MAX_GENERATIONS_PER_SERVER_LIFETIME) {
        return res.status(429).json({
          error: "Server quota exceeded.",
          message: `Security Lock: This endpoint can only be called ${MAX_GENERATIONS_PER_SERVER_LIFETIME} times per server instance to prevent API wallet drain. Please restart the backend server manually to reset this quota.`,
        });
      }

      const {
        nativeLanguage,
        targetLanguage,
        category,
        difficulty,
        quantity = 1,
      } = req.body;

      if (!nativeLanguage || !targetLanguage || !category || !difficulty) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      if (quantity > 5) {
        return res
          .status(400)
          .json({ error: "Quantity of exercises may not exceed 5" });
      }

      // 2. Increment the counter immediately before calling the expensive API
      totalGenerationsExecuted++;
      console.log(
        `[QUOTA ALERT] Generation triggered. Usage: ${totalGenerationsExecuted}/${MAX_GENERATIONS_PER_SERVER_LIFETIME}`,
      );

      const aiExercises = await generateExercisesFromAI(
        [nativeLanguage, targetLanguage],
        category,
      );
      console.log({ aiExercises });
      const savedExercises = await prisma.$transaction(
        aiExercises.map((ex) =>
          prisma.exercise.create({
            data: {
              identifier: ex.identifier,
              language: targetLanguage,
              category: category,
              difficulty: difficulty,
              sentence: ex.sentence,
              solution: ex.solution,
              hint: ex.hint,
              topic: ex.topic as Topic,
            },
          }),
        ),
      );

      return res.status(201).json({
        message: `Success! Quota remaining: ${MAX_GENERATIONS_PER_SERVER_LIFETIME - totalGenerationsExecuted}`,
        data: savedExercises,
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to process exercises." });
    }
  },
);

router.post('/submit', auth, async (req: Request, res: Response): Promise<any> => {
  try {
    await prisma.exerciseResult.create({
      data: req.body,
    });
    return res.status(201).json({ message: "Exercise result submitted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error while submitting exercise." });
  }
});

router.post('/', auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      identifier,
      language,
      category,
      difficulty,
      sentence,
      solution,
      hint,
      topic,
      userId,
      approved = false,
    } = req.body;
    await prisma.exercise.create({
      data: {
        identifier,
        language,
        category,
        difficulty,
        sentence,
        solution,
        hint,
        topic,
        approved: Boolean(approved),
        updatedById: userId || null,
      },
    });
    return res.status(201).json({ message: "Exercise created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error while creating exercise." });
  }
}
);

export default router;
