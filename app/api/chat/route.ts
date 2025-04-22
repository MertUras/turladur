import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'; // Import zod for validation

// Daha kapsamlı cevaplar içeren yanıt seti
const responses: Record<string, string> = {
  "fiyat": "Turlarımızın fiyatları konuma, sezona ve tur içeriğine göre değişmektedir. Genel olarak:\n\n• Günübirlik turlar: 400₺-1500₺ arası\n• 2-3 günlük turlar: 1500₺-5000₺ arası\n• Haftalık özel turlar: 5000₺-15000₺ arası\n\nAyrıca erken rezervasyon ve grup indirimleri de bulunmaktadır. Detaylı fiyat bilgisi için istediğiniz turu belirtirseniz size özel bilgi verebiliriz.",
  
  "rezervasyon": "TourTech üzerinden rezervasyon yapmak oldukça kolay! Şu adımları izleyebilirsiniz:\n\n1. Web sitemizde ilgili tur sayfasını ziyaret edin\n2. 'Rezervasyon Yap' butonuna tıklayın\n3. Tarih ve kişi sayısını seçin\n4. Ödeme bilgilerinizi girin\n\nRezervasyon işleminiz tamamlandığında e-posta ile onay alacaksınız. Alternatif olarak 0850 123 45 67 numaralı telefondan müşteri hizmetlerimizi arayabilirsiniz.",
  
  "iptal": "Rezervasyon iptal koşullarımız şu şekildedir:\n\n• Turdan 14 gün öncesine kadar: %100 iade\n• 7-14 gün kala: %75 iade\n• 3-7 gün kala: %50 iade\n• 72 saat içinde: İade yapılmamaktadır\n\nMücbir sebeplerle (hastalık, doğal afet vb.) iptal durumlarında esneklik sağlanabilmektedir. Böyle bir durumda lütfen bizimle iletişime geçin.",
  
  "ödeme": "TourTech'te çeşitli ödeme seçenekleri sunuyoruz:\n\n• Kredi/Banka Kartı (3D Secure ile güvenli ödeme)\n• Havale/EFT\n• Sanal Cüzdan (TourTech Wallet)\n• 12 aya varan taksit imkanı\n\nRezervasyon sırasında %30 ön ödeme yaparak, kalan tutarı tura 7 gün kala tamamlayabilirsiniz.",
  
  "iletişim": "TourTech iletişim bilgilerimiz:\n\n📞 Telefon: 0850 123 45 67\n✉️ E-posta: iletisim@tourtech.com.tr\n🏢 Adres: Levent Mah. Büyükdere Cad. No:123, 34330 Beşiktaş/İstanbul\n\nMüşteri hizmetlerimiz hafta içi 09:00-18:00, hafta sonu 10:00-16:00 saatleri arasında hizmet vermektedir.",
  
  "tarih": "Turlarımızın tarihleri genellikle şu şekilde belirlenir:\n\n• Popüler destinasyonlar için her hafta düzenli kalkışlar\n• Mevsimsel turlar için aylar öncesinden planlama\n• Özel gruplar için talep üzerine özel tarihler\n\nTakvimimizi web sitemizden görebilir veya size uygun bir tarih için özel tur talebinde bulunabilirsiniz.",
  
  "merhaba": "Merhaba! 👋 Size nasıl yardımcı olabilirim? TourTech'in eşsiz tur deneyimleri hakkında bilgi almak ister misiniz?",
  
  "selam": "Merhaba! 😊 TourTech'e hoş geldiniz. Türkiye'nin en iyi tur deneyimlerini keşfetmenize yardımcı olmak için buradayım. Size nasıl yardımcı olabilirim?",
  
  "teşekkür": "Rica ederim! 🙏 Başka bir konuda yardıma ihtiyacınız olursa her zaman buradayız. Size keyifli ve unutulmaz seyahat deneyimleri sunmak için çalışıyoruz.",
  
  "konaklama": "Turlarımızda genellikle 4 ve 5 yıldızlı otellerde konaklama sağlanmaktadır. Bazı özel deneyimler için butik otel, glamping veya yerel konaklama seçenekleri de sunuyoruz. Her konaklama tesisimiz titizlikle seçilmiş olup, konfor ve kalite standartlarımızı karşılamaktadır.",
  
  "çocuk": "Çocuklu aileler için birçok turumuz uygundur. 0-6 yaş arası çocuklar için genellikle %50-70 indirim, 7-12 yaş arası çocuklar için %30-50 indirim uygulanmaktadır. Ayrıca özel çocuk etkinlikleri olan aile dostu turlarımız da bulunmaktadır.",
  
  "ulaşım": "Turlarımızda profesyonel şoförler eşliğinde, lüks ve konforlu araçlarla ulaşım sağlanmaktadır. Uzun mesafeli turlarda dinlenme molaları planlanmış olup, yolculuğunuzu keyifli hale getirecek ikramlar sunulmaktadır.",

  "güvenlik": "Tüm turlarımızda katılımcıların güvenliği önceliğimizdir. Deneyimli rehberlerimiz ve profesyonel ekiplerimiz, tur boyunca her türlü güvenlik önlemini almaktadır. Ayrıca, tüm katılımcılarımız için seyahat sigortası da tur paketlerimize dahildir.",

  "rehber": "TourTech olarak tüm turlarımızda profesyonel, lisanslı ve birden fazla dil bilen rehberler ile hizmet vermekteyiz. Rehberlerimiz, ziyaret edilen bölgelerin tarihini, kültürünü ve özel bilgilerini sizlere aktararak deneyiminizi zenginleştirir.",

  "yemek": "Turlarımızda sunduğumuz yemek seçenekleri tur tipine göre değişmektedir. Genellikle kahvaltı dahil paketlerimiz olup, tam pansiyon ve yarım pansiyon seçeneklerimiz de mevcuttur. Vejetaryen, vegan, glutensiz gibi özel diyet ihtiyaçlarınızı önceden belirtmeniz durumunda bunları karşılamak için elimizden geleni yapıyoruz.",

  "internet": "Tur araçlarımızda ücretsiz Wi-Fi bulunmaktadır. Ayrıca anlaşmalı olduğumuz konaklama tesislerinin çoğunda da ücretsiz internet erişimi mevcuttur. Ancak, özellikle kırsal bölgelerde internet erişiminin sınırlı olabileceğini hatırlatmak isteriz.",

  "popüler": "En popüler turlarımız arasında Kapadokya Balon Turu, Efes Antik Kenti & Pamukkale Turu, İstanbul Boğaz Turu ve Fethiye Mavi Yolculuk bulunmaktadır. Bu turlar, yüksek müşteri memnuniyeti ve eşsiz deneyimler sunması sebebiyle en çok tercih edilen rotalarımızdır.",

  "bagaj": "Tur tiplerine göre bagaj limitlerimiz değişmektedir. Genel olarak kişi başı 1 büyük valiz ve 1 el bagajına izin verilmektedir. Daha detaylı bilgi için rezervasyon esnasında müşteri temsilcilerimiz size yardımcı olacaktır.",

  "vize": "Yurt dışı turlarımız için vize gereksinimleri ülkelere göre değişmektedir. Rezervasyon sırasında vize işlemleri konusunda size bilgi verilecektir. Ayrıca, ekstra bir ücret karşılığında vize danışmanlık hizmeti de sunmaktayız.",
  
  "indirim": "TourTech'te müşterilerimize çeşitli indirim fırsatları sunuyoruz:\n\n• Erken rezervasyon: %20'ye varan indirimler\n• Grup indirimleri: 6+ kişilik gruplarda kişi başı %15 indirim\n• Düzenli müşteri indirimi: İkinci ve sonraki rezervasyonlarda %10 indirim\n• Sezon dışı dönem indirimleri: Belirli dönemlerde %25'e varan indirimler\n\nAyrıca sosyal medya hesaplarımızı takip ederek özel kampanyalardan haberdar olabilirsiniz.",
  
  "belge": "Tura katılım için genellikle geçerli bir kimlik belgesi (nüfus cüzdanı, ehliyet veya pasaport) yeterlidir. Yurt dışı turlarında ise geçerli pasaport ve gerekli durumlarda vize istenebilmektedir. Bazı özel etkinlikler için ek belgeler talep edilebilir, bu durumda rezervasyon aşamasında bilgilendirileceksiniz.",
  
  "sürpriz": "Evet, özel günler için sürpriz organizasyonlar düzenliyoruz! Doğum günü, evlilik yıldönümü, nişan gibi özel günlerinizde size özel hatıralar oluşturmak için rehberlerimiz ve otel ekibiyle koordineli çalışmaktayız. Rezervasyon sırasında özel bir organizasyon talebiniz varsa lütfen belirtiniz.",
  
  "hava": "Tur bölgelerimizin hava durumları sezonlara göre değişiklik göstermektedir. Turdan yaklaşık 1 hafta önce sizinle iletişime geçerek, hava durumu ve buna göre hazırlanmanız gereken eşyalar konusunda bilgilendirme yapmaktayız. Ayrıca her tur için mevsim koşullarına uygun hazırlık önerilerimiz bulunmaktadır."
};

