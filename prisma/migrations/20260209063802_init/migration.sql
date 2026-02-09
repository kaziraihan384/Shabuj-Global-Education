-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "tuitionFee" INTEGER NOT NULL,
    "ranking" INTEGER NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "University_country_idx" ON "University"("country");

-- CreateIndex
CREATE INDEX "University_ranking_idx" ON "University"("ranking");

-- CreateIndex
CREATE INDEX "University_tuitionFee_idx" ON "University"("tuitionFee");
