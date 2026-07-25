# Sprint Sonu Test Senaryoları — Manuel & Otomasyon

> **İki katmanlı test:**
>
> 1. **Cursor (otomasyon):** Sprint bittikten sonra browser ile otomatik kontrol eder, sonucu raporlar
> 2. **Ekip (manuel):** Bu dosyadaki senaryoları adım adım takip eder, sonuç sütununu doldurur
>
> **Ortam:** API → `localhost:4000` | Web → `localhost:3001` | Legacy → `localhost:3000`

---

## Nasıl Kullanılır?

### Cursor (Otomatik):

```
Sprint görevi bittiğinde:
1. pnpm dev:apps çalıştır
2. İlgili sprint test tablosunu browser ile çalıştır
3. Her satır için PASS/FAIL belirle
4. FAIL varsa düzelt, tekrar test et
5. Tüm PASS → sprint tamamlanmış say
6. Raporu kullanıcıya sun
```

### Ekip (Manuel):

```
Sprint tesliminden sonra:
1. git pull → pnpm install → pnpm dev:apps
2. İlgili sprint bölümüne git
3. Her senaryo satırını adım adım uygula
4. "Sonuç" sütununu doldur: ✅ / ❌ + not
5. ❌ olan maddeler için bug raporu aç
6. Tüm ✅ → QA onay ver
```

---

---

# SPRINT 19 — DB Birleştirme Testleri

## Ön Koşullar

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
pnpm --filter api prisma:deploy
pnpm --filter api prisma:seed
pnpm dev:api
```

## S19-T01: API Health Check

| Adım | İşlem                                               | Beklenen                                        | Sonuç |
| ---- | --------------------------------------------------- | ----------------------------------------------- | ----- |
| 1    | Tarayıcıda `http://localhost:4000/api/v1/health` aç | JSON response görünüyor                         |       |
| 2    | Response body kontrol et                            | `status: "ok"` ve `database: "up"` alanları var |       |
| 3    | HTTP status code                                    | 200                                             |       |

## S19-T02: Swagger UI

| Adım | İşlem                                | Beklenen                                                       | Sonuç |
| ---- | ------------------------------------ | -------------------------------------------------------------- | ----- |
| 1    | `http://localhost:4000/api/docs` aç  | Swagger UI yükleniyor                                          |       |
| 2    | Endpoint gruplarını kontrol et       | Catalog, Identity, Booking, Payment, Review, Content görünüyor |       |
| 3    | `GET /catalog/tours` endpoint'ini aç | Schema ve parametreler görünüyor                               |       |
| 4    | "Try it out" ile çalıştır            | 200 response + tur listesi                                     |       |

## S19-T03: Veritabanı Tabloları

| Adım | İşlem                                       | Beklenen                                                                      | Sonuç |
| ---- | ------------------------------------------- | ----------------------------------------------------------------------------- | ----- |
| 1    | `cd apps/api && npx prisma studio` çalıştır | Prisma Studio tarayıcıda açılıyor                                             |       |
| 2    | Sol panelden tabloları kontrol et           | 22 tablo listeleniyor                                                         |       |
| 3    | Schema'ları kontrol et                      | identity, catalog, booking, payment, review, notification, analytics, content |       |
| 4    | User tablosuna tıkla                        | Seed verisi görünüyor (en az 1 admin, 1 partner, 1 customer)                  |       |
| 5    | Tour tablosuna tıkla                        | Seed turları görünüyor (başlık, fiyat, kategori dolu)                         |       |
| 6    | Experience tablosuna tıkla                  | Seed aktiviteler görünüyor                                                    |       |
| 7    | Post tablosuna tıkla                        | Blog yazıları görünüyor                                                       |       |

## S19-T04: Seed Verisi Doğrulama

| Adım | İşlem                                     | Beklenen                                   | Sonuç |
| ---- | ----------------------------------------- | ------------------------------------------ | ----- |
| 1    | `GET /api/v1/catalog/tours/search?page=1` | 200 + en az 3 tur                          |       |
| 2    | `GET /api/v1/catalog/experiences?page=1`  | 200 + en az 2 aktivite                     |       |
| 3    | `GET /api/v1/content/posts`               | 200 + en az 3 blog yazısı                  |       |
| 4    | Tur başlıkları Türkçe mi?                 | "Kapadokya Balon Turu" gibi Türkçe isimler |       |
| 5    | Fiyatlar TRY mi?                          | currency: "TRY", price > 0                 |       |

---

---

# SPRINT 20 — API Modülleri Testleri

## Ön Koşullar

```bash
pnpm dev:api  # localhost:4000 çalışıyor
# Seed verisi yüklenmiş olmalı
```

## S20-T01: Catalog — Tur Arama

