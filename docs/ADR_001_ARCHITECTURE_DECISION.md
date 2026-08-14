# ADR-001: Mimari Karar — Modüler Monolit vs Mikroservis

> **Tarih:** 2026-07-27  
> **Durum:** Kabul Edildi  
> **Karar Veren:** Geliştirme Ekibi  
> **Sonuç:** Modüler Monolit (mevcut yapı korunacak, evrim yolu ile ölçeklenecek)

---

## 1. Bağlam

Turta (TurlaDur) platformu şu anda **Nx monorepo** içinde **modüler monolit** mimaride çalışmaktadır:

```
turta/
├── apps/
│   ├── api/          → NestJS 11 (tek backend process)
│   └── web/          → Next.js 15 (tek frontend)
├── packages/
│   ├── shared-types/
│   ├── shared-validators/
│   └── shared-constants/
└── infrastructure/
```

**API modülleri (10 adet):**

| Modül          | Sorumluluk                             | Schema         |
| -------------- | -------------------------------------- | -------------- |
| `catalog`      | Tur, aktivite, otel, rota CRUD + arama | `catalog`      |
| `booking`      | Rezervasyon oluşturma/yönetim          | `booking`      |
| `payment`      | İyzico entegrasyonu, ödeme işleme      | `payment`      |
| `identity`     | Kullanıcı, partner, auth, sub-user     | `identity`     |
| `notification` | Email, SMS, push, WebSocket            | `notification` |
| `partner`      | Partner paneli, deneyim yönetimi       | (cross-schema) |
| `review`       | Yorum, puanlama                        | `review`       |
| `content`      | Blog, kategori, yorum                  | `content`      |
| `analytics`    | Platform istatistikleri                | (read-only)    |
| `admin`        | Admin paneli, onay akışları            | (cross-schema) |

**Mevcut mimari özellikler:**

- CQRS (Command/Query ayrımı)
- Event-driven modül iletişimi (EventEmitter2)
- Multi-schema PostgreSQL (domain sınırları DB seviyesinde)
- BullMQ background jobs (email, resim işleme, rapor)
- WebSocket gateway (real-time bildirim)
- Adapter pattern (ödeme, storage)
- Redis cache

---

## 2. Soru

> Mevcut **modüler monolit** yapı korunmalı mı, yoksa **mikroservise** geçilmeli mi?

---

## 3. Karşılaştırma

### 3.1 Modüler Monolit (Mevcut Yapı)

```
┌────────────────────────────────────────────┐
│              NestJS API (tek process)       │
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Catalog  │ │ Booking  │ │ Payment  │  │
│  │  Module  │ │  Module  │ │  Module  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │ event       │ event      │         │
│  ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐  │
│  │ Identity │ │  Review  │ │  Notif.  │  │
│  │  Module  │ │  Module  │ │  Module  │  │
│  └──────────┘ └──────────┘ └──────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │          Shared Core                  │  │
│  │  (DB, Cache, Queue, Auth, Storage)    │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
         │
    PostgreSQL (multi-schema) + Redis
```

| Avantaj               | Açıklama                                           |
| --------------------- | -------------------------------------------------- |
| Basit deployment      | Tek container/process — Railway'de tek servis      |
| Hızlı geliştirme      | Tüm kod tek repo, tek `pnpm dev`, tek debug        |
| Kolay refactoring     | Module sınırını değiştirmek = dosya taşımak        |
| Transaction güvenliği | Booking + Payment aynı DB transaction'da           |
| Düşük latency         | Modüller arası iletişim = in-process function call |
| Ucuz altyapı          | 1 Railway instance + 1 PostgreSQL + 1 Redis        |
| Basit test            | Tek test suite, E2E kolay                          |
| Hata ayıklama         | Tek log stream, stack trace bütün                  |

| Dezavantaj             | Açıklama                                 |
| ---------------------- | ---------------------------------------- |
| Tek hata noktası       | Bir modül çökerse tüm API çöker          |
| Dikey ölçekleme sınırı | Tek process RAM/CPU sınırına takılabilir |
| Deploy coupling        | Catalog güncellemesi = tüm API restart   |
| Büyük codebase         | 500K+ satır olunca navigasyon zorlaşır   |

---

