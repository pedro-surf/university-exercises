import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { auth } from "../middleware/auth";
import {
  parseAssetCategory,
  parseCategory,
  parseLanguage,
} from "../lib/mappers";
import type { IconType } from "../../generated/prisma/client";
import { logContribution, logContributions } from "../lib/contributionLog";

const router = Router();

const ICON_TYPES = new Set<IconType>([
  "EMOJI",
  "FONT_AWESOME",
  "REACT_ICONS",
]);

function parseIconType(value: unknown): IconType | null | undefined {
  if (value === null) return null;
  if (value === undefined) return undefined;
  if (typeof value !== "string") return undefined;
  return ICON_TYPES.has(value as IconType) ? (value as IconType) : undefined;
}

/**
 * GET /assets?type=&category=&language=
 * Lists assets (optionally with a reference translation word).
 */
router.get("/", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const type = req.query.type ? parseCategory(req.query.type) : null;
    const category = req.query.category
      ? parseAssetCategory(req.query.category)
      : null;
    const language = req.query.language
      ? parseLanguage(req.query.language)
      : null;

    if (req.query.type && !type) {
      return res.status(400).json({ error: "Invalid type" });
    }
    if (req.query.category && !category) {
      return res.status(400).json({ error: "Invalid category" });
    }
    if (req.query.language && !language) {
      return res.status(400).json({ error: "Invalid language" });
    }

    const assets = await prisma.asset.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(category ? { category } : {}),
      },
      include: language
        ? {
            translations: {
              where: { language, approved: true },
              take: 1,
            },
          }
        : undefined,
      orderBy: [{ category: "asc" }, { identifier: "asc" }],
    });

    return res.json({
      count: assets.length,
      data: assets.map((asset) => ({
        id: asset.id,
        identifier: asset.identifier,
        type: asset.type,
        category: asset.category,
        icon: asset.icon,
        iconType: asset.iconType,
        word:
          "translations" in asset && Array.isArray(asset.translations)
            ? asset.translations[0]?.word ?? null
            : null,
      })),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching assets." });
  }
});

/** GET /assets/missing?referenceLanguage=&targetLanguage=&category?=&type?= */
router.get("/missing", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const referenceLanguage = parseLanguage(req.query.referenceLanguage);
    const targetLanguage = parseLanguage(req.query.targetLanguage);
    const category = req.query.category
      ? parseAssetCategory(req.query.category)
      : null;
    const type = req.query.type ? parseCategory(req.query.type) : null;

    if (!referenceLanguage || !targetLanguage) {
      return res.status(400).json({
        error: "referenceLanguage and targetLanguage are required",
      });
    }

    if (req.query.category && !category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (req.query.type && !type) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const assets = await prisma.asset.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(type ? { type } : {}),
        translations: {
          some: {
            language: referenceLanguage,
            approved: true,
          },
        },
      },
      include: {
        translations: {
          where: {
            language: { in: [referenceLanguage, targetLanguage] },
          },
        },
      },
      orderBy: [{ category: "asc" }, { identifier: "asc" }],
    });

    const missing = assets
      .map((asset) => {
        const reference = asset.translations.find(
          (t) => t.language === referenceLanguage && t.approved
        );
        const target = asset.translations.find(
          (t) => t.language === targetLanguage
        );

        if (!reference) return null;

        // Already has an approved translation — not missing.
        if (target?.approved) return null;

        return {
          assetId: asset.id,
          identifier: asset.identifier,
          type: asset.type,
          category: asset.category,
          icon: asset.icon,
          iconType: asset.iconType,
          referenceWord: reference.word,
          pendingWord: target && !target.approved ? target.word : null,
          pendingTranslationId: target && !target.approved ? target.id : null,
        };
      })
      .filter(Boolean);

    return res.json({ count: missing.length, data: missing });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching missing assets." });
  }
});

/** GET /assets/categories — distinct categories present in DB */
router.get("/categories", auth, async (_req: Request, res: Response): Promise<any> => {
  try {
    const rows = await prisma.asset.findMany({
      select: { category: true, type: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching categories." });
  }
});

/**
 * PUT /assets/translations
 * Body: { userId?, items: [{ identifier, category, language, word }] }
 * Teacher submissions are saved as approved: false.
 */
router.put("/translations", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, items } = req.body as {
      userId?: string;
      items?: Array<{
        identifier: string;
        category: string;
        language: string;
        word: string;
      }>;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array is required" });
    }

    const saved = [];

    for (const item of items) {
      const language = parseLanguage(item.language);
      const category = parseAssetCategory(item.category);
      const word = item.word?.trim();

      if (!language || !category || !item.identifier || !word) {
        return res.status(400).json({
          error:
            "Each item needs identifier, category, language, and non-empty word",
        });
      }

      const asset = await prisma.asset.findUnique({
        where: {
          identifier_category: {
            identifier: item.identifier,
            category,
          },
        },
      });

      if (!asset) {
        return res.status(404).json({
          error: `Asset not found: ${item.identifier} (${category})`,
        });
      }

      const translation = await prisma.assetTranslation.upsert({
        where: {
          assetId_language: {
            assetId: asset.id,
            language,
          },
        },
        create: {
          assetId: asset.id,
          language,
          word,
          approved: false,
          updatedById: userId || null,
        },
        update: {
          word,
          approved: false,
          updatedById: userId || null,
        },
        include: {
          asset: true,
        },
      });

      saved.push(translation);
    }

    await logContributions(
      saved.map((translation) => ({
        kind: "TRANSLATION" as const,
        action: "SUBMITTED" as const,
        actorId: userId || null,
        contributorId: userId || null,
        targetId: translation.id,
        identifier: translation.asset.identifier,
        language: translation.language,
        category: translation.asset.category,
        payload: {
          word: translation.word,
          assetId: translation.assetId,
          type: translation.asset.type,
        },
      }))
    );

    return res.json({
      message: "Translations saved for review",
      count: saved.length,
      data: saved,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while saving translations." });
  }
});

/**
 * PATCH /assets/:id/icon
 * Body: { icon: string | null, iconType: IconType | null }
 * Registered after named routes so paths like /missing are not captured.
 */
router.patch("/:id/icon", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const icon =
      req.body.icon === null || req.body.icon === undefined
        ? req.body.icon
        : String(req.body.icon).trim();
    const iconType = parseIconType(req.body.iconType);

    if (iconType === undefined && req.body.iconType !== undefined) {
      return res.status(400).json({
        error: "iconType must be EMOJI, FONT_AWESOME, REACT_ICONS, or null",
      });
    }

    if (icon && !iconType) {
      return res.status(400).json({
        error: "iconType is required when icon is set",
      });
    }

    if (!icon && iconType) {
      return res.status(400).json({
        error: "icon is required when iconType is set",
      });
    }

    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const data = await prisma.asset.update({
      where: { id },
      data: {
        icon: icon || null,
        iconType: icon ? iconType ?? null : null,
      },
    });

    const userId =
      typeof req.body.userId === "string" ? req.body.userId : null;

    await logContribution({
      kind: "ICON",
      action: "UPDATED",
      actorId: userId,
      contributorId: userId,
      targetId: data.id,
      identifier: data.identifier,
      category: data.category,
      payload: {
        icon: data.icon,
        iconType: data.iconType,
        previousIcon: existing.icon,
        previousIconType: existing.iconType,
      },
    });

    return res.json({ message: "Icon updated", data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while updating icon." });
  }
});

export default router;
