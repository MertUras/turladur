-- Faz 9: soft-delete uyumlu partial unique (User.email, Partner.contactEmail)
-- IdempotencyKey / AuditLog tabloları Faz 1'de mevcut; HTTP wiring uygulama katmanı.

DROP INDEX IF EXISTS "identity"."User_email_key";
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_active_key"
  ON "identity"."User"("email") WHERE "deletedAt" IS NULL;

CREATE INDEX IF NOT EXISTS "User_email_idx"
  ON "identity"."User"("email");

DROP INDEX IF EXISTS "identity"."Partner_contactEmail_key";
CREATE UNIQUE INDEX IF NOT EXISTS "Partner_contactEmail_active_key"
  ON "identity"."Partner"("contactEmail") WHERE "deletedAt" IS NULL;

CREATE INDEX IF NOT EXISTS "Partner_contactEmail_idx"
  ON "identity"."Partner"("contactEmail");
