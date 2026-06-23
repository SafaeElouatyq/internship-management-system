-- CreateEnum
CREATE TYPE "SubjectDecision" AS ENUM ('ACCEPTED', 'ACCEPTED_WITH_REFORMULATION', 'NEEDS_CORRECTION', 'REJECTED');

-- CreateTable
CREATE TABLE "SubjectValidation" (
    "id" SERIAL NOT NULL,
    "decision" "SubjectDecision" NOT NULL,
    "comment" TEXT,
    "reformulatedTitle" TEXT,
    "internshipId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectValidation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubjectValidation" ADD CONSTRAINT "SubjectValidation_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
