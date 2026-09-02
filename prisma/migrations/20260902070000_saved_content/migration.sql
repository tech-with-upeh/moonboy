CREATE TYPE "SavedContentStatus" AS ENUM ('DRAFT', 'SAVED');

CREATE TABLE "SavedContent" (
  "id" TEXT NOT NULL,
  "adminId" TEXT NOT NULL,
  "title" TEXT NOT NULL DEFAULT 'Untitled',
  "content" TEXT NOT NULL,
  "status" "SavedContentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SavedContent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SavedContent_adminId_status_updatedAt_idx" ON "SavedContent"("adminId", "status", "updatedAt");

ALTER TABLE "SavedContent" ADD CONSTRAINT "SavedContent_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
