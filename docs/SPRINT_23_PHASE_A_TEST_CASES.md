# Sprint 23 — Faz A Parity Test Cases

> **Amaç:** Her ekranın legacy ile birebir aynı olduğunu doğrulamak  
> **Ortam:** Legacy → `localhost:3000` | Yeni → `localhost:3001` | API → `localhost:4000`  
> **Kural:** UI değişmemeli — sadece veri kaynağı (Nest API) değişebilir

---

## Nasıl Test Edilir?

1. Her iki sistemi aynı anda çalıştır (`pnpm dev` legacy + `pnpm dev:apps` yeni)
2. Test tablosundaki her satır için **her iki URL'yi** aç
3. Side-by-side karşılaştır (split screen veya iki tarayıcı)
4. Sonuç sütununu doldur: ✅ PASS / ❌ FAIL + açıklama
5. FAIL olan her madde için fix PR açılır

---

## TC-A: Marketing + Customer Sayfaları (23.0a)

### TC-A1: Ana Sayfa

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A1.1 | Hero banner görünüyor | `localhost:3000` | `localhost:3001` | Hero görseli, başlık, alt başlık, CTA butonu aynı mı? | |
| A1.2 | Featured turlar | " | " | Kart sayısı, kart tasarımı, fiyat gösterimi aynı mı? | |
| A1.3 | Destinasyonlar bölümü | " | " | Şehir kartları, görsel, isim aynı mı? | |
| A1.4 | İstatistikler | " | " | Rakamlar, ikonlar, başlıklar aynı mı? | |
| A1.5 | Testimonials/Yorumlar | " | " | Yorum kartları, avatar, isim, puan aynı mı? | |
| A1.6 | Newsletter bölümü | " | " | Input + buton, metin aynı mı? | |
| A1.7 | Hot deals / kampanya | " | " | Kampanya banner'ı görünüyor mu? Aynı mı? | |
| A1.8 | CTA butonları çalışıyor | " | " | Tıklayınca doğru sayfaya gidiyor mu? | |
| A1.9 | Mobil (375px) | " | " | Stack düzeni, hamburger, hero responsive mi? | |

### TC-A2: Tur Listesi

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A2.1 | Sayfa yükleniyor | `/tours` | `/tours` | Beyaz ekran yok, kartlar görünüyor | |
| A2.2 | Tur kartları tasarımı | " | " | Kart boyutu, gölge, border-radius, hover efekti | |
| A2.3 | Fiyat gösterimi | " | " | Format (₺1.500 gibi), konum, font size | |
| A2.4 | Puan/yıldız | " | " | Yıldız rengi, sayı formatı | |
| A2.5 | Kategori filtreleri | " | " | Filtre butonları/tabları aynı mı? | |
| A2.6 | Arama input | " | " | Placeholder, ikon, genişlik | |
| A2.7 | Sıralama dropdown | " | " | Seçenekler aynı mı? (fiyat, puan, tarih) | |
| A2.8 | Süre badge | " | " | "3 Gün 2 Gece" formatı, badge stili | |
| A2.9 | Featured badge | " | " | Öne çıkan rozeti görünüyor mu? | |
| A2.10 | Pagination | " | " | Sayfa numaraları, aktif sayfa stili | |
| A2.11 | Boş sonuç | " | " | Arama sonuç yoksa mesaj aynı mı? | |
| A2.12 | Mobil (375px) | " | " | Grid → tek kolon, kart genişliği | |

