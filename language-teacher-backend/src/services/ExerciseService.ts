import prisma from "../lib/prisma";

export async function getUserScore(userId: string): Promise<number> {
    if (!userId || isNaN(Number(userId))) {
        throw new Error("Invalid user ID");
    }
    return prisma.queryRaw(`
        SELECT
  COUNT(*) FILTER (WHERE is_correct = true)::float
  / COUNT(*) * 100
FROM exercise_results
WHERE user_id = '${userId}';
`);
}