| Adım | İşlem                                                         | Beklenen                                | Sonuç |
| ---- | ------------------------------------------------------------- | --------------------------------------- | ----- |
| 1    | `GET /api/v1/catalog/tours/search?page=1`                     | 200 + tur listesi                       |       |
| 2    | `GET /api/v1/catalog/tours/search?category=CULTURAL`          | Sadece kültür turları                   |       |
| 3    | `GET /api/v1/catalog/tours/search?minPrice=500&maxPrice=2000` | Fiyat aralığında turlar                 |       |
| 4    | `GET /api/v1/catalog/tours/search?q=Kapadokya`                | Arama sonuçları                         |       |
| 5    | `GET /api/v1/catalog/tours/search?sort=price_asc`             | Ucuzdan pahalıya                        |       |
| 6    | `GET /api/v1/catalog/tours/:id` (geçerli ID)                  | 200 + tur detayı (dates, partner dahil) |       |
| 7    | `GET /api/v1/catalog/tours/invalid-id`                        | 404 Not Found                           |       |

## ~~S20-T02: Catalog — Hotel & Room~~ (KAPSAM DISI — otel satisi yok)

> Bu site tur acentelerinin birlestigi bir platform. Otel satisi YOKTUR.
> Hotel/Room API endpoint'leri backend'de teknik olarak mevcut ama frontend'te kulllanilmaz.

## S20-T03: Catalog — Experience/Activity

| Adım | İşlem                                       | Beklenen                                               | Sonuç |
| ---- | ------------------------------------------- | ------------------------------------------------------ | ----- |
| 1    | `GET /api/v1/catalog/experiences?page=1`    | 200 + aktivite listesi                                 |       |
| 2    | `GET /api/v1/catalog/experiences/:id`       | 200 + detay (dates dahil)                              |       |
| 3    | `GET /api/v1/catalog/experiences/:id/dates` | 200 + müsait tarihler                                  |       |
| 4    | Tarih objesi kontrol                        | startDate, endDate, price, availableSeats alanları var |       |

## S20-T04: Catalog — Route (Rota)

| Adım | İşlem                            | Beklenen                         | Sonuç |
| ---- | -------------------------------- | -------------------------------- | ----- |
| 1    | `GET /api/v1/catalog/routes`     | 200 + rota listesi               |       |
| 2    | `GET /api/v1/catalog/routes/:id` | 200 + detay + eşleşen turlar     |       |
| 3    | Response'da istatistik var mı?   | tourCount, totalDays, priceRange |       |

## S20-T05: Identity — Auth Akışı

| Adım | İşlem                                               | Beklenen                | Sonuç |
| ---- | --------------------------------------------------- | ----------------------- | ----- |
| 1    | `POST /api/v1/identity/register` (email + password) | 201 + user oluştu       |       |
| 2    | `POST /api/v1/identity/login` (doğru credentials)   | 200 + JWT access token  |       |
| 3    | `POST /api/v1/identity/login` (yanlış şifre)        | 401 Unauthorized        |       |
| 4    | `GET /api/v1/identity/me` (Bearer token)            | 200 + kullanıcı bilgisi |       |
| 5    | `GET /api/v1/identity/me` (token yok)               | 401 Unauthorized        |       |

## S20-T06: Identity — Partner

| Adım | İşlem                                                     | Beklenen                       | Sonuç |
| ---- | --------------------------------------------------------- | ------------------------------ | ----- |
| 1    | `POST /api/v1/identity/partners/register` (firma bilgisi) | 201 + partner oluştu (PENDING) |       |
| 2    | `POST /api/v1/identity/login` (partner email)             | 200 + token (role: PARTNER)    |       |
| 3    | `GET /api/v1/identity/partners/:id/users` (auth)          | 200 + SubUser listesi          |       |

## S20-T07: Booking — Rezervasyon

| Adım | İşlem                                                      | Beklenen                            | Sonuç |
| ---- | ---------------------------------------------------------- | ----------------------------------- | ----- |
| 1    | `POST /api/v1/booking/reservations` (tourDateId + misafir) | 201 + rezervasyon oluştu            |       |
| 2    | Response'da bookingNumber var mı?                          | Benzersiz, 8-12 karakter            |       |
| 3    | `GET /api/v1/booking/reservations/me` (auth)               | 200 + kullanıcının rezervasyonları  |       |
| 4    | `POST /api/v1/booking/reservations` (activityDateId)       | 201 + aktivite rezervasyonu         |       |
| 5    | Eksik alan ile gönder (tourDateId yok)                     | 400 Bad Request + validation hatası |       |

## S20-T08: Content — Blog

| Adım | İşlem                                    | Beklenen                           | Sonuç |
| ---- | ---------------------------------------- | ---------------------------------- | ----- |
| 1    | `GET /api/v1/content/posts`              | 200 + yayınlanmış postlar          |       |
| 2    | `GET /api/v1/content/posts/:slug`        | 200 + post detay (content, author) |       |
| 3    | `GET /api/v1/content/categories`         | 200 + kategori listesi             |       |
| 4    | `GET /api/v1/content/posts/:id/comments` | 200 + yorum listesi                |       |

## S20-T09: Admin Endpoint'leri