### TC-A3: Tur Detay

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A3.1 | Hero/galeri | `/tour/[id]` | `/tours/[id]` | Görsel slider, thumbnail'lar | |
| A3.2 | Başlık + meta | " | " | Tur adı, süre, kategori, partner adı | |
| A3.3 | Fiyat kutusu | " | " | Fiyat, "kişi başı", buton stili | |
| A3.4 | Açıklama | " | " | Metin, format, uzunluk | |
| A3.5 | Itinerary/program | " | " | Gün gün program, accordion/tab yapısı | |
| A3.6 | Dahil/hariç listesi | " | " | İkon + metin listesi | |
| A3.7 | Konaklama bilgisi (tur paketi icindeki) | " | " | Tur icindeki konaklama detayi (otel satisi degil) | |
| A3.8 | Kalkış noktaları | " | " | Şehir, saat, lokasyon | |
| A3.9 | Tarih seçici | " | " | Takvim UI, müsait tarihler | |
| A3.10 | Yaş aralığı fiyatları | " | " | Tablo: yaş grubu → fiyat | |
| A3.11 | Yorumlar bölümü | " | " | Yorum kartları, puan dağılımı | |
| A3.12 | BottomBookingBar | " | " | Sabit alt bar: fiyat + "Rezerve Et" butonu | |
| A3.13 | SEO (title, OG) | " | " | Page source → meta tags | |
| A3.14 | Mobil (375px) | " | " | Galeri swipe, bar fixed bottom | |

### TC-A4: Aktivite Listesi

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A4.1 | Sayfa yükleniyor | `/activities` | `/activities` | Kartlar görünüyor | |
| A4.2 | Kategori tabları | " | " | Tab isimleri, aktif tab stili | |
| A4.3 | Aktivite kartları | " | " | Kart tasarımı, görsel, başlık, fiyat | |
| A4.4 | Lokasyon gösterimi | " | " | Şehir/bölge bilgisi | |
| A4.5 | Süre bilgisi | " | " | "2 Saat", "Yarım Gün" formatı | |
| A4.6 | Filtre/arama | " | " | Input + kategori filtreleri | |
| A4.7 | Mobil (375px) | " | " | Grid → tek kolon | |

### TC-A5: Aktivite Detay

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A5.1 | Hero görsel | `/activities/[id]` | `/activities/[id]` | Görsel, galeri | |
| A5.2 | Başlık + meta | " | " | Ad, kategori, lokasyon, süre | |
| A5.3 | Fiyat | " | " | Format, konum | |
| A5.4 | Açıklama (long) | " | " | Tam açıklama metni | |
| A5.5 | Dahil/hariç | " | " | Liste formatı | |
| A5.6 | Highlights | " | " | Öne çıkan özellikler | |
| A5.7 | Tarih seçici | " | " | Müsait tarihler, fiyat/tarih | |
| A5.8 | Buluşma noktası | " | " | Adres, harita (varsa) | |
| A5.9 | Yaş kısıtlaması | " | " | Uyarı metni | |
| A5.10 | Rezervasyon CTA | " | " | Buton stili, konum | |
| A5.11 | Mobil (375px) | " | " | Layout, buton | |

### TC-A6: Rota Listesi

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A6.1 | Sayfa yükleniyor | `/routes` | `/routes` | Rota kartları görünüyor | |
| A6.2 | Kart tasarımı | " | " | Görsel, başlık, istatistik | |
| A6.3 | İstatistik bilgisi | " | " | Tur sayısı, gün, fiyat aralığı | |
| A6.4 | Filtre | " | " | Varsa filtre UI | |
| A6.5 | Mobil (375px) | " | " | Grid düzeni | |

### TC-A7: Rota Detay

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A7.1 | Hero/banner | `/routes/[id]` | `/routes/[id]` | Görsel, başlık | |
| A7.2 | Rota açıklaması | " | " | Metin | |
| A7.3 | Eşleşen turlar | " | " | Tur kartları listesi | |
| A7.4 | İstatistikler | " | " | Toplam gün, fiyat aralığı | |
| A7.5 | Mobil (375px) | " | " | Layout | |

### TC-A8: Blog

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A8.1 | Blog listesi | `/blog` | `/blog` | Post kartları, tarih, excerpt | |
| A8.2 | Blog detay | `/blog/[slug]` | `/blog/[slug]` | İçerik, yazar, tarih, görsel | |
| A8.3 | Kategori filtre | " | " | Varsa kategori tabları | |
| A8.4 | SEO meta | " | " | title, description, OG image | |

