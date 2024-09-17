-- CreateTable
CREATE TABLE "FileInfo" (
    "id" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" UUID NOT NULL,
    "shareLink" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareFileInfo" (
    "shareId" UUID NOT NULL,
    "fileInfoId" UUID NOT NULL,

    CONSTRAINT "ShareFileInfo_pkey" PRIMARY KEY ("shareId","fileInfoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileInfo_key_key" ON "FileInfo"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Share_shareLink_key" ON "Share"("shareLink");

-- AddForeignKey
ALTER TABLE "ShareFileInfo" ADD CONSTRAINT "ShareFileInfo_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareFileInfo" ADD CONSTRAINT "ShareFileInfo_fileInfoId_fkey" FOREIGN KEY ("fileInfoId") REFERENCES "FileInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
