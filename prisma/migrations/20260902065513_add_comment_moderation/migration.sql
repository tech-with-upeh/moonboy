-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "ipHash" TEXT;

-- CreateIndex
CREATE INDEX "Comment_ipHash_createdAt_idx" ON "Comment"("ipHash", "createdAt");