### TC-A9: Checkout

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A9.1 | Tur checkout açılıyor | `/checkout?tourDateId=X` | `/checkout?tourDateId=X` | Sayfa yükleniyor | |
| A9.2 | Aktivite checkout | `/checkout?activityDateId=X` | `/checkout?activityDateId=X` | Sayfa yükleniyor | |
| A9.3 | Misafir bilgileri formu | " | " | Ad, soyad, TC, telefon, email alanları | |
| A9.4 | Multi-guest (birden fazla) | " | " | Ek misafir ekleme butonu + formları | |
| A9.5 | Fatura bilgileri | " | " | Adres, şehir, posta kodu alanları | |
| A9.6 | Fiyat özeti sidebar | " | " | Ürün adı, fiyat, toplam, vergi | |
| A9.7 | Özel istekler textarea | " | " | Special requests alanı | |
| A9.8 | Ödeme butonu | " | " | "Ödemeye Geç" butonu, stili | |
| A9.9 | Validation hataları | " | " | Boş alan uyarıları aynı mı? | |
| A9.10 | Mobil (375px) | " | " | Form layout, sidebar alt'a mı geçiyor? | |
| A9.11 | OTP doğrulama | " | " | Telefon/email OTP input, "Kod Gönder" butonu | |
| A9.12 | OTP süre sayacı | " | " | Geri sayım (2dk), süre dolunca "Tekrar Gönder" | |
| A9.13 | OTP doğru kod | " | " | Doğrulama başarılı → ödeme adımına geçiş | |
| A9.14 | Ödeme formu (İyzico) | " | " | Kart no, SKT, CVV, kart sahibi | |
| A9.15 | 3D Secure | " | " | Banka doğrulama sayfası açılıyor | |
| A9.16 | Başarılı ödeme → sonuç | " | " | Başarı sayfası: rezervasyon no, özet | |
| A9.17 | Voucher indirme | " | " | "Voucher İndir" butonu → PDF açılıyor | |
| A9.18 | Voucher içeriği | " | " | Tur adı, tarih, misafirler, QR kod, rez. no | |
| A9.19 | Onay emaili | " | " | Mailhog'da: tur bilgi + voucher eki | |
| A9.20 | SMS bildirimi | " | " | "Rezervasyonunuz onaylandı" SMS | |

### TC-A10: Profil

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A10.1 | Profil sayfası açılıyor | `/profile` | `/profile` | Auth korumalı, login yönlendirmesi | |
| A10.2 | Kişisel bilgiler tab | " | " | Ad, soyad, email, telefon formu | |
| A10.3 | TC Kimlik alanı | " | " | 11 haneli TC input | |
| A10.4 | Fatura bilgileri | " | " | Adres formu | |
| A10.5 | Şifre değiştirme | " | " | Eski/yeni şifre formu | |
| A10.6 | Yorumlarım tab | " | " | Yapılan yorumlar listesi | |
| A10.7 | Favorilerim tab | " | " | ⚠️ Legacy'de var mı? Varsa port | |
| A10.8 | Bildirimler tab | " | " | ⚠️ Legacy'de var mı? Varsa port | |
| A10.9 | Tab navigasyonu | " | " | Tab geçişleri çalışıyor mu? | |
| A10.10 | Mobil (375px) | " | " | Tab'lar scroll/dropdown oluyor mu? | |

### TC-A11: Bookings (Rezervasyonlarım)

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A11.1 | Liste görünüyor | `/bookings` | `/bookings` | Rezervasyon kartları | |
| A11.2 | Status badge | " | " | Renk kodları (onaylı=yeşil, beklemede=sarı) | |
| A11.3 | Detay modal/sayfa | " | " | Rezervasyon detayı açılıyor mu? | |
| A11.4 | Tur vs aktivite ayrımı | " | " | Tip ikonu/etiketi var mı? | |
| A11.5 | Boş durum | " | " | Rezervasyon yoksa mesaj | |

### TC-A12: Statik Sayfalar

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| A12.1 | About sayfası | `/about` | `/about` | İçerik, görsel, layout | |
| A12.2 | Contact sayfası | `/contact` | `/contact` | Form alanları, harita (varsa) | |
| A12.3 | Campaigns | `/campaigns` | `/campaigns` | Kampanya kartları/içerik | |
| A12.4 | Careers | `/careers` | `/careers` | İlan listesi/içerik | |

