/**
 * SEO-oriented blog seed content for turta.
 * Used by Nest (content schema) and legacy Prisma seed scripts.
 */

export type BlogSeedCategory = {
  name: string;
  slug: string;
  description: string;
};

export type BlogSeedPost = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  categorySlugs: string[];
  /** Plain text with blank-line paragraphs; ## for subheads. */
  content: string;
};

export const BLOG_SEED_CATEGORIES: BlogSeedCategory[] = [
  {
    name: 'Yurtiçi Rotalar',
    slug: 'yurtici-rotalar',
    description: 'Türkiye’nin en çok tercih edilen tur ve rota rehberleri',
  },
  {
    name: 'Yurtdışı Rotalar',
    slug: 'yurtdisi-rotalar',
    description: 'Popüler uluslararası destinasyonlar ve güzergâh önerileri',
  },
  {
    name: 'Seyahat İpuçları',
    slug: 'seyahat-ipuclari',
    description: 'Pratik planlama, bütçe ve sürdürülebilir seyahat önerileri',
  },
  {
    name: 'Gastronomi',
    slug: 'gastronomi',
    description: 'Lezzet rotaları, yerel mutfak ve yemek deneyimleri',
  },
];

export const BLOG_SEED_POSTS: BlogSeedPost[] = [
  {
    title: 'Kapadokya Rotası 2026: Balon, Peri Bacaları ve En İyi 3 Gün Planı',
    slug: 'kapadokya-rotasi-2026-balon-peri-bacalari',
    excerpt:
      'Göreme, Ürgüp ve Avanos’u kapsayan pratik Kapadokya rotası: balon, açık hava müzesi, vadi yürüyüşleri ve konaklama ipuçları.',
    coverImage:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtici-rotalar', 'seyahat-ipuclari'],
    content: `Kapadokya, Türkiye’nin en çok aranan yurtiçi destinasyonlarından biri. Peri bacaları, yeraltı şehirleri ve gün doğumu balon turlarıyla hem ilk kez gelenler hem de tekrar ziyaretçiler için güçlü bir rota sunuyor.

## 3 günlük örnek plan

1. Gün: Göreme Açık Hava Müzesi, Aşk Vadisi gün batımı, çömlek atölyesi (Avanos).
2. Gün: Erken balon deneyimi, ardından Ihlara Vadisi veya Kaymaklı yeraltı şehri.
3. Gün: Ürgüp bağları, yerel şarap tadımı ve Uçhisar kalesi manzarası.

## Ne zaman gidilmeli?

Nisan–Haziran ve Eylül–Ekim, balon uçuşlarının sıklaştığı ve sıcaklığın yürüyüş için ideal olduğu dönemler. Kışın karlı peri bacaları da ayrı bir fotoğraf değeri taşır; ancak bazı aktiviteler hava nedeniyle iptal olabilir.

## turta ile planlama

Kapadokya’da günübirlik turlar, atv safari ve yerel deneyimler için turta üzerindeki tur ve aktivite filtrelerini kullanın. Rezervasyon öncesi iptal koşullarını ve yaş aralığı fiyatlarını kontrol etmeyi unutmayın.`,
  },
  {
    title: 'Karadeniz Yaylaları Rotası: Ayder, Uzungöl ve Pokut Rehberi',
    slug: 'karadeniz-yaylalari-ayder-uzungol-pokut',
    excerpt:
      'Doğu Karadeniz’in en popüler yayla güzergâhı: kaç gün ayrılmalı, hangi mevsim ideal, yol durumu ve konaklama önerileri.',
    coverImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtici-rotalar'],
    content: `Karadeniz yaylaları, yeşil manzara ve serin iklim arayanlar için Türkiye’nin en rekabetçi yurtiçi rotalarından. Ayder, Uzungöl, Pokut ve Çatak gibi noktalar özellikle yaz aylarında yoğun talep görüyor.

## Önerilen güzergâh

Trabzon → Sümela → Uzungöl → Ayder → Pokut → Rize. 5–7 gün ayırmak hem yolda yorulmamak hem de yağmur riskine karşı esneklik sağlar.

## Pratik ipuçları

Dar ve virajlı yollar için küçük araç tercih edin. Yaylalarda nakit taşımak işe yarar; sinyal zayıf bölgelerde offline harita indirin. Yoğun sezon öncesi konaklama ve tur rezervasyonu yaptırın.

turta’da “Karadeniz” ve “doğa” kategorili turları süre filtresiyle (4–6 veya 7+ gün) listeleyebilirsiniz.`,
  },
  {
    title: 'Likya Yolu’nda 7 Gün: Kaş, Kalkan, Olympos ve Patara',
    slug: 'likya-yolu-7-gun-kas-olympos-patara',
    excerpt:
      'Akdeniz’in efsane trekking rotası Likya Yolu için haftalık plan, zorluk seviyeleri ve deniz molası önerileri.',
    coverImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtici-rotalar', 'seyahat-ipuclari'],
    content: `Likya Yolu, dünya çapında bilinen Türkiye trekking rotalarının başında geliyor. Tam parkur uzun olsa da Kaş–Kalkan–Olympos–Patara hattı 7 günde hem yürüyüş hem deniz dengesi kurmak isteyenler için ideal.

## Kimler için uygun?

Orta kondisyonlu yürüyüşçüler için parkurlar parçalara ayrılabilir. Aileler için kısa etütler + plaj günleri daha konforlu olur. Yazın öğlen sıcağından kaçının; ilkbahar ve sonbahar en konforlu dönemlerdir.

## Paket mi, serbest mi?

Rehberli turlar lojistik yükü azaltır. Serbest gidenler su, güneş kremi ve sağlam ayakkabı önceliği taşımalı. turta üzerinden Likya ve Antalya bölgesi aktivitelerini (dalış, tekne, trekking) tek yerden karşılaştırabilirsiniz.`,
  },
  {
    title: 'İstanbul’da 48 Saat: Tarih, Boğaz ve Yerel Lezzet Rotası',
    slug: 'istanbul-48-saat-tarih-bogaz-lezzet',
    excerpt:
      'Kısa kaçamak için optimize edilmiş İstanbul planı: Sultanahmet, Karaköy, Boğaz ve modern gastronomi durakları.',
    coverImage:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtici-rotalar', 'gastronomi'],
    content: `İstanbul, hem yurtiçi hem uluslararası aramalarda Türkiye’nin en görünür şehri. 48 saatte her şeyi görmek imkânsız; odaklanmak şart.

## 1. gün — Tarihi yarımada

Ayasofya, Sultanahmet, Topkapı çevresi sabah erken saatlerde daha sakin. Öğleden sonra Kapalıçarşı yerine Karaköy–Galata hattına geçerek tempo değiştirin.

## 2. gün — Boğaz ve lezzet

Sabah kısa Boğaz turu, öğleden sonra Beşiktaş veya Kadıköy’de yerel kahvaltı ve sokak lezzetleri. Akşam için modern Türk mutfağı deneyimleri gastronomi kategorisinde öne çıkıyor.

turta’da şehir turları ve gastronomi aktivitelerini aynı rezervasyon akışıyla yönetebilirsiniz.`,
  },
  {
    title: 'Ege Sahil Rotası: İzmir, Çeşme, Alaçatı ve Bodrum',
    slug: 'ege-sahil-rotasi-izmir-cesme-alacati-bodrum',
    excerpt:
      'Yazın en çok aranan Ege güzergâhı: plaj, windsurf, gece hayatı ve saklı koylar için pratik sıralama.',
    coverImage:
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtici-rotalar'],
    content: `Ege sahilleri, özellikle Temmuz–Ağustos’ta yurtiçi tatil aramalarında zirveye oturuyor. İzmir çıkışlı 5–8 günlük bir rota hem plaj hem kültür dengesi kurar.

## Önerilen sıra

İzmir (1 gün) → Çeşme/Alaçatı (2–3 gün) → Bodrum yarımadası (2–3 gün). Araç kiralamak koy geçişlerini kolaylaştırır; yazın erken rezervasyon kritik.

## Aktivite fikirleri

Windsurf ve sörf okulları Alaçatı’da yoğun. Bodrum’da tekne turları ve günübirlik adalar popüler. turta filtrelerinde “BEACH” ve “ADVENTURE” kategorilerini birlikte kullanabilirsiniz.`,
  },
  {
    title: 'GAP ve Doğu Anadolu: Nemrut, Mardin, Van Gölü Rotası',
    slug: 'gap-dogu-anadolu-nemrut-mardin-van',
    excerpt:
      'Kültür ve manzara odaklı doğu rotası: tarihi kentler, gün doğumu noktaları ve mevsim önerileri.',
    coverImage:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtici-rotalar', 'gastronomi'],
    content: `Doğu ve Güneydoğu Anadolu, kültürel turizmde yükselen bir hat. Nemrut’un gün doğumu, Mardin’in taş sokakları ve Van Gölü manzarası aynı rotada birleştirilebilir.

## Ne kadar süre?

7–10 gün ideal. Kış koşulları bazı geçitleri zorlaştırabilir; ilkbahar ve sonbahar hem fotoğraf hem yol güvenliği açısından avantajlıdır.

## Lezzet durakları

Ciğer, içli köfte, otlu peynir ve yerel tatlılar gastronomi meraklıları için ayrı bir keşif katmanı ekler. turta’da kültür turlarını süre ve puan filtreleriyle daraltabilirsiniz.`,
  },
  {
    title: 'Balkanlar Karadan: Selanik, Üsküp, Belgrad ve Saraybosna',
    slug: 'balkanlar-karadan-selanik-uskup-belgrad-saraybosna',
    excerpt:
      'Türkiye çıkışlı en popüler kara yolu / otobüs yurtdışı rotalarından Balkan hattı için gün gün öneri.',
    coverImage:
      'https://images.unsplash.com/photo-1555990793-da11153b2473?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtdisi-rotalar', 'seyahat-ipuclari'],
    content: `Balkanlar, bütçe dostu Avrupa deneyimi arayan Türk gezginler arasında sürekli trend. Kara yoluyla 8–12 günde birden fazla başkenti görmek mümkün.

## Klasik hat

İstanbul/Edirne → Selanik → Üsküp → Belgrad → Saraybosna (dönüşte Mostar molası). Pasaport ve sigorta kontrollerini önceden tamamlayın.

## Bütçe notları

Konaklama ve yemek Batı Avrupa’ya göre daha erişilebilir. Şehirler arası otobüs ağı yoğun; tren seçenekleri hatta göre değişir. Dönüşte Türkiye’deki kısa bir Ege veya Trakya molası rotayı yumuşatır.`,
  },
  {
    title: 'İtalya Klasikleri: Roma, Floransa ve Amalfi Sahili',
    slug: 'italya-roma-floransa-amalfi-rotasi',
    excerpt:
      'Dünyanın en çok ziyaret edilen kültür rotalarından İtalya üçgeni: müzeler, trenler ve sahil molası dengesi.',
    coverImage:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtdisi-rotalar'],
    content: `Roma–Floransa–Amalfi, “bir kez mutlaka” listelerinde üst sıralarda. 9–12 gün, yüksek sezon kalabalıklarını yönetmek için erken bilet ve rezervasyon ister.

## Ulaşım

Yüksek hızlı trenler şehirler arası en verimli seçenek. Amalfi tarafında otobüs ve feribot kombinasyonu yaygındır.

## Ne yenir?

Roma’da karbonara, Floransa’da biftek, sahilde deniz ürünleri… Gastronomi odaklı günler planınıza mutlaka ekleyin. Türkiye’ye dönüş sonrası Ege gastronomi turlarıyla lezzet yolculuğunu sürdürebilirsiniz.`,
  },
  {
    title: 'İspanya’da 10 Gün: Barcelona, Madrid ve Endülüs',
    slug: 'ispanya-10-gun-barcelona-madrid-endulus',
    excerpt:
      'Mimari, tapas ve Endülüs güneşi: İspanya’nın en çok tercih edilen şehir kombinasyonu.',
    coverImage:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtdisi-rotalar', 'gastronomi'],
    content: `İspanya, hem kültür hem gece hayatı hem de tapas kültürüyle yurtdışı aramalarında zirvede. 10 günde Barcelona + Madrid + Sevilla/Granada dengeli bir paket oluşturur.

## Ritim önerisi

İlk 3–4 gün Barcelona (Gotik mahalle, Sagrada, plaj), ardından Madrid müzeleri, son bölümde Endülüs’te Alhambra ve flamenco.

AVE trenleri zaman kazandırır. Yazın iç kesimlerde sıcaklık yüksektir; sabah erken müze saatlerini tercih edin.`,
  },
  {
    title: 'Yunan Adaları: Atina, Santorini ve Girit Seçimi',
    slug: 'yunan-adalari-atina-santorini-girit',
    excerpt:
      'Ege’nin diğer yakası: feribot bağlantıları, ada hopping stratejileri ve yüksek sezon tuzakları.',
    coverImage:
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtdisi-rotalar'],
    content: `Yunan adaları, Türk gezginler için hem coğrafi yakınlık hem vizyon/erişim avantajıyla sürekli revaçta. Santorini manzara, Girit ise çeşitlilik arayanlara hitap eder.

## Kısa mı uzun mu?

4–5 gün: Atina + bir ada. 8–10 gün: iki ada hop. Feribot saatleri rüzgâra bağlı değişebilir; esnek bilet seçin.

Türkiye tarafında Çeşme–Sakız veya Bodrum feribotları da kısa kaçamak için alternatif olabilir; turta’da Ege sahil turlarıyla kombine plan yapılabilir.`,
  },
  {
    title: 'Gürcistan Rotası: Tiflis, Kazbegi ve Batum',
    slug: 'gurcistan-tiflis-kazbegi-batum-rotasi',
    excerpt:
      'Yakın mesafe, güçlü gastronomi ve dağ manzarası: Gürcistan neden yükselen bir yurtdışı rota?',
    coverImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtdisi-rotalar', 'gastronomi'],
    content: `Gürcistan, son yıllarda hem bütçe hem deneyim arayanların listesinde hızla yükseldi. Tiflis’in eski şehir dokusu, Kazbegi’nin dağ kiliseleri ve Batum’un sahili aynı haftada birleştirilebilir.

## 7 günlük iskelet

Tiflis (3) → Kazbegi günübirlik veya konaklamalı (1–2) → Batum (2). Şarap bölgelerine (Kakheti) ayrılacak ekstra gün lezzet odaklı gezginler için değerli.

Khinkali, khachapuri ve yerel şaraplar gastronomi hikâyesinin merkezinde. Dönüşte Türkiye’de Karadeniz gastronomisiyle “komşu mutfaklar” teması kurulabilir.`,
  },
  {
    title: 'Japonya Klasik Hattı: Tokyo, Kyoto ve Osaka',
    slug: 'japonya-tokyo-kyoto-osaka-klasik-hat',
    excerpt:
      'Uzak ama yüksek niyetli bir rota: shrin-kansen temposu, tapınaklar ve sokak lezzetleri için 10–14 gün planı.',
    coverImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtdisi-rotalar'],
    content: `Japonya, “ömürde bir kez” aramalarında global olarak en güçlü destinasyonlardan. Tokyo–Kyoto–Osaka üçgeni ilk ziyaret için en net çerçeveyi verir.

## Ulaşım

JR Pass hesaplaması uçuş + şehir içi + şehirler arası kombosuna göre değişir. Yoğun tapınak bölgelerinde sabah erken saatler kalabalığı azaltır.

## Kültür notu

Sessizlik ve sıra kurallarına uyum deneyimi güzelleştirir. Türkiye’ye döndükten sonra tempolu bir Kapadokya veya İstanbul gastronomi turu “soft landing” olabilir.`,
  },
  {
    title: 'Sürdürülebilir Seyahat: Daha Az İz, Daha Çok Deneyim',
    slug: 'surdurulebilir-seyahat-ipucu-rehberi',
    excerpt:
      'Karbon ayak izini azaltırken yerel ekonomiye katkı: bilinçli turizm için uygulanabilir adımlar.',
    coverImage:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['seyahat-ipuclari'],
    content: `Sürdürülebilir seyahat, trend bir slogan olmaktan çıkıp rezervasyon kararlarını etkileyen bir kriter haline geldi. Yerel operatörler, küçük gruplar ve mevsim dışı seyahat hem kalabalık hem fiyat baskısını azaltır.

## Ne yapabilirsiniz?

Toplu taşıma veya paylaşımlı transfer tercih edin. Tek kullanımlık plastik yerine matara taşıyın. Yerel rehberli deneyimleri seçerek gelirin destinasyonda kalmasını destekleyin.

turta ekosistemi, yerel deneyim sağlayıcılarını öne çıkararak “büyük otel zinciri” yerine bölge ekonomisine dokunan seçenekler sunmayı hedefler.`,
  },
  {
    title: 'Solo Travel Türkiye: Yalnız ama Güvende Gezmenin Pratik Rehberi',
    slug: 'solo-travel-turkiye-yalniz-gezmek',
    excerpt:
      'Tek başına gezenler için popüler yurtiçi rotalar, güvenlik alışkanlıkları ve sosyal deneyim önerileri.',
    coverImage:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['seyahat-ipuclari', 'yurtici-rotalar'],
    content: `Solo travel aramaları her yıl artıyor. Türkiye’de Kapadokya, İstanbul, Antalya ve Karadeniz; yalnız gezginlerin en çok tercih ettiği hatlar arasında.

## Güvenlik alışkanlıkları

Konum paylaşımı, gündüz transferleri ve resmi tur operatörleri riski düşürür. Hostel veya butik oteller sosyal etkileşimi artırır.

## Neden grup aktivitesi?

Yalnız gelseniz bile günübirlik turlar yeni insanlarla tanışma fırsatı yaratır. turta’da aktivite ve tur rezervasyonlarını tek hesap üzerinden takip edebilirsiniz.`,
  },
  {
    title: 'Türkiye Gastronomi Rotası: Gaziantep, Hatay ve İstanbul',
    slug: 'turkiye-gastronomi-rotasi-antep-hatay-istanbul',
    excerpt:
      'UNESCO ve sokak lezzeti kesişimi: Türkiye’nin en çok konuşulan yemek destinasyonları.',
    coverImage:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['gastronomi', 'yurtici-rotalar'],
    content: `Gastronomi turizmi, klasik “deniz-kum-güneş” aramasının yanında hızla büyüyor. Gaziantep ve Hatay mutfak mirasıyla, İstanbul ise hem geleneksel hem modern sahnesiyle öne çıkıyor.

## 5–7 günlük lezzet hattı

Antep baklavası ve kebap kültürü, Hatay’da kahvaltı ve baharat, İstanbul’da meyhane + fine dining dengesi.

Atölye tipi deneyimler (çikolata, çömlek + yemek komboları) turta aktivite kategorisinde sıkça aranıyor. Alerjen ve özel diyet notlarını rezervasyon formuna eklemeyi unutmayın.`,
  },
  {
    title: 'Dijital Nomad Kaçamağı: Antalya ve İstanbul’da Çalışırken Gezmek',
    slug: 'dijital-nomad-antalya-istanbul',
    excerpt:
      'Uzaktan çalışanlar için popüler Türkiye üsleri: internet, cowork, hafta sonu mikro-rotalar.',
    coverImage:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['seyahat-ipuclari'],
    content: `Dijital nomad aramaları Antalya ve İstanbul’u sıkça birlikte listeliyor. Bir yanda cowork ve kafe kültürü, diğer yanda hafta sonu Likya veya Kapadokya kaçamağı.

## Pratik checklist

Stabil fiber/5G, sessiz çalışma köşesi, esnek check-out. Toplantı günlerini şehir içine, saha günlerini kısa turlara ayırın.

turta üzerinden Cuma çıkışlı günübirlik veya 2–3 günlük turları filtreleyerek iş takviminize oturtabilirsiniz.`,
  },
  {
    title: 'Bütçeli Avrupa: Şehirlerarası Tren ve Hostel Stratejisi',
    slug: 'butceli-avrupa-tren-hostel-stratejisi',
    excerpt:
      'Yükselen uçak fiyatlarına karşı: erken bilet, shoulder season ve şehir bazlı bütçe taktikleri.',
    coverImage:
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['yurtdisi-rotalar', 'seyahat-ipuclari'],
    content: `Avrupa hâlâ en çok hayal edilen yurtdışı havuzu; maliyetleri yönetmek ise planlama işi. Shoulder season (Nisan–Mayıs, Eylül–Ekim) hem fiyat hem kalabalık avantajı sağlar.

## Tasarruf kalemleri

Erken tren biletleri, şehir kartları, öğlen menüleri, ücretsiz müze günleri. Hosteller yalnız gezginler için sosyal ve ekonomik denge kurar.

Türkiye’ye dönüşte yurtiçi bir rota (Ege veya Kapadokya) ile tatili uzatmak, tek uzun uçuş maliyetini “daha fazla deneyim”e yaymanın popüler yolu.`,
  },
  {
    title: 'Aile Tatili: Çocuklu Gezginler İçin Türkiye Rota Önerileri',
    slug: 'aile-tatili-cocuklu-turkiye-rotalari',
    excerpt:
      'Tempo, mola ve güvenlik odaklı aile planı: Antalya, Kapadokya ve İstanbul’da çocuk dostu alternatifler.',
    coverImage:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1600&q=80',
    categorySlugs: ['seyahat-ipuclari', 'yurtici-rotalar'],
    content: `Aile tatili aramalarında “çocuk dostu”, “kısa transfer” ve “iptal esnekliği” öne çıkıyor. Uzun otobüs etütleri yerine 2–4 günlük yoğun deneyimler daha sürdürülebilir.

## Önerilen kombinasyonlar

Antalya: plaj + kısa tekne. Kapadokya: vadi yürüyüşlerini kısa tutun, balon için yaş/sağlık kurallarını okuyun. İstanbul: park ve boğaz molalarıyla müzeyi dengeleyin.

turta rezervasyonlarında yaş aralığı fiyatları ve misafir bilgileri (doğum tarihi) doğru girildiğinde fiyat şeffaflığı artar.`,
  },
];