| Adım | İşlem                                         | Beklenen               | Sonuç |
| ---- | --------------------------------------------- | ---------------------- | ----- |
| 1    | `GET /api/v1/admin/agencies` (admin token)    | 200 + acente listesi   |       |
| 2    | `PATCH /api/v1/admin/agencies/:id/approve`    | 200 + status: APPROVED |       |
| 3    | `GET /api/v1/admin/agencies` (customer token) | 403 Forbidden          |       |

## S20-T10: Swagger Tam Doküman

| Adım | İşlem                                   | Beklenen                          | Sonuç |
| ---- | --------------------------------------- | --------------------------------- | ----- |
| 1    | `http://localhost:4000/api/docs` aç     | UI yükleniyor                     |       |
| 2    | Her grup (tag) altında endpoint var mı? | Boş grup yok                      |       |
| 3    | Request body schema'ları tanımlı mı?    | DTO'lar görünüyor                 |       |
| 4    | Response example'lar var mı?            | 200, 201, 400, 401, 404 örnekleri |       |

---

---

# SPRINT 21 — Frontend Marketing + Customer Testleri

## Ön Koşullar

```bash
pnpm dev:apps  # web:3001 + api:4000 çalışıyor
# Seed verisi yüklenmiş olmalı
```

## S21-T01: Ana Sayfa

| Adım | İşlem                                 | Beklenen                                             | Sonuç |
| ---- | ------------------------------------- | ---------------------------------------------------- | ----- |
| 1    | `http://localhost:3001` aç            | Sayfa yükleniyor, beyaz ekran yok                    |       |
| 2    | Hero banner                           | Görsel + başlık + CTA butonu görünüyor               |       |
| 3    | CTA butonu tıkla                      | /tours veya /routes'a yönlendiriyor                  |       |
| 4    | Aşağı scroll et                       | Featured turlar, destinasyonlar, stats bölümleri var |       |
| 5    | Tur kartına tıkla                     | /tours/[id] sayfasına gidiyor                        |       |
| 6    | "Konaklama", "Oteller", "Press" linki | OLMAMALI — bu site tur platformu, otel/press yok     |       |
| 7    | Console'u aç (F12)                    | Kırmızı hata yok (4xx/5xx request yok)               |       |
| 8    | Viewport 375px yap                    | Responsive: stack layout, hamburger menü             |       |

## S21-T02: Tur Listesi

| Adım | İşlem                                    | Beklenen                                  | Sonuç |
| ---- | ---------------------------------------- | ----------------------------------------- | ----- |
| 1    | `http://localhost:3001/tours` aç         | Tur kartları görünüyor                    |       |
| 2    | Arama input'una "Kapadokya" yaz          | Filtrelenmiş sonuçlar                     |       |
| 3    | Kategori filtresine tıkla (örn: Kültür)  | Sadece kültür turları                     |       |
| 4    | Sıralama değiştir (fiyat artan)          | Ucuzdan pahalıya sıra                     |       |
| 5    | Bir tur kartına tıkla                    | /tours/[id] detay sayfası açılıyor        |       |
| 6    | Kart üzerinde: başlık, fiyat, süre, puan | Hepsi görünüyor, okunabilir               |       |
| 7    | Viewport 375px                           | Kartlar tek kolon, filtreler erişilebilir |       |

## S21-T03: Tur Detay

| Adım | İşlem                                              | Beklenen                                              | Sonuç |
| ---- | -------------------------------------------------- | ----------------------------------------------------- | ----- |
| 1    | `http://localhost:3001/tours/[id]` aç (geçerli ID) | Detay sayfası yükleniyor                              |       |
| 2    | Galeri/görsel                                      | En az 1 görsel var, slider/lightbox çalışıyor         |       |
| 3    | Başlık + meta bilgi                                | Tur adı, süre, kategori, partner adı                  |       |
| 4    | Fiyat                                              | ₺X.XXX formatında, "kişi başı" etiketi                |       |
| 5    | Program/itinerary                                  | Gün gün program görünüyor                             |       |
| 6    | Dahil olanlar                                      | Liste (✓ ikonlu)                                      |       |
| 7    | Tarih seçici                                       | Müsait tarihler gösteriliyor                          |       |
| 8    | Bir tarih seç                                      | Fiyat güncelleniyor (override varsa)                  |       |
| 9    | "Rezerve Et" butonu tıkla                          | /checkout sayfasına yönlendiriyor (tarih bilgisi ile) |       |
| 10   | BottomBookingBar                                   | Fixed alt bar: fiyat + buton (mobilde de)             |       |
| 11   | Page source kontrol et                             | `<title>`, `<meta description>`, OG tags var          |       |
| 12   | Geçersiz ID ile aç                                 | 404 sayfası veya "Tur bulunamadı"                     |       |

## S21-T04: Aktivite Listesi + Detay