// Sık sorulan sorular ve bağlantıları - Kullanıcıya sunulacak öneriler için
const faq = [
  { id: 'fiyat', question: 'Turların fiyatları ne kadar?' },
  { id: 'rezervasyon', question: 'Nasıl rezervasyon yapabilirim?' },
  { id: 'iptal', question: 'İptal politikanız nedir?' },
  { id: 'indirim', question: 'İndirim fırsatlarınız var mı?' },
  { id: 'konaklama', question: 'Konaklama tesisleriniz nasıl?' },
  { id: 'çocuk', question: 'Çocuklar için uygun mu?' },
  { id: 'popüler', question: 'En popüler turlarınız hangileri?' },
  { id: 'rehber', question: 'Rehberleriniz hakkında bilgi alabilir miyim?' }
];

// Destinasyon bilgileri - Belirli destinasyonlar hakkında detaylı bilgi
const destinations = {
  "kapadokya": "Kapadokya, peri bacaları, sıcak hava balon turları ve yeraltı şehirleriyle ünlü eşsiz bir bölgedir. Turlarımızda Göreme Açık Hava Müzesi, Derinkuyu Yeraltı Şehri, Uçhisar Kalesi ve gün doğumunda balon turlarını deneyimleyebilirsiniz. Bölge UNESCO Dünya Mirası Listesi'nde yer almaktadır.",
  "fethiye": "Fethiye, turkuaz renkli koyları, Ölüdeniz'i ve eşsiz doğasıyla Türkiye'nin en gözde tatil destinasyonlarındandır. Burada Saklıkent Kanyonu, Ölüdeniz Plajı, Kelebekler Vadisi ve Kayaköy Antik Kenti'ni gezebilir, yamaç paraşütü ve tekne turları gibi aktivitelere katılabilirsiniz.",
  "pamukkale": "Pamukkale, bembeyaz travertenleri ve antik Hierapolis harabeleriyle ünlüdür. UNESCO Dünya Mirası Listesi'nde yer alan bu eşsiz doğa harikasında termal sularda yüzebilir, antik tiyatroyu ziyaret edebilir ve travertenlerin muhteşem manzarasının tadını çıkarabilirsiniz.",
  "istanbul": "İstanbul, iki kıtayı birleştiren, tarihi ve kültürel zenginlikleriyle dünyaca ünlü bir metropoldür. Ayasofya, Topkapı Sarayı, Sultanahmet Camii, Kapalıçarşı gibi önemli tarihi mekânların yanı sıra, Boğaz turu ve lezzet turlarıyla bu şehrin tüm güzelliklerini keşfedebilirsiniz.",
  "antalya": "Antalya, muhteşem plajları, antik kentleri ve lüks tatil köyleriyle Türkiye'nin turizm cennetidir. Konyaaltı ve Lara plajları, Aspendos Antik Tiyatrosu, Kaleiçi, Düden Şelalesi ve Olympos Antik Kenti bölgenin en çok ziyaret edilen yerleri arasındadır."
};

