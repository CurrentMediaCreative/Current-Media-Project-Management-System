-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM (
  'new_not_sent',
  'new_sent',
  'pending_clickup',
  'active',
  'completed',
  'archived'
);

-- CreateTable
CREATE TABLE "Projects" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'new_not_sent',
  "description" TEXT,
  "budget" DECIMAL,
  "predictedCosts" DECIMAL,
  "actualCosts" DECIMAL,
  "startDate" TIMESTAMP WITH TIME ZONE,
  "endDate" TIMESTAMP WITH TIME ZONE,
  "clickUpId" VARCHAR(255),
  "folderPath" TEXT,
  "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_name_key" ON "Projects"("name");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "Projects"("status");