| Adım | İşlem                                 | Beklenen                                    | Sonuç |
| ---- | ------------------------------------- | ------------------------------------------- | ----- |
| 1    | `http://localhost:3001/activities` aç | Aktivite kartları görünüyor                 |       |
| 2    | Kategori tabına tıkla                 | Filtreleme çalışıyor                        |       |
| 3    | Bir karta tıkla → detay               | `/activities/[id]` açılıyor                 |       |
| 4    | Detay: başlık, lokasyon, süre, fiyat  | Hepsi görünüyor                             |       |
| 5    | Tarih seçici                          | Müsait tarihler + fiyat                     |       |
| 6    | "Rezerve Et" → checkout               | Checkout'a activityDateId ile yönlendiriyor |       |
| 7    | Açıklama (long description)           | Tam metin görünüyor                         |       |
| 8    | Highlights listesi                    | Öne çıkan özellikler                        |       |

## S21-T05: Rota Listesi + Detay

| Adım | İşlem                                        | Beklenen                      | Sonuç |
| ---- | -------------------------------------------- | ----------------------------- | ----- |
| 1    | `http://localhost:3001/routes` aç            | Rota kartları görünüyor       |       |
| 2    | Kart üzerinde: isim, istatistik (tur sayısı) | Görünüyor                     |       |
| 3    | Bir rotaya tıkla → detay                     | `/routes/[id]` açılıyor       |       |
| 4    | Detay: açıklama + eşleşen turlar             | Tur kartları listeleniyor     |       |
| 5    | Eşleşen tur kartına tıkla                    | /tours/[id] sayfasına gidiyor |       |

## S21-T06: Blog

| Adım | İşlem                                    | Beklenen                       | Sonuç |
| ---- | ---------------------------------------- | ------------------------------ | ----- |
| 1    | `http://localhost:3001/blog` aç          | Blog post kartları görünüyor   |       |
| 2    | Bir posta tıkla                          | `/blog/[slug]` açılıyor        |       |
| 3    | Post detay: başlık, içerik, tarih, yazar | Hepsi görünüyor, format düzgün |       |
| 4    | SEO: title ve meta description           | Page source'da var             |       |

## S21-T07: Checkout + Odeme + Voucher + OTP Akisi

### A) Checkout Formu

| Adim | Islem                               | Beklenen                                  | Sonuc |
| ---- | ----------------------------------- | ----------------------------------------- | ----- |
| 1    | Tur detaydan "Rezerve Et" tikla     | Checkout sayfasi aciliyor                 |       |
| 2    | Tur bilgisi ozeti gorunuyor         | Tur adi, tarih, fiyat                     |       |
| 3    | Misafir bilgileri formu             | Ad, soyad, TC, telefon, email             |       |
| 4    | "Misafir Ekle" tikla                | Ikinci misafir formu aciliyor             |       |
| 5    | Fatura bilgileri                    | Adres, sehir, posta kodu alanlari         |       |
| 6    | Zorunlu alanlari bos birak → submit | Validation hatalari gorunuyor (kirmizi)   |       |
| 7    | Tum alanlari doldur → "Odemeye Gec" | Odeme adimina ilerliyor                   |       |
| 8    | Fiyat ozeti sidebar                 | Kisi sayisi x birim fiyat = toplam        |       |
| 9    | Ayni akisi aktivite ile dene        | activityDateId ile checkout calisiyor     |       |
| 10   | Viewport 375px                      | Form kullanilabilir, sidebar alta geciyor |       |

### B) OTP Dogrulama (Telefon/Email)

| Adim | Islem                                        | Beklenen                                     | Sonuc |
| ---- | -------------------------------------------- | -------------------------------------------- | ----- |
| 11   | Checkout'ta telefon/email gir → "Kod Gonder" | OTP kodu gonderiliyor (SMS veya email)       |       |
| 12   | Mailhog/SMS log'da kodu kontrol et           | 6 haneli kod mevcut                          |       |
| 13   | Dogru kodu gir                               | Dogrulama basarili → odeme adimina gecis     |       |
| 14   | Yanlis kod gir (3 kez)                       | Hata mesaji + "Tekrar gonder" butonu aktif   |       |
| 15   | Surelim (2dk) gecince kod gir                | "Kod suresi doldu" mesaji + yeniden gonderme |       |
| 16   | "Tekrar Gonder" tikla                        | Yeni kod gonderiliyor (eski gecersiz)        |       |

### C) Odeme (Iyzico 3D Secure)

| Adim | Islem                           | Beklenen                                         | Sonuc |
| ---- | ------------------------------- | ------------------------------------------------ | ----- |
| 17   | Kart bilgileri formu            | Kart no, son kullanim, CVV, kart sahibi alanlari |       |
| 18   | Test karti gir (Iyzico sandbox) | Form kabul ediyor                                |       |
| 19   | "Ode" tikla                     | 3D Secure sayfasi aciliyor                       |       |
| 20   | 3D Secure'da "Onayla"           | Odeme isleniyor (loading)                        |       |
| 21   | Basarili odeme                  | Basari sayfasi/mesaji gorunuyor                  |       |
| 22   | Hatali kart ile dene            | "Odeme basarisiz" mesaji + tekrar dene butonu    |       |
| 23   | Yetersiz bakiye karti           | "Yetersiz bakiye" hatasi                         |       |

