-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "current_stock" INTEGER NOT NULL,
    "minimum_stock" INTEGER NOT NULL,
    "average_daily_sales" DOUBLE PRECISION NOT NULL,
    "lead_time_days" INTEGER NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "criticality_level" INTEGER NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);
