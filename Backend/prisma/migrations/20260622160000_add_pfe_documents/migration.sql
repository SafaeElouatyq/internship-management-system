-- CreateEnum
CREATE TYPE "PfeDocumentCategory" AS ENUM ('INITIAL', 'CORRECTED', 'FINAL', 'PRESENTATION');

CREATE TYPE "PfeDocumentValidationStatus" AS ENUM ('PENDING', 'VALIDATED', 'NEEDS_CORRECTION', 'REJECTED');

-- AlterTable
ALTER TABLE "Document"
ADD COLUMN "category" "PfeDocumentCategory",
ADD COLUMN "validationStatus" "PfeDocumentValidationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "supervisorComment" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Document_internshipId_category_key" ON "Document"("internshipId", "category");
