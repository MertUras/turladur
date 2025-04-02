import { NextRequest, NextResponse } from "next/server";

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

  "vize": "Yurt dışı turlarımız için vize gereksinimleri ülkelere göre değişmektedir. Rezervasyon sırasında vize işlemleri konusunda size bilgi verilecektir. Ayrıca, ekstra bir ücret karşılığında vize danışmanlık hizmeti de sunmaktayız."
};

// Yanıt vermek için varsayılan mesaj
const defaultResponse = "Sorunuz için teşekkürler! Şu anda bu konu hakkında detaylı bilgi veremiyorum, ancak müşteri temsilcilerimizden biri en kısa sürede size yardımcı olacaktır. Başka bir konuda yardımcı olabilir miyim?";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    // Mesaj içeriğine göre yanıt verme
    let response = defaultResponse;
    
    // Basit anahtar kelime kontrolü
    const lowercaseMessage = message.toLowerCase().trim();

    // Hızlı yanıtların tam metninin kontrolü - Önce bunu kontrol edelim
    const quickResponseTexts = [
      {text: "fiyatlar hakkında bilgi", key: "fiyat"},
      {text: "rezervasyon nasıl yapılır", key: "rezervasyon"},
      {text: "iptal politikası", key: "iptal"},
      {text: "ödeme seçenekleri", key: "ödeme"},
      {text: "iletişim bilgileri", key: "iletişim"},
      {text: "tur tarihleri", key: "tarih"},
      {text: "konaklama seçenekleri", key: "konaklama"},
      {text: "çocuklar için uygunluk", key: "çocuk"}
    ];

    // Hızlı yanıt düğmelerinden birinin tam metni ile eşleşme kontrolü
    const exactMatch = quickResponseTexts.find(item => 
      lowercaseMessage === item.text.toLowerCase());
    
    if (exactMatch) {
      console.log("Hızlı yanıt eşleşmesi bulundu:", exactMatch.key);
      return NextResponse.json({
        message: responses[exactMatch.key],
        timestamp: new Date().toISOString(),
      });
    }
    
    // İptal politikası için özel kontrol - çeşitli varyasyonlarla eşleşecek şekilde
    if (lowercaseMessage.includes("iptal politikası") || 
        lowercaseMessage.includes("iptal politika") ||
        lowercaseMessage.includes("iade politika") ||
        lowercaseMessage.includes("iptal şartları") ||
        lowercaseMessage.includes("iptal koşulları") ||
        lowercaseMessage === "iptal" ||
        lowercaseMessage === "iptal politikası" ||
        lowercaseMessage === "iptaller" ||
        lowercaseMessage === "tur iptal" ||
        lowercaseMessage === "iade" ||
        (lowercaseMessage.includes("iptal") && lowercaseMessage.length < 20)) {
      console.log("İptal politikası sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({ 
        message: responses["iptal"],
        timestamp: new Date().toISOString(),
      });
    }

    // Fiyat sorguları için özel kontrol
    if (lowercaseMessage === "fiyat" || 
        lowercaseMessage === "fiyatlar" ||
        lowercaseMessage === "fiyatlar hakkında" ||
        lowercaseMessage === "fiyatlar hakkında bilgi" ||
        lowercaseMessage.includes("fiyat") && lowercaseMessage.length < 25) {
      console.log("Fiyat sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({
        message: responses["fiyat"],
        timestamp: new Date().toISOString(),
      });
    }

    // Rezervasyon sorguları için özel kontrol
    if (lowercaseMessage === "rezervasyon" || 
        lowercaseMessage === "rezervasyon nasıl yapılır" ||
        lowercaseMessage.includes("rezervasyon nasıl") ||
        (lowercaseMessage.includes("rezervasyon") && lowercaseMessage.length < 30)) {
      console.log("Rezervasyon sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({
        message: responses["rezervasyon"],
        timestamp: new Date().toISOString(),
      });
    }

    // Ödeme sorguları için özel kontrol
    if (lowercaseMessage === "ödeme" || 
        lowercaseMessage === "ödeme seçenekleri" ||
        lowercaseMessage.includes("ödeme seçenek") ||
        (lowercaseMessage.includes("ödeme") && lowercaseMessage.length < 25)) {
      console.log("Ödeme sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({
        message: responses["ödeme"],
        timestamp: new Date().toISOString(),
      });
    }

    // İletişim sorguları için özel kontrol
    if (lowercaseMessage === "iletişim" || 
        lowercaseMessage === "iletişim bilgileri" ||
        lowercaseMessage.includes("iletişim bilgi") ||
        (lowercaseMessage.includes("iletişim") && lowercaseMessage.length < 25)) {
      console.log("İletişim sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({
        message: responses["iletişim"],
        timestamp: new Date().toISOString(),
      });
    }

    // Tur tarihleri sorguları için özel kontrol
    if (lowercaseMessage === "tur tarihleri" || 
        lowercaseMessage === "tarihler" ||
        lowercaseMessage.includes("tur tarih") ||
        (lowercaseMessage.includes("tarih") && lowercaseMessage.includes("tur"))) {
      console.log("Tur tarihleri sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({
        message: responses["tarih"],
        timestamp: new Date().toISOString(),
      });
    }

    // Konaklama sorguları için özel kontrol
    if (lowercaseMessage === "konaklama" || 
        lowercaseMessage === "konaklama seçenekleri" ||
        lowercaseMessage.includes("konaklama seçenek") ||
        (lowercaseMessage.includes("konaklama") && lowercaseMessage.length < 30)) {
      console.log("Konaklama sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({
        message: responses["konaklama"],
        timestamp: new Date().toISOString(),
      });
    }

    // Çocuk sorguları için özel kontrol
    if (lowercaseMessage === "çocuklar için uygunluk" || 
        lowercaseMessage.includes("çocuk") && lowercaseMessage.includes("uygun") ||
        (lowercaseMessage.includes("çocuk") && lowercaseMessage.length < 25)) {
      console.log("Çocuk sorgusu yakalandı:", lowercaseMessage);
      return NextResponse.json({
        message: responses["çocuk"],
        timestamp: new Date().toISOString(),
      });
    }
    
    // Anahtar kelimeleri kontrol et - Eğer özel kontrollerden geçemediyse buraya düşecek
    const keywords = [
      { terms: ["fiyat", "ücret", "ne kadar", "tutar", "para", "bütçe", "pahalı", "ucuz"], key: "fiyat" },
      { terms: ["rezervasyon", "yer ayır", "nasıl rezervasyon", "yer ayırtmak", "kayıt"], key: "rezervasyon" },
      { terms: ["iptal", "iptal politikası", "vazgeç", "iade", "geri ödeme", "iptal politika", "iptal koşul", "iptal şart", "iptal edilir", "iptal etmek", "iptal nedir", "iptal durumunda", "iptal olur", "iptal edilebilir", "iptal hakkında"], key: "iptal" },
      { terms: ["ödeme", "kredi kartı", "havale", "taksit", "nakit", "para", "ödeme yöntemi"], key: "ödeme" },
      { terms: ["iletişim", "telefon", "adres", "numara", "mail", "e-posta", "ulaşmak"], key: "iletişim" },
      { terms: ["tarih", "ne zaman", "hangi gün", "takvim", "ay", "yıl", "tarihler"], key: "tarih" },
      { terms: ["merhaba", "merhabalar", "hello", "selam ver", "başla"], key: "merhaba" },
      { terms: ["selam", "selamlar", "hi", "hey", "herkese merhaba"], key: "selam" },
      { terms: ["teşekkür", "teşekkürler", "sağol", "sağolun", "teşekkür ederim"], key: "teşekkür" },
      { terms: ["konaklama", "otel", "hotel", "nerede kalıcaz", "kalacak yer", "pansiyon"], key: "konaklama" },
      { terms: ["çocuk", "bebek", "infant", "aile", "yaş sınırı", "çocuklar"], key: "çocuk" },
      { terms: ["ulaşım", "transfer", "araç", "otobüs", "nasıl gideceğiz", "yolculuk"], key: "ulaşım" },
      { terms: ["güvenlik", "emniyet", "güvenli mi", "tehlike", "risk", "önlem"], key: "güvenlik" },
      { terms: ["rehber", "tur lideri", "guide", "eşlik", "bilgi veren"], key: "rehber" },
      { terms: ["yemek", "yiyecek", "içecek", "öğün", "kahvaltı", "akşam yemeği", "menü"], key: "yemek" },
      { terms: ["internet", "wifi", "wi-fi", "bağlantı", "online", "erişim"], key: "internet" },
      { terms: ["popüler", "en iyi", "tavsiye", "öneri", "trend", "tercih"], key: "popüler" },
      { terms: ["bagaj", "valiz", "çanta", "eşya", "yanıma ne almalıyım"], key: "bagaj" },
      { terms: ["vize", "pasaport", "kimlik", "seyahat belgesi", "evrak"], key: "vize" }
    ];
    
    // Tam eşleşme kontrolü
    for (const item of keywords) {
      if (item.terms.some(term => lowercaseMessage.includes(term))) {
        response = responses[item.key];
        break;
      }
    }
    
    // Hiçbir eşleşme yoksa, anlamlı bir mesaj vereceğiz
    if (response === defaultResponse) {
      // Diğer akıllı kontroller
      if (lowercaseMessage.includes('iptal') || lowercaseMessage.includes('iade')) {
        response = responses['iptal'];
      }
      else if (lowercaseMessage.includes('tur') && 
         (lowercaseMessage.includes('en iyi') || lowercaseMessage.includes('popüler'))) {
        response = responses['popüler'];
      } 
      else if (lowercaseMessage.includes('yardım') || lowercaseMessage.includes('yardımcı')) {
        response = "Size nasıl yardımcı olabilirim? 😊 Fiyatlar, rezervasyon, popüler turlar veya başka bir konu hakkında bilgi almak isterseniz sorabilirsiniz.";
      }
      else if (lowercaseMessage.length < 10) {
        response = "Daha detaylı bir soru sorarsanız size daha iyi yardımcı olabilirim. Tur, rezervasyon, fiyatlar veya başka bir konu hakkında bilgi almak ister misiniz?";
      }
    }
    
    // API yanıt gecikme simülasyonu (gerçek bir API'de bu kaldırılmalı)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API hatası:", error);
    return NextResponse.json(
      { error: "Mesajınız işlenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
} 