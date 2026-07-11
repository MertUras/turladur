# Neon Day 1–2 MVP Sprint Runbook

> **Hedef:** 3 kişilik ekip ile tourtech reposunu Neon PostgreSQL + Vercel Preview üzerinde çalışır hale getirmek.  
> **Süre:** 2 gün  
> **Branch:** `feat/neon-setup` (preview önce, prod sonra)

---

## Ekip Rol Dağılımı (öneri)

| Kişi | Sorumluluk |
|------|------------|
| **Dev A** | Neon hesap/proje/branch, connection string'ler, migrate deploy |
| **Dev B** | Vercel env, `feat/neon-setup` branch deploy, smoke test |
| **Dev C** | Yerel Docker Postgres, `.env.local`, yerel geliştirme doğrulama |

Her adımın sonunda Slack/Discord'da kısa durum paylaşımı yapın.

---

## Mevcut Repo Durumu (Day 0)

- **ORM:** Prisma 6.x + PostgreSQL
- **Migration:** `prisma/migrations/` altında **40 migration** mevcut → `migrate deploy` kullanılabilir
- **Seed:** `prisma/seed.ts` (Prisma resmi seed) + eski `prisma/seed.js` (ayrı `npm run seed`)
- **Docker:** Repoda `docker-compose.yml` **yok** — aşağıdaki snippet ile oluşturulacak
- **Env şablonu:** `.env.example` (bu sprint ile eklendi)

---

## Adım 0 — Yerel Docker Postgres (Dev C)

Repoda compose dosyası yok. Proje köküne `docker-compose.yml` ekleyin:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: tourtech-postgres
    restart: unless-stopped
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: tourtech
      POSTGRES_PASSWORD: tourtech
      POSTGRES_DB: tourtech
    volumes:
      - tourtech_pgdata:/var/lib/postgresql/data

volumes:
  tourtech_pgdata:
```

```bash
# Proje kökünde
docker compose up -d
docker compose ps   # healthy olmalı
```

`.env.local` oluşturun:

```bash
cp .env.example .env.local
```

`.env.local` içinde yerel değerler:

```env
DATABASE_URL="postgresql://tourtech:tourtech@localhost:5433/tourtech?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32 çıktısı>
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=<openssl rand -base64 32 çıktısı>
```

Yerel DB kurulumu:

```bash
npm install
npx prisma generate
npx prisma migrate deploy    # veya ilk kurulumda: npx prisma migrate dev
npm run db:seed              # prisma/seed.ts çalışır
npm run dev
```

**Yerelde kalacaklar (Neon'a taşınmaz):**
- PostgreSQL container (port 5433)
- `.env.local` (git'e girmez)
- `npm run dev` hot-reload geliştirme
- İsteğe bağlı: `prisma studio`, yerel seed denemeleri

---

## Adım 1 — Neon Hesap ve Proje (Dev A)

### Neon Panel Checklist (manuel)

- [ ] [neon.tech](https://neon.tech) → Sign up / Sign in (GitHub ile önerilir)
- [ ] **New Project** → İsim: `tourtech` (veya `turladur`)
- [ ] Region: **EU (Frankfurt / eu-central-1)** — Türkiye'ye yakın latency
- [ ] Postgres sürümü: **16** (Docker ile uyumlu)
- [ ] Proje oluştu → Dashboard açık

### Branch Yapısı

Neon'da **branching** kullanın:

| Branch | Amaç | Vercel eşlemesi |
|--------|------|-----------------|
| `main` | Production DB | Vercel Production |
| `develop` | Ortak geliştirme / ilk preview | Vercel Preview (`feat/neon-setup`) |
| (otomatik) | PR preview branch'leri | İleride PR başına (Day 3+) |

**İlk sprint için yeterli:** `main` + `develop` branch oluşturun.

Neon Console → **Branches** → **Create branch**:
- Parent: `main`
- Name: `develop`

---

## Adım 2 — Connection String'ler (Dev A)

Neon Console → **Branches** → `develop` seç → **Connection Details**

### Direct connection (migrate, seed, CI)

- "Direct connection" sekmesi
- SSL: `require`
- Örnek format:
  ```
  postgresql://USER:PASSWORD@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
  ```
- **Kullanım:** `prisma migrate deploy`, `prisma db seed`, lokal `.env` geçici override

### Pooled connection (Vercel runtime)

- "Pooled connection" sekmesi (host'ta `-pooler` vardır)
- Örnek format:
  ```
  postgresql://USER:PASSWORD@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
  ```
- **Kullanım:** Vercel `DATABASE_URL` (Preview + Production runtime)

> **Kural:** Migrate/seed → **direct**. Next.js API route runtime → **pooled**.

---

## Adım 3 — Neon'a Migration Uygula (Dev A)

`feat/neon-setup` branch'inde çalışın:

```bash
git checkout -b feat/neon-setup
```

Neon `develop` branch'ine **direct** URL ile migrate:

```bash
export DATABASE_URL="postgresql://USER:PASSWORD@ep-NEON_HOST.neon.tech/neondb?sslmode=require"