### D) Odeme Sonrasi — Voucher/Bilet Gonderimi

| Adim | Islem                           | Beklenen                                                         | Sonuc |
| ---- | ------------------------------- | ---------------------------------------------------------------- | ----- |
| 24   | Odeme basarili → Basari sayfasi | Rezervasyon no, ozet bilgi, "Voucher Indir" butonu               |       |
| 25   | "Voucher Indir" tikla           | PDF voucher indiriliyor veya yeni sekmede aciliyor               |       |
| 26   | Voucher icerigi kontrol et      | Tur adi, tarih, misafir isimleri, rezervasyon no, QR kod (varsa) |       |
| 27   | Email kontrol (Mailhog)         | Onay emaili + voucher eki gonderilmis                            |       |
| 28   | Email icerigi                   | Tur bilgisi, tarih, toplam ucret, rezervasyon no                 |       |
| 29   | SMS bildirimi (log kontrol)     | "Rezervasyonunuz onaylandi" SMS'i                                |       |
| 30   | Rezervasyonlarim sayfasi        | Yeni rezervasyon listede, status: CONFIRMED                      |       |
| 31   | Rezervasyon detay tikla         | Voucher tekrar indirilebilir                                     |       |

### E) Partner Tarafinda Bildirim

| Adim | Islem                          | Beklenen                                     | Sonuc |
| ---- | ------------------------------ | -------------------------------------------- | ----- |
| 32   | Partner login → rezervasyonlar | Yeni rezervasyon gorunuyor                   |       |
| 33   | Bildirim bell                  | "Yeni rezervasyon" bildirimi                 |       |
| 34   | Rezervasyonu onayla/reddet     | Status degisiyor, musteriye bildirim gidiyor |       |

## S21-T08: Login/Register

| Adım | İşlem                                 | Beklenen                             | Sonuç |
| ---- | ------------------------------------- | ------------------------------------ | ----- |
| 1    | `http://localhost:3001/login` aç      | Login formu görünüyor                |       |
| 2    | Geçerli email + şifre gir → submit    | Başarılı giriş → ana sayfa/profil    |       |
| 3    | Yanlış şifre ile dene                 | Hata mesajı (kırmızı)                |       |
| 4    | "Kayıt Ol" linkine tıkla              | /register sayfasına gidiyor          |       |
| 5    | Register: email + şifre + ad → submit | Hesap oluşuyor → login'e yönlendirme |       |
| 6    | "Şifremi Unuttum" linki               | /forgot-password sayfası açılıyor    |       |
| 7    | Forgot: email gir → submit            | Başarı mesajı (veya simülasyon)      |       |

## S21-T09: Profil

| Adım | İşlem                        | Beklenen                                     | Sonuç |
| ---- | ---------------------------- | -------------------------------------------- | ----- |
| 1    | Login olmadan `/profile` git | Login sayfasına yönlendirme                  |       |
| 2    | Login ol → `/profile` aç     | Profil sayfası görünüyor                     |       |
| 3    | Kişisel bilgiler tab         | Ad, soyad, email, telefon (dolu)             |       |
| 4    | Bilgi güncelle → kaydet      | Başarı mesajı, veri güncellendi              |       |
| 5    | Yorumlarım tab               | Yorum listesi (varsa) veya "henüz yorum yok" |       |

## S21-T10: Header/Footer/Genel

| Adım | İşlem                              | Beklenen                                       | Sonuç |
| ---- | ---------------------------------- | ---------------------------------------------- | ----- |
| 1    | Header: nav linkleri               | Turlar, Aktiviteler, Rotalar, Blog — çalışıyor |       |
| 2    | Header: "Konaklama" linki          | OLMAMALI                                       |       |
| 3    | Footer: tüm linkler                | Çalışıyor, 404 veren yok                       |       |
| 4    | Footer: "Otel" veya "Press" linki  | OLMAMALI                                       |       |
| 5    | Mobil hamburger menü               | Açılıyor, linkler çalışıyor                    |       |
| 6    | Herhangi bir sayfada console error | Kırmızı error olmamalı                         |       |

---

---

# SPRINT 22 — Partner + Admin Panel Testleri

## Ön Koşullar

```bash
pnpm dev:apps
# Partner hesabı: partner@test.com / Test1234!
# Admin hesabı: admin@test.com / Test1234!
```

## S22-T01: Partner Giriş

| Adım | İşlem                          | Beklenen                                                      | Sonuç |
| ---- | ------------------------------ | ------------------------------------------------------------- | ----- |
| 1    | `/login` → partner email/şifre | Başarılı giriş                                                |       |
| 2    | Yönlendirme                    | `/partner/dashboard` açılıyor                                 |       |
| 3    | Sidebar menü                   | Tüm linkler görünüyor (tours, experiences, reservations, vb.) |       |

