import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { auth } from "../middleware/auth";

const router = Router();

function publicUserFields(user: {
  id: string;
  name: string | null;
  email: string;
  location: string | null;
  bio: string | null;
  isPublic: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    location: user.location,
    bio: user.bio,
    isPublic: user.isPublic,
    createdAt: user.createdAt,
  };
}

/**
 * POST /users
 * Upsert by email so onboarding can create or refresh a profile.
 * Body: { email, name?, location?, bio?, isPublic? }
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, name, location, bio, isPublic } = req.body as {
      email?: string;
      name?: string;
      location?: string;
      bio?: string;
      isPublic?: boolean;
    };

    if (!email?.trim()) {
      return res.status(400).json({ error: "email is required" });
    }

    const user = await prisma.user.upsert({
      where: { email: email.trim().toLowerCase() },
      create: {
        email: email.trim().toLowerCase(),
        name: name?.trim() || null,
        location: location?.trim() || null,
        bio: bio?.trim() || null,
        isPublic: Boolean(isPublic),
      },
      update: {
        ...(name !== undefined ? { name: name?.trim() || null } : {}),
        ...(location !== undefined
          ? { location: location?.trim() || null }
          : {}),
        ...(bio !== undefined ? { bio: bio?.trim() || null } : {}),
        ...(isPublic !== undefined ? { isPublic: Boolean(isPublic) } : {}),
      },
    });

    return res.status(201).json({ data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while upserting user." });
  }
});

/**
 * GET /users/:id/profile?viewerId=
 * Public profiles are visible to anyone; private only to the owner.
 */
router.get("/:id/profile", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const viewerId =
      typeof req.query.viewerId === "string" ? req.query.viewerId : null;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isOwner = viewerId === user.id;
    if (!user.isPublic && !isOwner) {
      return res.status(403).json({
        private: true,
        message: "This profile is private.",
        data: {
          id: user.id,
          name: user.name,
          isPublic: false,
        },
      });
    }

    const [submitted, approved, rejected, icons] = await Promise.all([
      prisma.contributionLog.count({
        where: { contributorId: user.id, action: "SUBMITTED" },
      }),
      prisma.contributionLog.count({
        where: { contributorId: user.id, action: "APPROVED" },
      }),
      prisma.contributionLog.count({
        where: { contributorId: user.id, action: "REJECTED" },
      }),
      prisma.contributionLog.count({
        where: { contributorId: user.id, kind: "ICON" },
      }),
    ]);

    const recent = await prisma.contributionLog.findMany({
      where: {
        OR: [{ contributorId: user.id }, { actorId: user.id }],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        actor: { select: { id: true, name: true } },
        contributor: { select: { id: true, name: true } },
      },
    });

    return res.json({
      private: false,
      isOwner,
      data: {
        ...publicUserFields(user),
        ...(isOwner ? { email: user.email } : {}),
        stats: {
          submitted,
          approved,
          rejected,
          icons,
        },
        recent,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching profile." });
  }
});

/**
 * PATCH /users/:id
 * Owner updates profile / privacy. Body may include viewerId for ownership check.
 */
router.patch("/:id", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { viewerId, name, location, bio, isPublic } = req.body as {
      viewerId?: string;
      name?: string;
      location?: string;
      bio?: string;
      isPublic?: boolean;
    };

    if (!viewerId || viewerId !== id) {
      return res.status(403).json({ error: "Only the profile owner can edit." });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name?.trim() || null } : {}),
        ...(location !== undefined
          ? { location: location?.trim() || null }
          : {}),
        ...(bio !== undefined ? { bio: bio?.trim() || null } : {}),
        ...(isPublic !== undefined ? { isPublic: Boolean(isPublic) } : {}),
      },
    });

    return res.json({ data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while updating profile." });
  }
});

/** GET /users/:id — raw user (auth), kept for compatibility */
router.get("/:id", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching user." });
  }
});

export default router;