npx prisma migrate deploy
# veya
npm run db:migrate:deploy
```

Beklenen çıktı: 40 migration uygulanır, hata yok.

Doğrulama:

```bash
npx prisma migrate status
# → "Database schema is up to date!"
```

---

## Adım 4 — Seed Stratejisi

### Preview (`develop` branch) — SEED ÇALIŞTIR

Demo verisi gerekli (turlar, operatörler, aktiviteler):

```bash
export DATABASE_URL="postgresql://...@ep-NEON_HOST.neon.tech/neondb?sslmode=require"
npm run db:seed
```

**Seed kullanıcıları** (`prisma/seed.ts`):

| E-posta | Şifre | Rol |
|---------|-------|-----|
| `test.activity@tourtech.com` | `test123` | Experience Provider |
| `test.operator@tourtech.com` | `test123` | Tour Operator |
| `test.silver.operator@tourtech.com` | `test123` | Tour Operator |
| `test.bronze.operator@tourtech.com` | `test123` | Tour Operator |

> `prisma/seed.js` ayrı çalışır (`npm run seed`) — admin/otel verisi içerir ama Prisma resmi seed **değil**. Preview için `npm run db:seed` yeterli.

### Production (`main` branch) — SEED ÇALIŞTIRMA

- Prod'da `npm run db:seed` **çalıştırmayın**
- Sadece `migrate deploy` + gerçek kullanıcı kayıtları
- İlk admin gerekiyorsa: tek seferlik manuel SQL veya kontrollü script (Day 3+)

### Yerel Docker — SEED İSTEĞE BAĞLI

Geliştirme için `npm run db:seed` serbest. DB sıfırlamak için:

```bash
npx prisma migrate reset   # DİKKAT: tüm veriyi siler (sadece local/preview)
```

---

## Adım 5 — Vercel Env Kurulumu (Dev B)

### Branch ve deploy

```bash
git push -u origin feat/neon-setup
```

Vercel Dashboard → Proje → **Settings → Environment Variables**

`feat/neon-setup` preview deploy'u için **Preview** scope'ta ekleyin:

| Değişken | Değer | Not |
|----------|-------|-----|
| `DATABASE_URL` | Neon **pooled** (`develop`) | Runtime |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Preview ve prod'da farklı olsun |
| `NEXTAUTH_URL` | `https://<preview-url>.vercel.app` | İlk deploy sonrası güncellenir |
| `NEXT_PUBLIC_APP_URL` | Aynı preview URL | E-posta linkleri için |
| `JWT_SECRET` | Güçlü random string | Partner login |

**Build command önerisi** (Settings → Build & Development):

```
npx prisma generate && npx prisma migrate deploy && next build
```

> Build sırasında migrate için Vercel'e **direct** URL de verilebilir (ayrı env: `DIRECT_DATABASE_URL`) — ilk sprintte build öncesi lokalden `migrate deploy` yeterli. İleride `DIRECT_DATABASE_URL` + build script ayrımı yapın.

### İlk deploy sonrası