## S22-T02: Partner Dashboard

| Adım | İşlem                   | Beklenen                             | Sonuç |
| ---- | ----------------------- | ------------------------------------ | ----- |
| 1    | `/partner/dashboard` aç | Yükleniyor, beyaz ekran yok          |       |
| 2    | İstatistik kartları     | Toplam tur, rezervasyon, gelir, puan |       |
| 3    | Gelir grafiği           | Chart render ediliyor (Recharts)     |       |
| 4    | Son rezervasyonlar      | Liste/tablo görünüyor                |       |
| 5    | Popüler turlar          | Tur kartları/listesi                 |       |

## S22-T03: Partner — Tur Oluşturma (Tam Akış)

| Adım | İşlem                                                  | Beklenen                                                                           | Sonuç |
| ---- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----- |
| 1    | `/partner/tours/new` aç                                | Tur oluşturma formu                                                                |       |
| 2    | Başlık gir: "Test Kapadokya Turu"                      | Input doluyor                                                                      |       |
| 3    | Açıklama gir (uzun metin)                              | Textarea çalışıyor                                                                 |       |
| 4    | Kategori seç: CULTURAL                                 | Dropdown/select çalışıyor                                                          |       |
| 5    | Fiyat gir: 2500                                        | Sayısal input                                                                      |       |
| 6    | Süre gir: 3 gün                                        | Input                                                                              |       |
| 7    | Görsel yükle (drag-drop veya dosya seç)                | Preview görünüyor                                                                  |       |
| 8    | Tarih ekle: 2026-08-01 → 2026-08-03, kapasite: 20      | Tarih listesine ekleniyor                                                          |       |
| 9    | İkinci tarih ekle                                      | Birden fazla tarih olabiliyor                                                      |       |
| 10   | Pickup point ekle: İstanbul, Taksim, 08:00             | Listeye ekleniyor                                                                  |       |
| 11   | Yaş aralığı ekle: 0-6 yaş, FREE                        | Listeye ekleniyor                                                                  |       |
| 12   | Konaklama bilgisi (tur paketi icindeki): otel adi, tip | Form alanlari calisiyor (NOT: bu otel satisi degil, tur icindeki konaklama detayi) |       |
| 13   | "Kaydet" tıkla                                         | Başarı mesajı → tur listesine yönlendirme                                          |       |
| 14   | Tur listesinde yeni tur görünüyor                      | Evet, status: DRAFT                                                                |       |

## S22-T04: Partner — Tur Düzenleme

| Adım | İşlem                                 | Beklenen                      | Sonuç |
| ---- | ------------------------------------- | ----------------------------- | ----- |
| 1    | Tur listesinden bir tura tıkla → edit | Düzenleme formu açılıyor      |       |
| 2    | Mevcut veriler dolu geliyor           | Başlık, fiyat, vb. pre-filled |       |
| 3    | Başlığı değiştir → kaydet             | Güncelleme başarılı           |       |
| 4    | Tarih sil/ekle                        | CRUD çalışıyor                |       |
| 5    | Pickup point sil/ekle                 | CRUD çalışıyor                |       |

## S22-T05: Partner — Deneyim CRUD

| Adım | İşlem                                                                   | Beklenen                   | Sonuç |
| ---- | ----------------------------------------------------------------------- | -------------------------- | ----- |
| 1    | `/partner/experiences` aç                                               | Deneyim listesi            |       |
| 2    | "Yeni Deneyim" tıkla                                                    | Form açılıyor              |       |
| 3    | Tüm alanları doldur (başlık, açıklama, kategori, lokasyon, süre, fiyat) | Alanlar çalışıyor          |       |
| 4    | Tarih ekle (ActivityDate)                                               | Tarih + fiyat + kapasite   |       |
| 5    | Kaydet                                                                  | Başarı → listede görünüyor |       |
| 6    | Düzenle                                                                 | Mevcut veri dolu geliyor   |       |

## S22-T06: Partner — Diğer Sayfalar

| Adım | İşlem                                  | Beklenen                   | Sonuç |
| ---- | -------------------------------------- | -------------------------- | ----- |
| 1    | `/partner/reservations`                | Rezervasyon tablosu        |       |
| 2    | Rezervasyon status değiştir (onay/red) | Güncelleniyor              |       |
| 3    | `/partner/financials`                  | Gelir grafikleri           |       |
| 4    | `/partner/users`                       | SubUser listesi            |       |
| 5    | SubUser ekle (isim, email, izin)       | Başarılı ekleme            |       |
| 6    | `/partner/settings`                    | Profil/firma bilgisi formu |       |
| 7    | Bilgi güncelle → kaydet                | Başarı mesajı              |       |
| 8    | `/partner/reviews`                     | Gelen yorum listesi        |       |

## S22-T07: Admin Giriş + Dashboard

