-- CreateTable
CREATE TABLE "FaucetDrawRecord" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "drawTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaucetDrawRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FaucetDrawRecord_address_key" ON "FaucetDrawRecord"("address");
