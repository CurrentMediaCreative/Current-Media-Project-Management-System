-- Drop existing tables if they exist
DROP TABLE IF EXISTS "Projects" CASCADE;

-- Create Projects table with new schema
CREATE TABLE "Projects" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "status" VARCHAR(50) NOT NULL,
  "budget" DECIMAL(10,2),
  "predictedCosts" DECIMAL(10,2),
  "actualCosts" DECIMAL(10,2),
  "folderPath" VARCHAR(255),
  "clickUpId" VARCHAR(255),
  "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX "projects_name_idx" ON "Projects"("name");

-- Create index on status for filtering
CREATE INDEX "projects_status_idx" ON "Projects"("status");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamp
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON "Projects"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE "Projects" IS 'Stores project information with name-based matching to ClickUp tasks';
COMMENT ON COLUMN "Projects"."name" IS 'Primary matching field for ClickUp integration';
COMMENT ON COLUMN "Projects"."status" IS 'Project status (NEW_NOT_SENT, NEW_SENT, ACTIVE, COMPLETED, ARCHIVED)';
COMMENT ON COLUMN "Projects"."clickUpId" IS 'Optional reference to associated ClickUp task';
COMMENT ON COLUMN "Projects"."documents" IS 'Array of document paths associated with the project';