### 3.2 Mikroservis Mimarisi (Alternatif)

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Catalog  │  │ Booking  │  │ Payment  │  │ Identity │
│ Service  │  │ Service  │  │ Service  │  │ Service  │
│  :4001   │  │  :4002   │  │  :4003   │  │  :4004   │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │              │              │              │
     └──────────────┴──────────────┴──────────────┘
                         │
              ┌──────────┴──────────┐
              │    API Gateway      │
              │   (Kong / Traefik)  │
              │      :4000          │
              └──────────┬──────────┘
                         │
              ┌──────────┴──────────┐
              │   Message Broker    │
              │  (RabbitMQ / Kafka) │
              └─────────────────────┘
                         │
     ┌───────────────────┼───────────────────┐
     │                   │                   │
┌────┴────┐       ┌─────┴─────┐       ┌────┴────┐
│ Notif.  │       │  Review   │       │ Content │
│ Service │       │  Service  │       │ Service │
│  :4005  │       │  :4006    │       │  :4007  │
└─────────┘       └───────────┘       └─────────┘
```

| Avantaj             | Açıklama                                     |
| ------------------- | -------------------------------------------- |
| Bağımsız deploy     | Her servis ayrı ayrı deploy edilebilir       |
| Bağımsız ölçekleme  | Catalog yoğunsa sadece onu scale et          |
| Hata izolasyonu     | Payment çökse Catalog çalışmaya devam eder   |
| Teknoloji özgürlüğü | Her servis farklı dil/framework kullanabilir |
| Ekip bağımsızlığı   | 10 kişilik ekipler paralel çalışabilir       |

| Dezavantaj                  | Açıklama                                                                     |
| --------------------------- | ---------------------------------------------------------------------------- |
| **Operasyonel karmaşıklık** | Service discovery, load balancing, circuit breaker, health checks × N servis |
| **Distributed transaction** | Booking + Payment → Saga pattern gerekir (compensating transactions)         |
| **Veri tutarsızlığı riski** | Eventual consistency — "ödeme alındı ama booking oluşmadı" senaryosu         |
| **Network latency**         | Her modül arası çağrı = HTTP/gRPC round-trip (ms → 10ms+)                    |
| **Debugging kabusu**        | Hata 5 servis arasında → distributed tracing (Jaeger/Zipkin) zorunlu         |
| **Altyapı maliyeti**        | 7+ container, API gateway, message broker, monitoring × N                    |
| **Geliştirme hızı düşer**   | Her değişiklik birden fazla repo/servis etkiler → koordinasyon               |
| **Test karmaşıklığı**       | Integration test = tüm servisleri ayağa kaldır → Docker Compose + wait       |
| **DevOps uzmanlığı**        | Kubernetes, Helm charts, service mesh (Istio) → ayrı bir iş                  |

---

## 4. Turta İçin Analiz

### 4.1 Mevcut Durum

| Kriter                 | Değer                           |
| ---------------------- | ------------------------------- |
| Ekip büyüklüğü         | 1-3 geliştirici                 |
| Proje aşaması          | Pre-production (beta hazırlığı) |
| Kullanıcı sayısı       | 0 (henüz canlıya çıkmadı)       |
| Trafik tahmini (6 ay)  | < 1000 günlük aktif             |
| Trafik tahmini (1 yıl) | < 10K günlük aktif              |
| Bütçe                  | Startup / sınırlı               |
| Operasyon kapasitesi   | DevOps ekibi yok                |

### 4.2 Mevcut Yapının Güçlü Yanları

Turta'nın modüler monoliti zaten mikroservis'in avantajlarının çoğunu karşılıyor:

| Mikroservis Avantajı     | Turta'da Nasıl Karşılanıyor?                      |
| ------------------------ | ------------------------------------------------- |
| Domain izolasyonu        | ✅ NestJS modülleri + multi-schema PostgreSQL     |
| Bağımsız geliştirme      | ✅ Modüller birbirinin service'ini import etmiyor |
| Loosely coupled          | ✅ Event-driven iletişim (EventEmitter2)          |
| CQRS                     | ✅ Command/Query handler ayrımı mevcut            |
| Scalable background jobs | ✅ BullMQ worker'ları ayrı scale edilebilir       |
| Type-safe contract       | ✅ `@turta/shared-types` + `shared-validators`    |
| Bağımsız test            | ✅ Her modül kendi test suite'i olabilir          |

### 4.3 "Turta'da Mikroservis Geçişi" Maliyet Tahmini

| Gereksinim                      | Tahmini Efor                    | Mevcut Alternatif          |
| ------------------------------- | ------------------------------- | -------------------------- |
| API Gateway (Kong/Traefik)      | 2-3 gün kurulum + sürekli bakım | Yok — tek endpoint         |
| Service Discovery               | 1-2 gün                         | Yok — tek process          |
| Distributed Tracing (Jaeger)    | 2-3 gün                         | Tek log stream yeterli     |
| Saga Pattern (booking+payment)  | 5-7 gün                         | DB transaction (anında)    |
| Message Broker (RabbitMQ/Kafka) | 2-3 gün                         | EventEmitter2 (in-process) |
| Per-service Dockerfile          | 7× 0.5 gün = 3.5 gün            | Tek Dockerfile             |
| Kubernetes/Docker Compose       | 3-5 gün                         | Railway tek deploy         |
| CI/CD per service               | 7× 1 gün = 7 gün                | Tek pipeline               |
| Health checks × 7               | 2 gün                           | Tek `/health` endpoint     |
| **Toplam geçiş maliyeti**       | **~30-40 gün**                  | —                          |
| **Aylık infra maliyeti artışı** | **+$100-300/ay**                | Mevcut: ~$30-50/ay         |

### 4.4 Ne Zaman Mikroservise Geçilmeli?

| Tetikleyici             | Eşik Değer                                        | Aksiyon                                       |
| ----------------------- | ------------------------------------------------- | --------------------------------------------- |
| API response time (p95) | > 500ms sürekli                                   | Önce: Redis cache, DB index, horizontal scale |
| CPU/RAM limiti          | Container max hit                                 | Önce: Daha büyük instance (vertical scale)    |
| Tek modül darboğaz      | Catalog aramaları diğerlerini yavaşlatıyor        | **O modülü** ayrı servis yap                  |
| Ekip büyüklüğü          | > 8 backend developer                             | Modül sahipliği → service sahipliği           |
| Deploy frekansı         | Günde 10+ deploy, birbirini bekliyor              | Bağımsız deploy ihtiyacı                      |
| Farklı SLA              | Payment %99.99, Content %99 yeterli               | Payment'ı ayrı, daha güvenilir infra'ya taşı  |
| Farklı scaling profili  | Catalog: read-heavy 100x; Booking: write-heavy 1x | Ayrı ölçekleme                                |

---

## 5. Karar

### **Modüler Monolit korunacak. Yapı değiştirilmeyecek.**

Gerekçe:

1. **Erken optimizasyon tuzağı** — Henüz 0 kullanıcı var. Mikroservis'in çözdüğü sorunlar (ölçek, ekip koordinasyonu) mevcut değil.

2. **Mevcut yapı zaten "microservice-ready"** — Modül sınırları, event iletişimi, schema ayrımı sayesinde gelecekte herhangi bir modül **kodu değiştirmeden** ayrı NestJS app olarak deploy edilebilir.

3. **Hız > Mimari saflık** — Startup aşamasında hızlı iterate etmek, kullanıcı geri bildirimi almak, pivot yapabilmek kritik. Mikroservis bunu yavaşlatır.

4. **Operasyonel yük** — DevOps ekibi olmadan 7+ servis, API gateway, message broker yönetmek sürdürülebilir değil.

5. **Maliyet** — Startup bütçesiyle aylık $200-400 ekstra infra maliyeti mantıksız.

---

## 6. Evrim Yolu (Kademeli Geçiş Planı)

Proje büyüdükçe **adım adım** geçiş yapılacak. Sıfırdan yeniden yazım YOK.

### Aşama 0: Mevcut (0-50K kullanıcı) — ŞİMDİ

```
[ Tek NestJS ] → [ PostgreSQL + Redis ]
```

- Tek Railway/Fly.io instance
- Horizontal Pod Autoscaler yeterli (2-4 replica)
- BullMQ worker'lar aynı process veya ayrı worker instance

### Aşama 1: Yatay Ölçekleme (50K-200K kullanıcı)

```
[ NestJS ×3 ] → Load Balancer → [ PostgreSQL (+ Read Replica) + Redis Cluster ]
[ BullMQ Worker ×2 ] (ayrı process — email/image)
```

**Ne değişir:**

- Railway'de instance sayısı artırılır (auto-scale)
- PostgreSQL read replica eklenir (arama sorguları replica'ya yönlenir)
- BullMQ worker'lar ayrı container'da çalışır (CPU-intensive işler ana API'yi etkilemez)
- Redis → Redis Cluster (daha fazla bağlantı, daha fazla cache)

**Kod değişikliği:** Minimum — sadece DB connection config (read/write split)

### Aşama 2: Modül Çıkarma (200K-500K kullanıcı)

```
[ API Gateway (Traefik) ]
        │
   ┌────┴────────────┬──────────────┐
   │                 │              │