1. Preview URL'yi kopyalayın
2. `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL`'yi preview URL ile güncelleyin
3. **Redeploy** tetikleyin (env değişince session cookie domain'i düzelir)

---

## Adım 6 — Smoke Test Checklist (Dev B + Dev C)

### Yerel (Docker)

- [ ] `docker compose ps` → postgres healthy
- [ ] `npm run dev` → http://localhost:3000 açılıyor
- [ ] `/login` → test kullanıcı ile giriş
- [ ] Ana sayfa turlar/aktiviteler listeleniyor (seed sonrası)
- [ ] Partner login: `test.operator@tourtech.com` / `test123`

### Neon Preview (Vercel)

- [ ] Preview deploy yeşil (build log'da prisma hatası yok)
- [ ] Ana sayfa 200 OK
- [ ] `/api/auth/session` veya login akışı çalışıyor
- [ ] Tur listesi DB'den geliyor (boş değil — seed kontrol)
- [ ] Bir tur detay sayfası açılıyor
- [ ] Partner dashboard erişimi (operatör hesabı)

### Bilinen MVP dışı (şimdilik skip)

- Resend e-posta (`RESEND_API_KEY` yoksa doğrulama maili gitmez)
- SMTP iletişim formu
- Google Maps (`YOUR_GOOGLE_MAPS_API_KEY` placeholder)
- Firebase auth

---

## Neon Projesi Oluşturduktan Sonra — Komut Özeti

Aşağıdaki komutları sırayla çalıştırın. `PLACEHOLDER` değerlerini Neon panelinden alın.

```bash
# 1) Branch oluştur
git checkout -b feat/neon-setup

# 2) Bağımlılıklar
npm install

# 3) Neon develop — DIRECT URL ile migrate
export DATABASE_URL="postgresql://NEON_USER:NEON_PASSWORD@ep-NEON_HOST.eu-central-1.aws.neon.tech/neondb?sslmode=require"
npm run db:migrate:deploy

# 4) Preview için seed (develop branch)
npm run db:seed

# 5) Migrate durumu kontrol
npx prisma migrate status

# 6) Vercel'e push (Dev B env'leri panelden ayarlar)
git add .
git commit -m "feat: Neon setup — env example, migrate script, runbook"
git push -u origin feat/neon-setup
```

Vercel env (panelden, Preview scope):

```
DATABASE_URL = postgresql://NEON_USER:NEON_PASSWORD@ep-NEON_HOST-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET = <üretilmiş secret>
NEXTAUTH_URL = https://PLACEHOLDER-preview.vercel.app
NEXT_PUBLIC_APP_URL = https://PLACEHOLDER-preview.vercel.app
JWT_SECRET = <üretilmiş secret>
```

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| `P1001: Can't reach database` | Neon IP allow list kapalı mı? SSL `?sslmode=require` var mı? |
| Migrate pooled URL ile fail | Direct URL kullanın |
| Vercel build Prisma hatası | `postinstall` → `prisma generate` zaten var; `DATABASE_URL` preview'da tanımlı mı? |
| Login çalışmıyor (preview) | `NEXTAUTH_URL` preview URL ile birebir eşleşmeli, redeploy |
| Seed unique constraint hatası | DB'de kısmi seed var; `develop` branch'i reset veya yeni branch |
| Yerel port çakışması | 5433 başka serviste mi? `lsof -i :5433` |

---

## Bilinen Teknik Borçlar (bu sprint dışı)

1. **İki seed dosyası:** `seed.ts` (resmi) vs `seed.js` (`npm run seed`) — birleştirilmeli
2. **İki Prisma client:** `lib/prisma.ts` vs `app/lib/prisma.ts` — tek kaynak olmalı
3. **seed.ts idempotent değil:** `create` kullanıyor; tekrar seed duplicate hata verebilir
4. **docker-compose.yml** repoda yok — bu runbook'taki snippet ile eklenmeli
5. **JWT_SECRET** kodda `default-secret` fallback var — prod'da mutlaka env set edin

---

## Day 2 Sonu — Tamamlanma Kriterleri

- [ ] Neon `develop` branch migrate + seed tamam
- [ ] Vercel preview deploy yeşil, smoke test geçti
- [ ] Yerel Docker + `.env.local` ile paralel geliştirme devam ediyor
- [ ] `.env.example` repoda, `.env.local` gitignore'da
- [ ] Ekip connection string kurallarını (direct vs pooled) biliyor

**Sonraki adım (Day 3+):** Production `main` branch migrate, custom domain, PR başına Neon branch, CI'da otomatik migrate.
