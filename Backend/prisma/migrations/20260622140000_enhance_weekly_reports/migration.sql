-- CreateEnum
CREATE TYPE "WeeklyReportStatus" AS ENUM ('SUBMITTED_ON_TIME', 'SUBMITTED_LATE', 'MISSING');

-- AlterTable
ALTER TABLE "WeeklyReport" ADD COLUMN "weekStartDate" DATE,
ADD COLUMN "status" "WeeklyReportStatus",
ADD COLUMN "supervisorComment" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill existing rows before enforcing NOT NULL
UPDATE "WeeklyReport"
SET
  "weekStartDate" = DATE("submittedAt"),
  "status" = 'SUBMITTED_ON_TIME',
  "updatedAt" = "submittedAt"
WHERE "weekStartDate" IS NULL;

ALTER TABLE "WeeklyReport"
ALTER COLUMN "weekStartDate" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReport_internshipId_weekStartDate_key" ON "WeeklyReport"("internshipId", "weekStartDate");

-- CreateTable
CREATE TABLE "ReportAttachment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "weeklyReportId" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportAttachment" ADD CONSTRAINT "ReportAttachment_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
