# Vercel Day 1–2 — Preview Deploy Runbook (Türkçe)

> **Hedef:** `feat/neon-setup` branch'ini Vercel Preview'da çalıştırmak.  
> **Ön koşul:** Neon `develop` branch'ine `migrate deploy` (+ isteğe bağlı seed) uygulanmış olmalı ([NEON_DAY1-2.md](./NEON_DAY1-2.md)).

---

## Kim ne yapar?

Bu dosyadaki adımlar **Vercel Dashboard'da manuel** yapılır (Dev B). Agent/CI Vercel hesabınıza erişemez.

---

## Adım 1 — GitHub reposunu içe aktar

1. [vercel.com](https://vercel.com) → giriş yapın.
2. **Add New… → Project**.
3. **Import Git Repository** altında GitHub hesabınızı bağlayın (gerekirse).
4. Repoyu seçin:
   - `halilmertogut/turladur` **veya**
   - `halilmertogut/tourtech` (hangisi güncel remote ise)
5. **Import** ile devam edin.

---

## Adım 2 — Framework ve proje ayarları

| Alan | Değer |
|------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `./` (kök) |
| **Node.js Version** | 20.x (varsayılan uygunsa bırakın) |

**Production Branch:** Şimdilik `main` kalabilir; preview için önemli olan feature branch deploy'udur.

---

## Adım 3 — Build komutu (öneri)

**Settings → General → Build & Development Settings** (ilk import sırasında da gösterilir):

### Önerilen tam komut

```bash
npx prisma generate && npx prisma migrate deploy && next build
```

### Neden?

| Parça | Açıklama |
|-------|----------|
| `prisma generate` | Prisma Client üretir. `package.json` içinde `postinstall` zaten `prisma generate` çalıştırır; tekrar etmek zararsızdır. |
| `prisma migrate deploy` | Bekleyen SQL migration'ları Neon'a uygular. **Neon direct (pooled olmayan) bağlantı** ister; pooled URL ile build sırasında migrate genelde başarısız olur. |
| `next build` | Next.js production build. |

### Pratik MVP seçimi (Day 1–2)

Neon `develop` üzerinde migration'ları **zaten yerelde** `npm run db:migrate:deploy` ile uyguladıysanız:

```bash
next build
```

yeterlidir (`postinstall` → `prisma generate`).

Her preview deploy'da otomatik migrate istiyorsanız:

1. Vercel Preview scope'ta `DATABASE_URL` = **pooled** (runtime için).
2. Ek değişken: `DIRECT_DATABASE_URL` = Neon **direct** connection string.
3. Build komutunu özelleştirin (ileride `package.json` `vercel-build` script ile):

```bash
npx prisma generate && DATABASE_URL="$DIRECT_DATABASE_URL" npx prisma migrate deploy && next build
```

> İlk sprint için **yerelde migrate + build'de sadece `next build`** en az sürtünmelidir.

**Install Command:** varsayılan `npm install` (veya proje `pnpm`/`yarn` kullanıyorsa ona göre).

---

## Adım 4 — Ortam değişkenleri (Preview scope)

**Project → Settings → Environment Variables**

Her satır için **Environment** kutusunda en az **Preview** işaretleyin. (Production'ı Day 3+ için ayrı tutun.)

| Değişken | Nereden alınır? | Placeholder / not |
|----------|-----------------|-------------------|
| `DATABASE_URL` | `.env.local` içindeki **yorum satırı** (Vercel Preview/Production — **POOLED**); veya Neon Console → `develop` → Connection Details → **Pooled** | `postgresql://USER:PASSWORD@ep-XXXX-pooler....neon.tech/neondb?sslmode=require&channel_binding=require` |
| `NEXTAUTH_SECRET` | `.env.local` → `NEXTAUTH_SECRET` (preview için aynı veya yeni `openssl rand -base64 32`) | `<gizli — panelde yapıştırın, sohbete yazmayın>` |
| `NEXTAUTH_URL` | İlk deploy **sonrası** preview URL | `https://tourtech-git-feat-neon-setup-....vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `NEXTAUTH_URL` ile **aynı** preview URL | Aynı |
| `JWT_SECRET` | `.env.local` → `JWT_SECRET` | `<gizli>` |
| `BCRYPT_SALT` | `.env.local` → `BCRYPT_SALT` (ör. `10`) | `10` |

**Opsiyonel (MVP'de boş bırakılabilir):** `RESEND_API_KEY`, `SMTP_*`, `GOOGLE_MAPS_API_KEY`

### Pooled vs direct hatırlatma

- **Vercel runtime (`DATABASE_URL`):** pooled (`-pooler` host).
- **Yerel migrate/seed:** direct host (`.env.local` içindeki aktif `DATABASE_URL` satırı — pooled değil).

Örnek host farkı (şifresiz):

- Direct: `ep-dry-block-asjm0qqi.c-4.eu-central-1.aws.neon.tech`
- Pooled: `ep-dry-block-asjm0qqi-pooler.c-4.eu-central-1.aws.neon.tech`

---

## Adım 5 — İlk deploy

1. Import sırasında veya **Deployments** üzerinden `feat/neon-setup` branch'ine deploy tetikleyin.
2. Build log'u açın:
   - [ ] `prisma generate` / `postinstall` hatasız
   - [ ] `next build` tamamlandı
3. Deploy **Ready** olunca **Visit** ile preview URL'yi açın.

---

## Adım 6 — URL env güncellemesi ve redeploy

NextAuth, cookie ve callback URL'leri için zorunlu:

1. Preview URL'yi kopyalayın (ör. `https://tourtech-xxx.vercel.app`).
2. **Settings → Environment Variables**:
   - `NEXTAUTH_URL` → preview URL
   - `NEXT_PUBLIC_APP_URL` → aynı preview URL
3. **Deployments** → son deployment → **⋯ → Redeploy** (sadece env değişikliği için).

---

## Adım 7 — Smoke test checklist

### Preview (Vercel)

- [ ] Ana sayfa HTTP 200, sayfa render oluyor
- [ ] Build log'da Prisma/DB bağlantı hatası yok
- [ ] `/login` açılıyor
- [ ] Seed yapıldıysa: `test.operator@tourtech.com` / `test123` ile partner girişi
- [ ] Tur/aktivite listesi boş değil (seed kontrolü)
- [ ] En az bir tur detay sayfası açılıyor

### Bilinen MVP dışı (şimdilik OK)

- Resend yoksa e-posta doğrulama gitmez
- Google Maps placeholder
- Firebase auth kullanılmıyor

---

## Sorun giderme

| Belirti | Kontrol |
|---------|---------|
| Build'de migrate fail | `DATABASE_URL` pooled mu? Yerelde migrate yaptınız mı veya `DIRECT_DATABASE_URL` kullanın |
| Login redirect loop | `NEXTAUTH_URL` preview URL ile birebir eşleşiyor mu + redeploy |
| `P1001` runtime | Preview'da `DATABASE_URL` pooled ve `sslmode=require` var mı |
| Boş liste | Neon `develop`'da `npm run db:seed` çalıştırıldı mı |

---

## `vercel.json` gerekli mi?

Hayır — build komutu ve env'ler panelden yeterli. Özel `vercel-build` script eklendiğinde isteğe bağlı eklenebilir.

---

## Day 1–2 tamamlanma

- [ ] `feat/neon-setup` origin'de
- [ ] Vercel projesi GitHub'a bağlı
- [ ] Preview env'ler tanımlı, URL güncellendi, redeploy yapıldı
- [ ] Smoke test geçti

**Sonraki:** Production branch + Neon `main`, custom domain ([NEON_DAY1-2.md](./NEON_DAY1-2.md) Day 3+).