[ Main API ]   [ Catalog API ]  [ Notification Worker ]
(booking,      (arama+detay,    (email, SMS, push
 payment,       yoğun read)      — ayrı scale)
 identity)
```

**Hangisi önce çıkar?**

| Modül          | Çıkarma Önceliği | Neden                                                                |
| -------------- | ---------------- | -------------------------------------------------------------------- |
| `notification` | 1. (en kolay)    | Stateless, sadece event dinler → queue consumer                      |
| `catalog`      | 2. (en faydalı)  | Read-heavy, arama yoğun, cache'lenebilir — Elasticsearch eklenebilir |
| `payment`      | 3. (kritik SLA)  | %99.99 uptime gereksinimi, bağımsız izleme                           |
| Diğerleri      | Gerekirse        | Ekip büyürse, domain ownership ile                                   |

**Nasıl çıkarılır (catalog örneği):**

```bash
# 1. Yeni NestJS app oluştur
nx generate @nx/nest:application catalog-api

# 2. Mevcut catalog modülünü taşı (dosya kopyala)
cp -r apps/api/src/modules/catalog apps/catalog-api/src/

# 3. Event iletişimini EventEmitter → RabbitMQ/Redis Pub-Sub'a çevir
#    (EventEmitter2 yerine @nestjs/microservices transport)