---

## TC-B: Auth Sayfaları (23.0b)

| # | Test | Legacy URL | Yeni URL | Kontrol | Sonuç |
|---|------|-----------|----------|---------|-------|
| B1 | Login formu | `/login` | `/login` | Email + şifre input, "Giriş Yap" butonu, sosyal login (varsa) | |
| B2 | Login hata mesajı | " | " | Yanlış şifre → hata gösterimi aynı mı? | |
| B3 | "Şifremi unuttum" linki | " | " | Link çalışıyor, doğru sayfaya gidiyor | |
| B4 | Register formu | `/register` | `/register` | Ad, email, şifre, telefon alanları | |
| B5 | Register validation | " | " | Email format, şifre uzunluk hataları | |
| B6 | Forgot password | `/forgot-password` | `/forgot-password` | Email input + gönder butonu | |
| B7 | Partner login | `/partner-login` | `/partner-login` | Email + şifre, partner spesifik UI | |
| B8 | Partner register | `/partner-register` | `/partner-register` | Firma adı, vergi no, email, şifre | |
| B9 | Partner verification | `/partner-verification` | `/partner-verification` | Token giriş veya otomatik verify | |
| B10 | Auth redirect | Login sonrası | Login sonrası | Doğru sayfaya yönleniyor mu? | |
| B11 | Mobil (375px) | Tüm auth | Tüm auth | Form genişliği, input boyutları | |

---

## TC-C: Partner Panel (23.0c)

### TC-C1: Partner Dashboard

| # | Test | Yeni URL | Kontrol | Sonuç |
|---|------|----------|---------|-------|
| C1.1 | Dashboard yükleniyor | `/partner/dashboard` | İstatistik kartları görünüyor | |
| C1.2 | Stat kartları | " | Toplam tur, rezervasyon, gelir, puan | |
| C1.3 | Revenue chart | " | Grafik çiziliyor (Recharts) | |
| C1.4 | Son rezervasyonlar | " | Tablo/liste görünüyor | |
| C1.5 | Popüler turlar | " | Tur kartları | |
| C1.6 | Quick access kartları | " | Hızlı erişim butonları | |

### TC-C2: Partner Tur Yönetimi

| # | Test | Yeni URL | Kontrol | Sonuç |
|---|------|----------|---------|-------|
| C2.1 | Tur listesi | `/partner/tours` | Tablo: ad, durum, fiyat, tarih | |
| C2.2 | Tur oluşturma formu | `/partner/tours/new` | Tüm alanlar: başlık, açıklama, fiyat, kategori, süre | |
| C2.3 | Görsel yükleme | " | Drag-drop veya dosya seçici çalışıyor | |
| C2.4 | Tarih ekleme | " | TourDate: başlangıç, bitiş, kapasite, fiyat override | |
| C2.5 | Pickup point ekleme | " | Şehir, lokasyon, saat, sıra | |
| C2.6 | Yaş aralığı ekleme | " | Min/max yaş, fiyatlandırma tipi, değer | |
| C2.7 | Konaklama bilgisi (tur paketi) | " | Tur icindeki konaklama: ad, lokasyon, tip (otel satisi degil) | |
| C2.8 | Tur düzenleme | `/partner/tours/[id]/edit` | Mevcut veriler form'da dolu geliyor | |
| C2.9 | Tur detay görüntüleme | `/partner/tours/[id]` | Readonly detay sayfası | |
| C2.10 | Form validation | " | Zorunlu alan hataları | |
| C2.11 | Kaydet/güncelle | " | Başarılı kayıt sonrası bildirim | |

### TC-C3: Partner Deneyim Yönetimi