// Yanıt vermek için varsayılan mesaj
const defaultResponse = "Sorunuz için teşekkürler! Şu anda bu konu hakkında detaylı bilgi veremiyorum, ancak müşteri temsilcilerimizden biri en kısa sürede size yardımcı olacaktır. Başka bir konuda yardımcı olabilir miyim?";

// Türkçe karakterleri normalize eden yardımcı fonksiyon (Karşılaştırma için)
function normalizeTurkishTextForComparison(text: string): string {
  if (!text) return ''; // Boş veya tanımsız girişi işle
  return text
    .toLowerCase() // Önce küçük harfe çevir
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

// Konuşma bağlamını takip etmek için basit bellek
const conversations = new Map<string, {
  context: string,
  lastInteraction: Date,
  messageCount: number,
  lastTopic?: string,
  suggestedQuestions?: {id: string, question: string}[]
}>();

// Define schema for request body validation
const chatRequestSchema = z.object({
  message: z.string().trim().min(1, { message: "Mesaj boş olamaz." }),
  userId: z.string().optional(), // userId optional for now
});

// Kullanıcının mesajını analiz eden yardımcı fonksiyon
function analyzeMessage(message: string, userId: string = 'default') {
  // Karşılaştırma için yeni normalizasyon fonksiyonunu kullan
  const normalizedMessage = normalizeTurkishTextForComparison(message);
  console.log(`[${userId}] Normalized message (for comparison): "${normalizedMessage}"`); // Log input

  // Kullanıcı bağlamını al veya oluştur
  let userContext = conversations.get(userId);
  if (!userContext) {
      console.log(`[${userId}] Creating new context.`);
    userContext = {
      context: '',
      lastInteraction: new Date(),
      messageCount: 0
    };
    conversations.set(userId, userContext);
  } else {
      // Clean up old conversations periodically (e.g., older than 1 hour) - Basic example
      const now = new Date();
      if (now.getTime() - userContext.lastInteraction.getTime() > 3600000) { // 1 hour
           console.log(`[${userId}] Context expired, creating new one.`);
          conversations.delete(userId);
          userContext = {
              context: '',
              lastInteraction: new Date(),
              messageCount: 0
          };
          conversations.set(userId, userContext);
      } else {
          console.log(`[${userId}] Using existing context. Last topic: ${userContext.lastTopic}`);
      }
  }


  // Mesaj sayısını ve son etkileşim zamanını güncelle
  userContext.messageCount++;
  userContext.lastInteraction = new Date();

  // Konuşma bağlamını güncelle
  if (userContext.lastTopic) {
    userContext.context += `Son konu: ${userContext.lastTopic}. `;
  }

  // Destinasyon kontrolü
  for (const [dest, info] of Object.entries(destinations)) {
    // Destinasyonu da aynı şekilde normalize et
    if (normalizedMessage.includes(normalizeTurkishTextForComparison(dest))) {
      console.log(`[${userId}] Destination match: "${dest}"`); // Log match
      userContext.lastTopic = dest;
      return {
        message: info,
        suggestedQuestions: [
          { id: 'tur_' + dest, question: `${dest.charAt(0).toUpperCase() + dest.slice(1)} turları ne kadar?` },
          { id: 'aktivite_' + dest, question: `${dest.charAt(0).toUpperCase() + dest.slice(1)}'da neler yapılabilir?` }
        ]
      };
    }
  }

  // Hızlı yanıt kontrolü
  const quickResponseTexts = [
    {text: "fiyatlar hakkında bilgi", key: "fiyat"},
    {text: "rezervasyon nasıl yapılır", key: "rezervasyon"},
    {text: "iptal politikası", key: "iptal"},
    {text: "ödeme seçenekleri", key: "ödeme"},
    {text: "iletişim bilgileri", key: "iletişim"},
    {text: "tur tarihleri", key: "tarih"},
    {text: "konaklama seçenekleri", key: "konaklama"},
    {text: "çocuklar için uygunluk", key: "çocuk"},
    {text: "indirim fırsatları", key: "indirim"},
    {text: "gerekli belgeler", key: "belge"},
    {text: "sürpriz organizasyon", key: "sürpriz"},
    {text: "hava durumu", key: "hava"}
  ];

  // Hızlı yanıt için tam metin kontrolü (Yeni normalizasyon ile)
  for (const item of quickResponseTexts) {
    // Hızlı yanıt metnini de aynı şekilde normalize et
    const normalizedText = normalizeTurkishTextForComparison(item.text);
    if (normalizedMessage === normalizedText) {
      console.log(`[${userId}] Quick response match: "${item.key}" (Normalized Text: "${normalizedText}")`); // Log match
      userContext.lastTopic = item.key;

      // İlgili sorular öner
      let suggestedQuestions;

      if (item.key === "fiyat") {
        suggestedQuestions = [
          { id: 'indirim', question: 'İndirim fırsatlarınız var mı?' },
          { id: 'ödeme', question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?' }
        ];
      } else if (item.key === "rezervasyon") {
        suggestedQuestions = [
          { id: 'iptal', question: 'İptal politikanız nedir?' },
          { id: 'belge', question: 'Rezervasyon için hangi belgeler gerekli?' }
        ];
      } else {
        // Rastgele 2 soru öner
        suggestedQuestions = faq
          .filter(q => q.id !== item.key)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
      }

      // Ensure response exists, otherwise use default
      const responseMessage = responses[item.key] ? responses[item.key] : defaultResponse;
      if (!responses[item.key]) {
          console.warn(`[${userId}] Missing response for quick response key: "${item.key}". Using default.`);
      }

      return {
        message: responseMessage,
        suggestedQuestions: suggestedQuestions || [] // Ensure suggestedQuestions is always an array
      };
    }
  }

  // Kullanıcının daha önce sorduğu soru ile ilgili takip sorusu olabilir mi?
  if (userContext.lastTopic && normalizedMessage.length < 15 &&
      (normalizedMessage.includes("evet") || // Bunlar zaten ASCII
       normalizedMessage.includes("hayir") ||
       normalizedMessage.includes("detay") ||
       normalizedMessage.includes("daha") ||
       normalizedMessage.includes("baska"))) {
     console.log(`[${userId}] Follow-up question detected for topic: "${userContext.lastTopic}"`); // Log match
    // Önceki konuyla ilgili takip sorusu
    const lastTopic = userContext.lastTopic;

    if (responses[lastTopic]) {
      // Konu hakkında daha fazla sorular öner
      let relatedQuestions;

      if (lastTopic === "fiyat") {
        relatedQuestions = [
          { id: 'indirim', question: 'İndirim fırsatlarınız var mı?' },
          { id: 'rezervasyon', question: 'Nasıl rezervasyon yapabilirim?' }
        ];
      } else if (lastTopic === "rezervasyon") {
        relatedQuestions = [
          { id: 'iptal', question: 'İptal politikanız nedir?' },
          { id: 'ödeme', question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?' }
        ];
      } else {
        // Rastgele 2 soru öner
        relatedQuestions = faq
          .filter(q => q.id !== lastTopic)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
      }

      return {
        message: `${responses[lastTopic]}\n\nBaşka bir sorunuz var mı?`,
        suggestedQuestions: relatedQuestions || [] // Ensure suggestedQuestions is always an array
      };
    } else {
        console.warn(`[${userId}] Missing response for follow-up topic: "${lastTopic}". Falling back.`);
    }
  }

  // Anahtar kelime tabanlı yanıtlar - Türkçe karakter duyarlılığı olmadan
  const keywords = [
    { terms: ["fiyat", "ucret", "ne kadar", "tutar", "para", "butce", "pahali", "ucuz"], key: "fiyat" },
    { terms: ["rezervasyon", "yer ayir", "nasil rezervasyon", "yer ayirtmak", "kayit"], key: "rezervasyon" },
    { terms: ["iptal", "iptal politikasi", "vazgec", "iade", "geri odeme"], key: "iptal" },
    { terms: ["odeme", "kredi karti", "havale", "taksit", "nakit", "para", "odeme yontemi"], key: "ödeme" },
    { terms: ["iletisim", "telefon", "adres", "numara", "mail", "e-posta", "ulasmak"], key: "iletişim" },
    { terms: ["tarih", "ne zaman", "hangi gun", "takvim", "ay", "yil", "tarihler"], key: "tarih" },
    { terms: ["merhaba", "merhabalar", "hello", "selam ver", "basla"], key: "merhaba" },
    { terms: ["selam", "selamlar", "hi", "hey", "herkese merhaba"], key: "selam" },
    { terms: ["tesekkur", "tesekkurler", "sagol", "sagolun", "tesekkur ederim"], key: "teşekkür" },
    { terms: ["konaklama", "otel", "hotel", "nerede kalicaz", "kalacak yer", "pansiyon"], key: "konaklama" },
    { terms: ["cocuk", "bebek", "infant", "aile", "yas siniri", "cocuklar"], key: "çocuk" },
    { terms: ["ulasim", "transfer", "arac", "otobus", "nasil gidecegiz", "yolculuk"], key: "ulaşım" },
    { terms: ["guvenlik", "emniyet", "guvenli mi", "tehlike", "risk", "onlem"], key: "güvenlik" },
    { terms: ["rehber", "tur lideri", "guide", "eslik", "bilgi veren"], key: "rehber" },
    { terms: ["yemek", "yiyecek", "icecek", "ogun", "kahvalti", "aksam yemegi", "menu"], key: "yemek" },
    { terms: ["internet", "wifi", "wi-fi", "baglanti", "online", "erisim"], key: "internet" },
    { terms: ["populer", "en iyi", "tavsiye", "oneri", "trend", "tercih"], key: "popüler" },
    { terms: ["bagaj", "valiz", "canta", "esya", "yanima ne almaliyim"], key: "bagaj" },
    { terms: ["vize", "pasaport", "kimlik", "seyahat belgesi", "evrak"], key: "vize" },
    { terms: ["indirim", "kampanya", "promosyon", "kupon", "avantaj"], key: "indirim" },
    { terms: ["belge", "dokuman", "gerekli evraklar", "yanimda ne getirmeli"], key: "belge" },
    { terms: ["surpriz", "organizasyon", "kutlama", "dogum gunu", "ozel gun", "evlilik teklifi"], key: "sürpriz" },
    { terms: ["hava", "hava durumu", "mevsim", "iklim", "yagmur", "sicaklik", "soguk"], key: "hava" }
  ];

  // Kelime bazlı kontrol (Yeni normalizasyon ile)
  console.log(`[${userId}] Starting keyword check for: "${normalizedMessage}"`); // Log start
  for (const { terms, key } of keywords) {
    const isMatch = terms.some(term => {
        // Anahtar kelime terimini de aynı şekilde normalize et
        const normalizedTerm = normalizeTurkishTextForComparison(term);
        const check = normalizedMessage.includes(normalizedTerm);
        // Add detailed comparison logging
        console.log(`[${userId}]   -- Comparing Msg: "${normalizedMessage}" | Term: "${term}" (Normalized: "${normalizedTerm}") | Includes? ${check}`);
        return check;
    });

    if (isMatch) {
      // Eşleşen terimi loglamak için küçük bir ekleme (debugging için)
       const matchingTerm = terms.find(term => normalizedMessage.includes(normalizeTurkishTextForComparison(term)));
      console.log(`[${userId}] Keyword match FOUND: key="${key}" (Matching Term Original: "${matchingTerm}")`); // Log success
      userContext.lastTopic = key;

      // İlgili sorular öner (önceki mantıkla benzer)
      let suggestedQuestions = faq
          .filter(q => q.id !== key)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

      // Ensure response exists, otherwise use default
      const responseMessage = responses[key] ? responses[key] : defaultResponse;
       if (!responses[key]) {
           console.warn(`[${userId}] Missing response for keyword key: "${key}". Using default.`);
       }

      return {
        message: responseMessage,
        suggestedQuestions: suggestedQuestions || [] // Ensure suggestedQuestions is always an array
      };
    }
  }

  // Eşleşme bulunamazsa varsayılan yanıtı ve rastgele soruları ver
  console.log(`[${userId}] No match found. Returning default response.`); // Log default case
  userContext.lastTopic = undefined; // Reset topic if no match
  return {
    message: defaultResponse,
    suggestedQuestions: faq.sort(() => 0.5 - Math.random()).slice(0, 3) // Suggest 3 random general questions
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and Validate Request Body
    const body = await request.json();
    const validationResult = chatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error.errors);
      // Return structured error response
      return NextResponse.json({
        success: false,
        error: "Geçersiz istek: " + validationResult.error.errors.map(e => e.message).join(', ')
      }, { status: 400 }); // Bad Request
    }

    const { message, userId } = validationResult.data;

    // 2. Analyze Message and Get Response
    const responseData = analyzeMessage(message, userId);

    // 3. Return Successful Response
    return NextResponse.json({
      success: true,
      message: responseData.message,
      suggestedQuestions: responseData.suggestedQuestions,
      timestamp: new Date().toISOString() // Add timestamp to response
    });

  } catch (error) {
    // 4. Handle Unexpected Errors
    console.error("Chat API Error:", error);

    // Log the error appropriately (e.g., using a logging service)

    // Return generic error response
    return NextResponse.json({
      success: false,
      error: "Bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin."
    }, { status: 500 }); // Internal Server Error
  }
}