| Adım | İşlem                        | Beklenen                    | Sonuç |
| ---- | ---------------------------- | --------------------------- | ----- |
| 1    | `/login` → admin email/şifre | Başarılı giriş              |       |
| 2    | Yönlendirme                  | `/admin/dashboard` açılıyor |       |
| 3    | Dashboard kartları/grafikler | Platform istatistikleri     |       |

## S22-T08: Admin — Kullanıcı & Tur Yönetimi

| Adım | İşlem                       | Beklenen                                  | Sonuç |
| ---- | --------------------------- | ----------------------------------------- | ----- |
| 1    | `/admin/users`              | Kullanıcı tablosu (ad, email, rol, durum) |       |
| 2    | `/admin/tours`              | Tur listesi + pending onay tabı           |       |
| 3    | Pending tura "Onayla" tıkla | Status → PUBLISHED                        |       |
| 4    | `/admin/agencies`           | Acente listesi                            |       |
| 5    | Acenteye "Onayla" tıkla     | Status → APPROVED                         |       |
| 6    | `/admin/content`            | Blog yazıları yönetimi                    |       |

## S22-T09: Bildirim Sistemi

| Adım | İşlem                                   | Beklenen                                | Sonuç |
| ---- | --------------------------------------- | --------------------------------------- | ----- |
| 1    | Header'daki bell/bildirim ikonuna tıkla | Dropdown açılıyor                       |       |
| 2    | Bildirim listesi                        | Varsa bildirimler, yoksa "bildirim yok" |       |
| 3    | Bir bildirime tıkla                     | İlgili sayfaya yönlendirme              |       |

---

---

# SPRINT 23 — UI Parity + Legacy Kaldırma + Entegrasyon Testleri

## Ön Koşullar

```bash
pnpm dev:apps  # Sadece yeni sistem çalışıyor (legacy yok)
```

## S23-T01: Legacy Yok Kontrolü

| Adım | İşlem                                | Beklenen                                | Sonuç |
| ---- | ------------------------------------ | --------------------------------------- | ----- |
| 1    | `http://localhost:3000` aç           | Bağlantı reddedildi (ECONNREFUSED)      |       |
| 2    | `app/` klasörünü kontrol et          | Dosya OLMAMALI (silinmiş)               |       |
| 3    | Root `prisma/schema.prisma`          | OLMAMALI                                |       |
| 4    | Root `lib/`, `components/`, `hooks/` | OLMAMALI                                |       |
| 5    | `pnpm dev` → ne olur?                | `pnpm dev:apps` alias'ına yönlendirmeli |       |

## S23-T02: Yeni Sistem Tam Çalışıyor

| Adım | İşlem                               | Beklenen                          | Sonuç |
| ---- | ----------------------------------- | --------------------------------- | ----- |
| 1    | `http://localhost:3001`             | Ana sayfa yükleniyor              |       |
| 2    | `/tours`                            | Tur listesi + filtre + arama      |       |
| 3    | `/activities`                       | Aktivite listesi + kategori       |       |
| 4    | `/routes`                           | Rota kartları                     |       |
| 5    | `/blog`                             | Blog listesi                      |       |
| 6    | `/login` → customer                 | Giriş başarılı → profil/ana sayfa |       |
| 7    | `/login` → partner                  | Giriş → `/partner/dashboard`      |       |
| 8    | `/login` → admin                    | Giriş → `/admin/dashboard`        |       |
| 9    | `/checkout` (tur seçilmiş)          | Checkout akışı çalışıyor          |       |
| 10   | API: `localhost:4000/api/v1/health` | `{ status: "ok" }`                |       |

## S23-T03: İyzico Ödeme (Sandbox)

| Adım | İşlem                                    | Beklenen                   | Sonuç |
| ---- | ---------------------------------------- | -------------------------- | ----- |
| 1    | Tur seç → checkout → bilgileri doldur    | Ödeme adımına gelindi      |       |
| 2    | Test kart bilgileri gir (İyzico sandbox) | 3D Secure sayfası açılıyor |       |
| 3    | 3D Secure'da "Onayla"                    | Ödeme başarılı mesajı      |       |
| 4    | Rezervasyon status                       | CONFIRMED oldu             |       |
| 5    | Hatalı kart ile dene                     | Ödeme başarısız mesajı     |       |

## S23-T04: Email Bildirim

| Adım | İşlem                            | Beklenen                              | Sonuç |
| ---- | -------------------------------- | ------------------------------------- | ----- |
| 1    | Başarılı rezervasyon yap         | Email gönderildi                      |       |
| 2    | Mailhog UI aç (`localhost:8025`) | Yeni email görünüyor                  |       |
| 3    | Email içeriği                    | Tur adı, tarih, fiyat, rezervasyon no |       |

## S23-T05: Build & Lint

| Adım | İşlem                      | Beklenen                               | Sonuç |
| ---- | -------------------------- | -------------------------------------- | ----- |
| 1    | `pnpm build:apps` çalıştır | Exit code 0, hata yok                  |       |
| 2    | `pnpm lint` çalıştır       | Lint hatası yok (veya önemsiz warning) |       |
| 3    | `pnpm test` çalıştır       | Test suite geçiyor                     |       |

