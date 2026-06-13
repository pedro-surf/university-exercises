-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'ES', 'FR', 'DE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('VOCABULARY', 'GRAMMAR', 'LISTENING', 'READING');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('FOOD', 'TRAVEL', 'FAMILY', 'SURFING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "category" "Category" NOT NULL,
    "topic" "Topic" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "sentence" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "durationSec" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "exercises_identifier_idx" ON "exercises"("identifier");

-- CreateIndex
CREATE INDEX "exercises_language_idx" ON "exercises"("language");

-- CreateIndex
CREATE INDEX "exercise_results_userId_idx" ON "exercise_results"("userId");

-- CreateIndex
CREATE INDEX "exercise_results_exerciseId_idx" ON "exercise_results"("exerciseId");

-- AddForeignKey
ALTER TABLE "exercise_results" ADD CONSTRAINT "exercise_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_results" ADD CONSTRAINT "exercise_results_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