| # | Test | Yeni URL | Kontrol | Sonuç |
|---|------|----------|---------|-------|
| C3.1 | Deneyim listesi | `/partner/experiences` | Tablo görünüyor | |
| C3.2 | Deneyim oluşturma | `/partner/experiences/new` | Form: başlık, açıklama, kategori, lokasyon, süre, fiyat | |
| C3.3 | Tarih ekleme | " | ActivityDate: tarih, fiyat, kapasite | |
| C3.4 | Deneyim düzenleme | `/partner/experiences/[id]/edit` | Mevcut veri form'da | |

### TC-C4: Partner Diğer Sayfalar

| # | Test | Yeni URL | Kontrol | Sonuç |
|---|------|----------|---------|-------|
| C4.1 | Rezervasyonlar | `/partner/reservations` | Liste + status değiştirme | |
| C4.2 | Finansal raporlar | `/partner/financials` | Gelir grafikleri, özet tablo | |
| C4.3 | Alt kullanıcılar | `/partner/users` | SubUser listesi, ekleme, izin toggle | |
| C4.4 | Ayarlar | `/partner/settings` | Profil, logo, bilgi güncelleme formu | |
| C4.5 | Yorumlar | `/partner/reviews` | Gelen yorumlar, yanıtlama | |
| C4.6 | Raporlar | `/partner/reports` | İstatistik/grafik | |
| C4.7 | Müşteriler | `/partner/customers` | Müşteri listesi | |
| C4.8 | Sidebar navigasyon | Tüm partner/* | Tüm linkler çalışıyor, aktif sayfa vurgusu | |
| C4.9 | Mobil sidebar | 375px | Collapse/hamburger | |

---

## TC-D: Admin Panel (23.0d)

| # | Test | Yeni URL | Kontrol | Sonuç |
|---|------|----------|---------|-------|
| D1 | Admin dashboard | `/admin/dashboard` | KPI kartları, grafikler | |
| D2 | Kullanıcı listesi | `/admin/users` | Tablo: ad, email, rol, durum, aksiyon | |
| D3 | Tur onaylama | `/admin/tours` | Pending turlar, onay/red butonu | |
| D4 | Acente yönetimi | `/admin/agencies` | Acente listesi, onay akışı | |
| D5 | İçerik yönetimi | `/admin/content` | Blog post CRUD | |
| D6 | İstatistikler | `/admin/statistics` | Platform metrikleri, grafikler | |
| D7 | Ayarlar | `/admin/settings` | Platform ayarları formu | |
| D8 | Ödemeler | `/admin/payments` | Ödeme listesi, detay | |
| D9 | Rezervasyonlar | `/admin/reservations` | Tüm rezervasyonlar tablosu | |
| D10 | Sidebar navigasyon | Tüm admin/* | Linkler çalışıyor, aktif vurgu | |
| D11 | Mobil sidebar | 375px | Collapse/hamburger | |

---

## TC-E: Ortak Bileşenler (23.0e)

### TC-E1: Header

| # | Test | Kontrol | Sonuç |
|---|------|---------|-------|
| E1.1 | Logo | Görünüyor, tıklayınca ana sayfaya gidiyor | |
| E1.2 | Nav linkleri | Turlar, Aktiviteler, Rotalar, Blog (sıra aynı mı?) | |
| E1.3 | Otel/Press linki YOK | Header'da "Konaklama" / "Oteller" / "Press" linki OLMAMALI | |
| E1.4 | Auth butonları | Giriş Yap / Kayıt Ol (login olmamışken) | |
| E1.5 | User menu | Login olunca: avatar/isim + dropdown | |
| E1.6 | Partner butonu | "Partner Ol" veya "Partner Girişi" linki | |
| E1.7 | Mobil hamburger | 375px'de hamburger menü açılıyor | |
| E1.8 | Sticky/scroll | Scroll'da header davranışı (sticky mi?) | |

### TC-E2: Footer

| # | Test | Kontrol | Sonuç |
|---|------|---------|-------|
| E2.1 | Kolon yapısı | Legacy ile aynı kolon sayısı ve başlıklar | |
| E2.2 | Linkler çalışıyor | Tüm footer linkleri 404 vermiyor | |
| E2.3 | Otel/Press linki YOK | Footer'da "Konaklama" / "Press" linki OLMAMALI | |
| E2.4 | Legal/copyright | Alt satır: copyright, gizlilik, KVKK | |
| E2.5 | Sosyal medya ikonları | Instagram, Twitter, vb. | |
| E2.6 | Newsletter | Email input + abone ol (varsa) | |
| E2.7 | Mobil (375px) | Kolonlar stack oluyor mu? | |

### TC-E3: BottomBookingBar

| # | Test | Kontrol | Sonuç |
|---|------|---------|-------|
| E3.1 | Tur detayda görünüyor | Fixed bottom bar: fiyat + buton | |
| E3.2 | Aktivite detayda | Aynı bar aktivite için de çalışıyor | |
| E3.3 | Mobil davranış | Tam genişlik, buton tıklanabilir | |
| E3.4 | Scroll davranış | Sayfa scroll'unda bar sabit kalıyor | |

---

## TC-F: Responsive & Cross-Browser (Genel)

| # | Test | Viewport | Kontrol | Sonuç |
|---|------|----------|---------|-------|
| F1 | Desktop (1920px) | 1920x1080 | Tüm sayfalar tam genişlik kullanıyor | |
| F2 | Laptop (1366px) | 1366x768 | Sidebar/content oranı doğru | |
| F3 | Tablet (768px) | 768x1024 | Grid 2 kolon, sidebar collapse | |
| F4 | Mobil (375px) | 375x812 | Tek kolon, hamburger, stack | |
| F5 | Mobil (320px) | 320x568 | Overflow yok, metin kesilmiyor | |

---

## TC-G: Genel UI Tutarlılık

| # | Test | Kontrol | Sonuç |
|---|------|---------|-------|
| G1 | Buton renkleri | Primary (mavi/turuncu), secondary, danger — legacy ile aynı | |
| G2 | Font ailesi | Legacy ile aynı font family | |
| G3 | Font boyutları | Heading ve body size'lar tutarlı | |
| G4 | Spacing | Padding/margin değerleri tutarlı | |
| G5 | Border radius | Kartlarda, butonlarda, inputlarda aynı | |
| G6 | Gölge (shadow) | Kart gölgeleri legacy ile aynı | |
| G7 | Renk paleti | Marka renkleri tutarlı | |
| G8 | Loading state | Skeleton/spinner görünüyor (beyaz ekran yok) | |
| G9 | Error state | Hata mesajları kullanıcı dostu | |
| G10 | Empty state | Veri yoksa uygun mesaj + ikon | |
| G11 | Toast/bildirim | Başarı/hata toast'ları çalışıyor | |
| G12 | Form validation | Hata mesajları input altında, kırmızı border | |

---

## Test Sonuç Özeti

| Kategori | Toplam Test | PASS | FAIL | Oran |
|----------|-------------|------|------|------|
| TC-A: Marketing + Customer | 75 | | | |
| TC-B: Auth | 11 | | | |
| TC-C: Partner | 30 | | | |
| TC-D: Admin | 11 | | | |
| TC-E: Ortak Bileşenler | 15 | | | |
| TC-F: Responsive | 5 | | | |
| TC-G: UI Tutarlılık | 12 | | | |
| **TOPLAM** | **159** | | | |

---

## FAIL Durumunda Aksiyon

| Öncelik | Kriter | Aksiyon |
|---------|--------|---------|
| P0 | Sayfa açılmıyor / beyaz ekran | Anında fix — deploy bloker |
| P0 | Layout tamamen farklı | Legacy'den birebir port — JSX/CSS kopyala |
| P1 | Renk/spacing farkı | Tailwind class düzeltmesi |
| P1 | Eksik bölüm/section | Legacy component'i port et |
| P2 | İnce fark (1-2px, hover efekt) | Sprint 23 UI Onarım'da toplu fix |
| P3 | Kozmetik (font-weight farkı) | Backlog — ürün kararı |

---

## Onay

| Rol | İsim | Tarih | İmza |
|-----|------|-------|------|
| Frontend Lead | | | |
| QA | | | |
| Ürün Sahibi | | | |
