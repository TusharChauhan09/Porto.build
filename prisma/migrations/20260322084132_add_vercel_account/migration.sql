-- CreateTable
CREATE TABLE "vercel_account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vercel_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vercel_account_userId_key" ON "vercel_account"("userId");

-- CreateIndex
CREATE INDEX "vercel_account_userId_idx" ON "vercel_account"("userId");

-- AddForeignKey
ALTER TABLE "vercel_account" ADD CONSTRAINT "vercel_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
