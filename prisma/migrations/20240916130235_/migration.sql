-- CreateTable
CREATE TABLE "FileInfo" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileInfo_uniqueId_idx" ON "FileInfo"("uniqueId");
