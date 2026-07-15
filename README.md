This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Dev server sorun giderme

Dev sunucusu "duruyor" gibi görünüyorsa genelde çökme değil, **birden fazla `next dev` örneği** veya **bozuk `.next` önbelleği** kaynaklıdır.

1. **Tek örnek çalıştırın** — Aynı anda birden fazla terminalde `npm run dev` açmayın.
2. **Çalışırken `.next` silmeyin** — `rm -rf .next` yalnızca sunucu kapalıyken yapılmalı.
3. **Temiz yeniden başlatma** — Sorun devam ederse:
   ```bash
   npm run dev:clean
   ```
   Bu komut önce mevcut dev süreçlerini durdurur, `.next` klasörünü siler ve sunucuyu yeniden başlatır.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker altyapı (local)

PostgreSQL, Redis, MinIO ve Mailhog şu compose dosyasından ayağa kalkar:

```bash
pnpm docker:up
# veya
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

### Redis `noeviction` politikası

BullMQ (email vb. kuyruk işleri) veriyi Redis’te tutar. Redis bellek dolunca key silerse kuyruk job’ları kaybolabilir.

Bu yüzden compose içinde Redis şöyle ayarlıdır:

```text
maxmemory-policy noeviction
```

| Policy        | Anlamı                                                                             |
| ------------- | ---------------------------------------------------------------------------------- |
| `allkeys-lru` | Bellek dolunca herhangi bir key silinebilir (cache için uygun, kuyruk için riskli) |
| `noeviction`  | Bellek dolunca key silinmez; yazma reddedilir (BullMQ için doğru seçim)            |

Compose dosyasını güncelledikten sonra ayarın container’a işlemesi için Redis’i yeniden başlatın:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d redis
```

Kontrol:

```bash
docker exec turladur-redis redis-cli CONFIG GET maxmemory-policy
# beklenen: noeviction
```

Not: Bu komut sadece Redis container’ını yeniler; API/web veya legacy uygulamayı bozmaz. DoD geçtikten sonra yapmak opsiyonel ama önerilir.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