## S23-T06: E2E Smoke Test

| Adım | İşlem                                     | Beklenen                   | Sonuç |
| ---- | ----------------------------------------- | -------------------------- | ----- |
| 1    | Register → yeni hesap oluştur             | Hesap oluştu               |       |
| 2    | Login → profil kontrol                    | Profil bilgileri görünüyor |       |
| 3    | Tur ara → detay aç → tarih seç → checkout | Akış tamamlanıyor          |       |
| 4    | Misafir bilgileri doldur → ödeme          | İyzico form açılıyor       |       |
| 5    | Partner login → tur oluştur               | Yeni tur oluştu            |       |
| 6    | Admin login → turu onayla                 | Status: PUBLISHED          |       |
| 7    | Frontend'de yeni tur görünüyor            | Tur listesinde mevcut      |       |

---

---

# SPRINT 24 — Production Testleri

## Ön Koşullar

```
Production deploy tamamlanmış:
- turta.com çalışıyor
- api.turta.com çalışıyor
```

## S24-T01: Production Erişim

| Adım | İşlem                                 | Beklenen                           | Sonuç |
| ---- | ------------------------------------- | ---------------------------------- | ----- |
| 1    | `https://turta.com`                   | Ana sayfa, SSL aktif (yeşil kilit) |       |
| 2    | `https://api.turta.com/api/v1/health` | `{ status: "ok" }`                 |       |
| 3    | `https://api.turta.com/api/docs`      | Swagger UI                         |       |

## S24-T02: Production E2E

| Adım | İşlem                      | Beklenen                       | Sonuç |
| ---- | -------------------------- | ------------------------------ | ----- |
| 1    | Register (gerçek email)    | Hesap oluştu                   |       |
| 2    | Login                      | Başarılı                       |       |
| 3    | Tur ara                    | Sonuçlar geliyor               |       |
| 4    | Tur detay                  | Sayfa yükleniyor, SEO meta var |       |
| 5    | Checkout → ödeme (sandbox) | Çalışıyor                      |       |
| 6    | Partner register → verify  | Partner hesabı aktif           |       |

## S24-T03: Performance & SEO

| Adım | İşlem                             | Beklenen         | Sonuç |
| ---- | --------------------------------- | ---------------- | ----- |
| 1    | Chrome Lighthouse → Performance   | > 85             |       |
| 2    | Chrome Lighthouse → SEO           | > 90             |       |
| 3    | Chrome Lighthouse → Accessibility | > 85             |       |
| 4    | API response time (p95)           | < 200ms          |       |
| 5    | Mobil Lighthouse (375px)          | Performance > 80 |       |

## S24-T04: Güvenlik

| Adım | İşlem                                          | Beklenen                       | Sonuç |
| ---- | ---------------------------------------------- | ------------------------------ | ----- |
| 1    | Rate limiting: 100+ request/dk                 | 429 Too Many Requests          |       |
| 2    | SQL injection dene (input'a `' OR 1=1`)        | Hata yok, injection çalışmıyor |       |
| 3    | XSS dene (input'a `<script>alert(1)</script>`) | Sanitize edilmiş, çalışmıyor   |       |
| 4    | Auth token olmadan admin endpoint              | 401 Unauthorized               |       |
| 5    | CORS: farklı domain'den request                | Reddediliyor                   |       |
| 6    | HTTPS zorunlu                                  | HTTP → HTTPS redirect          |       |

## S24-T05: Monitoring

| Adım | İşlem                                 | Beklenen                         | Sonuç |
| ---- | ------------------------------------- | -------------------------------- | ----- |
| 1    | Sentry dashboard                      | Entegrasyon aktif, event geliyor |       |
| 2    | Kasıtlı hata üret (geçersiz endpoint) | Sentry'de görünüyor              |       |
| 3    | Uptime/health check                   | Monitoring aktif, alert tanımlı  |       |

---

---

## Cursor Otomasyon Kuralı (workflow-checklist'e referans)

Her sprint tamamlandığında Cursor şunları yapar:

```
1. İlgili sprint test bölümünü oku
2. pnpm dev:apps çalıştır (veya gerekli servisler)
3. Browser ile her test satırını çalıştır:
   - URL aç → yükleniyor mu?
   - Beklenen element var mı?
   - API call 200 dönüyor mu?
   - Console'da hata var mı?
4. Sonuçları rapor et:
   ✅ PASS: X / Y test geçti
   ❌ FAIL: [liste + açıklama]
5. FAIL varsa → düzelt → tekrar test et
6. Tüm PASS → "Sprint X testi tamamlandı" raporu ver
```

**Ekip sonrası:**

- Cursor raporunu incele
- Manuel testleri (yukarıdaki senaryolar) uygula
- Sonuç sütunlarını doldur
- Tüm ✅ → Sprint kapanır, bir sonrakine geç
