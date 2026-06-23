-- CreateEnum
CREATE TYPE "InternshipDocumentType" AS ENUM ('CONVENTION', 'ATTESTATION', 'OTHER');

-- CreateTable
CREATE TABLE "InternshipDocument" (
    "id" SERIAL NOT NULL,
    "type" "InternshipDocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "internshipId" INTEGER NOT NULL,
    "uploadedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternshipDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InternshipDocument" ADD CONSTRAINT "InternshipDocument_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipDocument" ADD CONSTRAINT "InternshipDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
