"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, BellRing, Smile, Paperclip, Image as ImageIcon, ThumbsUp } from "lucide-react";
import Image from "next/image";
import axios from "axios";

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  rich?: boolean;
};

const initialMessages: Message[] = [
  {
    id: "welcome-message",
    text: "Merhaba! 👋 TourTech destek ekibi olarak size nasıl yardımcı olabiliriz?",
    isBot: true,
    timestamp: new Date(),
    rich: true,
  },
];

// Hızlı yanıt butonları için sık sorulan sorular
const quickResponses = [
  { id: 'price', text: 'Fiyatlar hakkında bilgi' },
  { id: 'reservation', text: 'Rezervasyon nasıl yapılır' },
  { id: 'cancellation', text: 'İptal politikası' },
  { id: 'payment', text: 'Ödeme seçenekleri' },
  { id: 'contact', text: 'İletişim bilgileri' },
  { id: 'dates', text: 'Tur tarihleri' },
  { id: 'accommodation', text: 'Konaklama seçenekleri' },
  { id: 'child', text: 'Çocuklar için uygunluk' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRenderRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ses efekti için referans oluşturma
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('/sounds/message.mp3');
      audioRef.current.volume = 0.6;
      // Safari için preload
      audioRef.current.load();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Ses çalma fonksiyonu
  const playNotificationSound = () => {
    if (audioRef.current) {
      // Sesi baştan oynatmak için
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      // Play fonksiyonu bir Promise döner, bunu kullanarak olası hataları yakalayabiliriz
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Ses başarıyla çalınıyor
            console.log("Bildirim sesi çalınıyor");
          })
          .catch(error => {
            // AutoPlay engellenmişse veya başka bir hata varsa
            console.error("Ses çalma hatası:", error);
            
            // Yedek olarak yeni bir ses örneği oluşturup çalmayı deneyelim
            try {
              const backupSound = new Audio('/sounds/message.mp3');
              backupSound.volume = 0.6;
              backupSound.play().catch(e => console.error("Yedek ses çalma hatası:", e));
            } catch (backupError) {
              console.error("Yedek ses oluşturma hatası:", backupError);
            }
          });
      }
    }
  };

  // Ekran boyutunu kontrol et
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mesaj geçmişini yerel depolamadan yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chat_messages');
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages, (key, value) => {
            if (key === 'timestamp') return new Date(value);
            return value;
          });
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Mesaj geçmişi yüklenirken hata oluştu:', error);
        }
      }
      
      firstRenderRef.current = false;
    }
  }, []);

  // Mesaj geçmişini yerel depolamaya kaydet
  useEffect(() => {
    if (typeof window !== 'undefined' && !firstRenderRef.current) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Okunmamış mesaj sayacını güncelleyin
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastReadIndex = parseInt(localStorage.getItem('last_read_index') || '0');
      setUnreadCount(messages.length - lastReadIndex);
    } else {
      setUnreadCount(0);
      if (typeof window !== 'undefined') {
        localStorage.setItem('last_read_index', messages.length.toString());
      }
    }
  }, [isOpen, messages.length]);

  // Chat açıldığında inputa odaklan
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      if (typeof window !== 'undefined') {
        localStorage.setItem('last_read_index', messages.length.toString());
      }
    }
  };

  const clearChat = () => {
    if (window.confirm('Tüm sohbet geçmişini silmek istediğinize emin misiniz?')) {
      setMessages(initialMessages);
      localStorage.removeItem('chat_messages');
      localStorage.removeItem('last_read_index');
      setUnreadCount(0);
    }
  };

  const simulateTyping = async (text: string) => {
    setIsTypingAnimation(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsTypingAnimation(false);
    return text;
  };

  const handleSendMessage = async (text = input) => {
    if (text.trim() === "") return;

    // Kullanıcı mesajı
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowEmojis(false);

    try {
      // API'ye istek gönder
      const response = await axios.post("/api/chat", {
        message: text,
      });

      // Bot yanıtı
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: await simulateTyping(response.data.message),
        isBot: true,
        timestamp: new Date(response.data.timestamp),
        rich: true,
      };

      setMessages((prev) => [...prev, botResponse]);
      
      // Sohbet penceresi açık değilse, bildirim göster
      if (!isOpen && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('TourTech Destek', {
          body: botResponse.text.substring(0, 100) + (botResponse.text.length > 100 ? '...' : ''),
          icon: '/favicon.ico'
        });
      }

      // Ses efekti
      if (!isOpen) {
        playNotificationSound();
      }
    } catch (error) {
      console.error("Chat API hatası:", error);
      
      // Hata durumunda kullanıcıya bilgi ver
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Özür dileriz, mesajınız iletilemedi. Lütfen daha sonra tekrar deneyin.",
        isBot: true,
        timestamp: new Date(),
        rich: true,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickResponse = (text: string) => {
    handleSendMessage(text);
  };

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const formatRichText = (text: string) => {
    if (!text) return '';
    
    // Satır sonlarını <br> ile değiştir
    let formattedText = text.replace(/\n/g, '<br>');
    
    // Madde işaretli listeleri formatla
    formattedText = formattedText.replace(/•\s(.*?)(<br>|$)/g, '<li>$1</li>');
    if (formattedText.includes('<li>')) {
      formattedText = formattedText.replace(/<li>(.*?)<\/li>/g, '<ul class="list-disc pl-5 my-2">$&</ul>');
      formattedText = formattedText.replace(/<\/ul><ul class="list-disc pl-5 my-2">/g, '');
    }
    
    // Numaralı listeleri formatla
    formattedText = formattedText.replace(/(\d+)\.\s(.*?)(<br>|$)/g, '<li>$2</li>');
    if (formattedText.includes('<li>') && !formattedText.includes('list-disc')) {
      formattedText = formattedText.replace(/<li>(.*?)<\/li>/g, '<ol class="list-decimal pl-5 my-2">$&</ol>');
      formattedText = formattedText.replace(/<\/ol><ol class="list-decimal pl-5 my-2">/g, '');
    }
    
    // Emojileri vurgula
    formattedText = formattedText.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '<span class="text-lg">$1</span>');
    
    // Önemli terimleri vurgulamak için
    const highlightTerms = ['%100', '%75', '%50', 'iade', 'TourTech Wallet', 'Fethiye', 'Kapadokya', 'İstanbul', 'Pamukkale'];
    highlightTerms.forEach(term => {
      formattedText = formattedText.replace(new RegExp(term, 'g'), `<span class="font-semibold text-blue-600 dark:text-blue-400">${term}</span>`);
    });
    
    return formattedText;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTypingAnimation]);

  // Emojiler - daha çok turizm temalı emoji ekledim
  const emojis = ["😊", "👍", "🙏", "❤️", "👋", "🌟", "🏖️", "🧳", "🗺️", "✈️", "🏨", "🏞️", "🚌", "🎫", "💰", "🎉", "🤔", "🌅", "🌊", "🏝️", "🏔️", "🚢", "🍽️", "📸"];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col ${
          isMobile ? 'fixed inset-x-2 top-20 bottom-2' : 'w-[350px] sm:w-[400px] h-[550px]'
        } border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 animate-zoomIn`}
        style={{
          boxShadow: '0 10px 40px -5px rgba(59, 130, 246, 0.3), 0 8px 20px -6px rgba(59, 130, 246, 0.25)'
        }}
        >
          {/* Chat Header - Ultra Modern Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white p-4 flex justify-between items-center relative overflow-hidden">
            {/* Animasyonlu arka plan deseni */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" 
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px',
                  animation: 'slide 20s linear infinite'
                }}
              ></div>
            </div>
            
            <div className="flex items-center space-x-3 z-10">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white overflow-hidden">
                <Image 
                  src="/images/chat-bot.png" 
                  alt="TourTech Logo"
                  width={34}
                  height={34}
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%232563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-wide">TourTech Destek</h3>
                <div className="flex items-center text-xs text-blue-100">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-1.5 animate-pulse shadow-sm"></span>
                  <span className="font-medium">Çevrimiçi</span> • Hemen yanıt verir
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 z-10">
              <button
                onClick={requestNotificationPermission}
                className="text-white hover:text-gray-200 transition-all p-2 hover:bg-white/10 rounded-full"
                title="Bildirimlere izin ver"
              >
                <BellRing className="h-5 w-5" />
              </button>
              <button
                onClick={clearChat}
                className="text-white hover:text-gray-200 transition-all p-2 hover:bg-white/10 rounded-full"
                title="Sohbeti temizle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-all p-2 hover:bg-white/10 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages - Ultra Modern Görünüm */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
              }}>
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isBot ? "justify-start" : "justify-end"
                } animate-fadeIn`}
              >
                {msg.isBot && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 mr-2 flex items-center justify-center shadow-lg p-2 border border-blue-400">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200 ${
                    msg.isBot
                      ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 hover:shadow-lg"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg"
                  }`}
                  style={{
                    borderTopLeftRadius: msg.isBot ? '0.5rem' : '1rem',
                    borderTopRightRadius: !msg.isBot ? '0.5rem' : '1rem',
                  }}
                >
                  {msg.rich ? (
                    <div className="text-sm space-y-1.5" dangerouslySetInnerHTML={{ __html: formatRichText(msg.text) }}></div>
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {msg.isBot && (
                      <button 
                        className="text-xs opacity-50 hover:opacity-100 transition-all hover:scale-110 transform" 
                        title="Bu yanıt faydalı oldu"
                        onClick={() => alert('Teşekkürler! Geri bildiriminiz alındı.')}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {!msg.isBot && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 ml-2 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-medium">Siz</span>
                  </div>
                )}
              </div>
            ))}
            {isTypingAnimation && (
              <div className="flex justify-start animate-fadeIn">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 mr-2 flex items-center justify-center shadow-lg p-2 border border-blue-400">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-md border border-gray-100 dark:border-gray-700"
                  style={{ borderTopLeftRadius: '0.5rem' }}>
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            {isLoading && !isTypingAnimation && (
              <div className="flex justify-start animate-fadeIn">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 mr-2 flex items-center justify-center shadow-lg p-2 border border-blue-400">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-md border border-gray-100 dark:border-gray-700"
                  style={{ borderTopLeftRadius: '0.5rem' }}>
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Hızlı Yanıtlar - Geliştirilmiş UI ve Kapanır/Açılır Panel */}
          {messages.length <= 5 && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              {/* Açılır Kapanır Panel Başlığı */}
              <button 
                onClick={() => setShowQuickResponses(!showQuickResponses)}
                className="w-full px-4 py-3 flex justify-between items-center group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.5 14.25L14.5 9.25M8.75 9.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM15.25 16.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
                      </svg>
                    </span>
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Hızlı Yanıtlar</span>
                  </div>
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">PRO TİP</span>
                </div>
                <div className={`transform transition-transform duration-300 ${showQuickResponses ? 'rotate-180' : 'rotate-0'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
              
              {/* Açılır Kapanır Panel İçeriği */}
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  showQuickResponses 
                    ? 'max-h-80 opacity-100 py-3 px-4' 
                    : 'max-h-0 opacity-0 py-0 px-4'
                }`}
              >
                <div className="grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar pr-1">
                  {quickResponses.map((response) => (
                    <button
                      key={response.id}
                      onClick={() => handleQuickResponse(response.text)}
                      className="whitespace-nowrap px-3 py-2.5 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-105 transform hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 text-left truncate"
                    >
                      <span className="truncate">{response.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Emoji Picker - Ultra Modern Görünüm */}
          {showEmojis && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fadeIn">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-2 shadow-inner">
                <div className="flex flex-wrap gap-1 justify-center">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-sm"
                    >
                      <span className="text-xl">{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Input - Ultra Modern */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mesajınızı yazın..."
                  className="w-full py-3 px-5 pr-12 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-all duration-200 shadow-inner hover:bg-white dark:hover:bg-gray-800 placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={input.trim() === "" || isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-105 transform disabled:hover:scale-100 shadow-md disabled:shadow-none"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center items-center space-x-1 mt-3">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              <p className="text-xs text-center text-gray-400">
                TourTech ile anında yardım alın - <span className="text-blue-500 font-medium">7/24 hizmetinizdeyiz</span>
              </p>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative animate-fadeIn">
          {unreadCount > 0 && (
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
              {unreadCount}
            </div>
          )}
          <button
            onClick={toggleChat}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:rotate-3 relative overflow-hidden group"
            aria-label="Destek Sohbeti Aç"
            style={{ 
              boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.5), 0 5px 15px -5px rgba(59, 130, 246, 0.3)' 
            }}
          >
            {/* Animasyonlu arka plan efekti */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Dalgalı animasyon efekti */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.3)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"></div>
            
            <MessageCircle className="h-6 w-6 relative z-10" />
          </button>
        </div>
      )}
      <style jsx>{`
        @keyframes slide {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
} 