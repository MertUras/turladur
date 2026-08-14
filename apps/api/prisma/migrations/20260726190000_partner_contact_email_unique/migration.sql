-- Enforce one active partner company identity per contact email.
-- Soft-deleted rows still occupy the unique slot (same pattern as User.email).
CREATE UNIQUE INDEX IF NOT EXISTS "Partner_contactEmail_key"
ON identity."Partner"("contactEmail");