# 4. Ana API'den catalog modülünü kaldır
#    Gateway/proxy ekle: /api/v1/catalog/* → catalog-api:4001

# 5. Aynı PostgreSQL, catalog schema'sına sadece catalog-api erişir
```

**Kod değişikliği:**

- EventEmitter2 → `@nestjs/microservices` (Redis/RabbitMQ transport)
- API Gateway routing eklenir
- Shared types değişmez (zaten ayrı paket)

### Aşama 3: Tam Dağıtık (500K+ kullanıcı — 1-2 yıl sonra)

```
[ API Gateway ]
       │
  ┌────┼────────┬──────────┬──────────┬──────────┐
  │    │        │          │          │          │
[Cat] [Book] [Pay]    [Identity] [Notif]    [Review]
  │    │        │          │          │          │
  └────┼────────┴──────────┴──────────┴──────────┘
       │
[ Message Broker (Kafka/RabbitMQ) ]
       │
[ PostgreSQL per-service ] + [ Elasticsearch ] + [ Redis Cluster ]
```

**Ek altyapı:**

- Kubernetes (orkestrasyon)
- Kafka (event streaming — audit log, analytics)
- Elasticsearch (catalog arama, full-text)
- Distributed tracing (Jaeger/OpenTelemetry)
- Service mesh (Istio — mTLS, canary deploy)

**Bu aşama sadece şu koşullarda gerekli:**

- 10+ backend developer
- Günde 1M+ request
- Farklı modüller farklı SLA'lara ihtiyaç duyuyor
- Organizasyonel ölçek (5+ takım aynı anda çalışıyor)

---

## 7. Şu An Yapılması Gerekenler (Yapıyı Bozmadan)

Mevcut modüler monolit yapıyı **gelecekte kolay çıkarılabilir** hale getirmek için:

### 7.1 Zaten Yapılmış ✅

| Kural                                          | Durum                                              |
| ---------------------------------------------- | -------------------------------------------------- |
| Modüller birbirinin service'ini import etmiyor | ✅ (event type'ları paylaşılır ama service DI yok) |
| Event-driven inter-module communication        | ✅ EventEmitter2 (booking → catalog event dinler)  |
| Multi-schema DB (domain boundary)              | ✅ catalog, booking, payment, identity, content    |
| CQRS pattern                                   | ✅ Command/Query handlers                          |
| Shared types ayrı paket                        | ✅ `@turta/shared-types`                           |
| Adapter pattern (payment, storage)             | ✅                                                 |
| Response standardı                             | ✅ `{ success, data, error, meta }`                |

### 7.2 Güçlendirilebilir (Sprint 25'e eklenebilir)

| #   | İyileştirme                                                                            | Efor     | Fayda                                      |
| --- | -------------------------------------------------------------------------------------- | -------- | ------------------------------------------ |
| M1  | **Module boundary lint rule** — Nx `enforce-module-boundaries` aktifleştir             | 1 saat   | Yanlışlıkla cross-module import'u engeller |
| M2  | **Event contract tipi** — Event payload'ları `shared-types`'a taşı                     | 2-3 saat | Servis çıkarıldığında contract değişmez    |
| M3  | **Interface-first service export** — Modül dışına sadece interface expose et           | 4-6 saat | Implementasyon gizli, contract net         |
| M4  | **Health check per-module** — Her modül kendi health'ini raporlasın                    | 2 saat   | Darboğaz tespiti kolaylaşır                |
| M5  | **Module-level metrics** — Request count/latency per module (Prometheus)               | 4 saat   | Hangi modül yavaş → ilk çıkarma adayı      |
| M6  | **BullMQ worker ayrı process** — `apps/api-worker/` olarak çalıştırılabilir hale getir | 4-6 saat | İlk "çıkarma" denemesi, zero-risk          |

### 7.3 Yapılmaması Gerekenler ❌

| Yapma                       | Neden                                            |
| --------------------------- | ------------------------------------------------ |
| Şimdi API Gateway ekleme    | Tek servis var, gereksiz hop                     |
| Şimdi Kafka/RabbitMQ ekleme | EventEmitter2 yeterli, operasyonel yük ekler     |
| Servisleri ayırma           | Henüz ölçek sorunu yok                           |
| gRPC ekleme                 | HTTP/REST yeterli, ekstra complexity             |
| Per-service database        | Multi-schema zaten domain boundary veriyor       |
| Kubernetes                  | Railway/Fly.io yeterli, K8s öğrenme eğrisi büyük |

---

## 8. Karar Özeti

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   KARAR: Modüler Monolit KORUNACAK                         │
│                                                             │
│   ✓ Yapı değiştirilmeyecek                                │
│   ✓ Mevcut module boundaries güçlendirilecek              │
│   ✓ İlk ölçekleme = horizontal (replica artır)            │
│   ✓ İlk modül çıkarma = notification (en kolay, en safe)  │
│   ✓ Çıkarma kararı = metrik bazlı (p95 > 500ms tetikler) │
│                                                             │
│   NE ZAMAN TEKRAR DEĞERLENDİRİLECEK?                      │
│   → 50K+ aktif kullanıcı veya                              │
│   → 5+ backend developer veya                              │
│   → p95 response time sürekli > 500ms                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Referans: Benzer Projeler Ne Yapıyor?

| Proje       | Aşama             | Mimari                    | Not                                              |
| ----------- | ----------------- | ------------------------- | ------------------------------------------------ |
| Shopify     | Başlangıç → IPO   | Modüler Monolit (Ruby)    | 10+ yıl monolit kaldı, sonra kademeli ayrıştırma |
| GitHub      | 2008-2020         | Monolit                   | 12 yıl tek Rails app, sonra kısmi servis çıkarma |
| Airbnb      | 2008-2016         | Monolit → SOA             | 8 yıl monolit, 1000+ mühendis olunca ayrıştırdı  |
| Booking.com | Başlangıç → Ölçek | Monolit → Perl servisleri | Trafik zorladığında kademeli geçiş               |
| Basecamp    | 2004-bugün        | Monolit                   | 20 yıl, hâlâ monolit, küçük ekip                 |
| Linear      | 2019-bugün        | Monolit                   | Modern startup, bilinçli monolit tercihi         |

**Pattern:** Başarılı projeler monolit ile başlar, **ihtiyaç olduğunda** kademeli olarak ayrıştırır. Hiçbiri "0 kullanıcıda mikroservis" ile başlamamış.

---

## 10. Sonuç

Turta'nın mevcut mimarisi **doğru karar.** Nedenleri:

1. **Modüler monolit ≠ spagetti monolit.** Modül sınırları, event'ler ve schema ayrımı ile zaten "mikroservis zihniyetinde" ama tek process'te çalışıyor.

2. **Mikroservis bir hedef değil, bir araç.** Ölçek sorunu olmadan uygulamak = gereksiz karmaşıklık + yavaş geliştirme + yüksek maliyet.

3. **Yapı bozulmadan evrim mümkün.** NestJS modülleri → bağımsız NestJS app'lere dönüştürme, mevcut event yapısı sayesinde doğal ve düşük riskli.

4. **Önce ürünü lansmanla.** Sprint 24'te production'a çık, gerçek kullanıcı verisi topla, **darboğazı ölç**, sonra optimize et.

> _"Premature optimization is the root of all evil"_ — Donald Knuth
>
> _"Start with a monolith. Extract when it hurts."_ — Martin Fowler

---

## Ek: Bu Dokümanı Ne Zaman Güncelle?

- [ ] İlk 10K kullanıcıya ulaşıldığında → metrikleri ekle
- [ ] p95 > 300ms olduğunda → Aşama 1 planını detaylandır
- [ ] 5+ backend developer olduğunda → modül sahipliğini tanımla
- [ ] İlk modül çıkarıldığında → deneyimi dokümante et
