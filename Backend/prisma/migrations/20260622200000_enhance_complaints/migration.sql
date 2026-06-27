-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "response" TEXT;
ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "handledById" INTEGER;
ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Complaint_handledById_fkey'
  ) THEN
    ALTER TABLE "Complaint"
      ADD CONSTRAINT "Complaint_handledById_fkey"
      FOREIGN KEY ("handledById") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
