ALTER TABLE "Event"
ALTER COLUMN "context"
SET DATA TYPE jsonb
USING "context"::jsonb;