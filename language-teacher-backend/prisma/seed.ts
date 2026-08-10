import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  type AssetCategory,
  type Category,
  type IconType,
  type Language,
} from "../generated/prisma/client";

type AssetJsonItem = {
  id: string;
  word: string;
  icon?: string;
  iconType?: IconType;
};

type CollectedAsset = {
  identifier: string;
  type: Category;
  category: AssetCategory;
  icon: string | null;
  iconType: IconType | null;
  translations: Map<Language, string>;
};

const LANGUAGE_MAP: Record<string, Language> = {
  "en-US": "EN",
  "es-ES": "ES",
  "fr-FR": "FR",
  "de-DE": "DE",
  "pt-BR": "PT",
  "cs-CZ": "CZ",
  "nl-NL": "NL",
  "it-IT": "IT",
  "id-ID": "ID",
  "ja-JP": "JA",
};

const ASSET_CATEGORY_MAP: Record<string, AssetCategory> = {
  food: "FOOD",
  travel: "TRAVEL",
  emotions: "EMOTIONS",
  business: "BUSINESS",
  surfing: "SURFING",
  pronouns: "PRONOUNS",
  adjectives: "ADJECTIVES",
  articles: "ARTICLES",
  adverbs: "ADVERBS",
  conjunctions: "CONJUNCTIONS",
  verbs: "VERBS",
  prepositions: "PREPOSITIONS",
  possessives: "POSSESSIVES",
};

const TYPE_MAP: Record<string, Category> = {
  vocabulary: "VOCABULARY",
  grammar: "GRAMMAR",
};

const ASSETS_ROOT =
  process.env.ASSETS_DIR ??
  path.resolve(process.cwd(), "../language-teacher/src/assets");

function assetKey(category: AssetCategory, identifier: string) {
  return `${category}:${identifier}`;
}

async function readJsonArray(filePath: string): Promise<AssetJsonItem[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      console.warn(`Skipping non-array JSON: ${filePath}`);
      return [];
    }

    return parsed.filter(
      (item): item is AssetJsonItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as AssetJsonItem).id === "string" &&
        typeof (item as AssetJsonItem).word === "string"
    );
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function collectAssets(): Promise<Map<string, CollectedAsset>> {
  const collected = new Map<string, CollectedAsset>();
  const languageDirs = await fs.readdir(ASSETS_ROOT, { withFileTypes: true });

  for (const languageDir of languageDirs) {
    if (!languageDir.isDirectory() || languageDir.name === "shared") {
      continue;
    }

    const language = LANGUAGE_MAP[languageDir.name];
    if (!language) {
      console.warn(`Skipping unknown language folder: ${languageDir.name}`);
      continue;
    }

    for (const [folder, type] of Object.entries(TYPE_MAP)) {
      const folderPath = path.join(ASSETS_ROOT, languageDir.name, folder);

      let files: string[];
      try {
        files = await fs.readdir(folderPath);
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT") {
          continue;
        }
        throw error;
      }

      for (const file of files) {
        if (!file.endsWith(".json")) {
          continue;
        }

        const categoryName = path.basename(file, ".json");
        const category = ASSET_CATEGORY_MAP[categoryName];
        if (!category) {
          console.warn(`Skipping unknown asset category file: ${file}`);
          continue;
        }

        const items = await readJsonArray(path.join(folderPath, file));

        for (const item of items) {
          const key = assetKey(category, item.id);
          const existing = collected.get(key);

          if (!existing) {
            collected.set(key, {
              identifier: item.id,
              type,
              category,
              icon: item.icon ?? null,
              iconType: item.iconType ?? null,
              translations: new Map([[language, item.word]]),
            });
            continue;
          }

          existing.translations.set(language, item.word);

          // Prefer icon metadata from en-US; otherwise take the first seen value.
          if (!existing.icon && item.icon) {
            existing.icon = item.icon;
            existing.iconType = item.iconType ?? null;
          } else if (
            language === "EN" &&
            item.icon &&
            existing.icon !== item.icon
          ) {
            existing.icon = item.icon;
            existing.iconType = item.iconType ?? null;
          }
        }
      }
    }
  }

  return collected;
}

async function main() {
  console.log(`Seeding assets from: ${ASSETS_ROOT}`);

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const assets = await collectAssets();
    let assetCount = 0;
    let translationCount = 0;

    for (const asset of assets.values()) {
      const saved = await prisma.asset.upsert({
        where: {
          identifier_category: {
            identifier: asset.identifier,
            category: asset.category,
          },
        },
        create: {
          identifier: asset.identifier,
          type: asset.type,
          category: asset.category,
          icon: asset.icon,
          iconType: asset.iconType,
        },
        update: {
          type: asset.type,
          ...(asset.icon
            ? { icon: asset.icon, iconType: asset.iconType }
            : {}),
        },
      });

      assetCount += 1;

      for (const [language, word] of asset.translations) {
        await prisma.assetTranslation.upsert({
          where: {
            assetId_language: {
              assetId: saved.id,
              language,
            },
          },
          create: {
            assetId: saved.id,
            language,
            word,
            approved: true,
          },
          update: {
            word,
            approved: true,
          },
        });
        translationCount += 1;
      }
    }

    console.log(
      `Seed complete: ${assetCount} assets, ${translationCount} translations`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Asset seed failed:", error);
  process.exit(1);
});
