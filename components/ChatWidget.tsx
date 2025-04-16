"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, BellRing, Smile, ThumbsUp } from "lucide-react";
import Image from "next/image";
import axios from "axios";

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  rich?: boolean;
  suggestedQuestions?: SuggestedQuestion[];
};

type SuggestedQuestion = {
  id: string;
  question: string;
};

const initialMessages: Message[] = [
  {
    id: "welcome-message",
    text: "Merhaba! 👋 TourTech destek ekibi olarak size nasıl yardımcı olabiliriz?",
    isBot: true,
    timestamp: new Date(),
    rich: true,
    suggestedQuestions: [
      { id: 'price', question: 'Fiyatlar hakkında bilgi' },
      { id: 'reservation', question: 'Rezervasyon nasıl yapılır' },
      { id: 'cancellation', question: 'İptal politikası' },
      { id: 'popular', question: 'En popüler turları göster' },
    ]
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
  const [userId, setUserId] = useState<string>(''); // Kullanıcı ID'si için state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRenderRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Kullanıcı ID'si oluşturma
  useEffect(() => {
    // Eğer yerel depolamada bir kullanıcı ID'si varsa onu al
    const storedUserId = localStorage.getItem('chat_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Yoksa yeni bir ID oluştur ve kaydet
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(newUserId);
      localStorage.setItem('chat_user_id', newUserId);
    }
  }, []);

  // Ses efekti için referans oluşturma
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('/sounds/message.mp3');
      audioRef.current.volume = 0.4;
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
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Ses çalma hatası:", error);
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
    await new Promise((resolve) => setTimeout(resolve, 800));
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
        userId: userId, // Kullanıcı ID'sini gönder
      });

      // Önerilen soruları al
      const suggestedQuestions = response.data.suggestedQuestions || [];

      // Bot yanıtı
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: await simulateTyping(response.data.message),
        isBot: true,
        timestamp: new Date(response.data.timestamp),
        rich: true,
        suggestedQuestions: suggestedQuestions
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
  
  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
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
    const highlightTerms = ['%100', '%75', '%50', 'iade', 'TourTech Wallet', 'Fethiye', 'Kapadokya', 'İstanbul', 'Pamukkale', 'Antalya'];
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

  // Emojiler
  const emojis = ["😊", "👍", "🙏", "❤️", "👋", "🌟", "🏖️", "🧳", "🗺️", "✈️", "🏨", "🏞️", "🚌", "🎫"];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col ${
          isMobile ? 'fixed inset-x-2 top-20 bottom-2' : 'w-[350px] sm:w-[380px] h-[500px]'
        } border border-gray-100 dark:border-gray-700 overflow-hidden transition-all animate-fadeIn`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
        }}
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                <Image 
                  src="/images/chat-bot.png" 
                  alt="TourTech Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%232563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium text-base">TourTech Destek</h3>
                <div className="flex items-center text-xs text-blue-100">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block mr-1.5 animate-pulse"></span>
                  <span>Çevrimiçi</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={requestNotificationPermission}
                className="text-white hover:bg-blue-500 p-1.5 rounded-full transition-colors"
                title="Bildirimlere izin ver"
              >
                <BellRing className="h-4 w-4" />
              </button>
              <button
                onClick={clearChat}
                className="text-white hover:bg-blue-500 p-1.5 rounded-full transition-colors"
                title="Sohbeti temizle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-blue-500 p-1.5 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className="flex flex-col gap-2"
              >
                <div
                  className={`flex ${
                    msg.isBot ? "justify-start" : "justify-end"
                  } animate-fadeIn`}
                >
                  {msg.isBot && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 mr-2 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.isBot
                        ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm"
                        : "bg-blue-500 text-white"
                    }`}
                    style={{
                      borderTopLeftRadius: msg.isBot ? '4px' : '16px',
                      borderTopRightRadius: !msg.isBot ? '4px' : '16px',
                    }}
                  >
                    {msg.rich ? (
                      <div className="text-sm" dangerouslySetInnerHTML={{ __html: formatRichText(msg.text) }}></div>
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {msg.isBot && (
                        <button 
                          className="text-xs opacity-50 hover:opacity-100 transition-all" 
                          title="Bu yanıt faydalı oldu"
                          onClick={() => alert('Teşekkürler! Geri bildiriminiz alındı.')}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  {!msg.isBot && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 ml-2 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Siz</span>
                    </div>
                  )}
                </div>
                
                {/* Önerilen Sorular */}
                {msg.isBot && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="ml-10 flex flex-wrap gap-2 animate-fadeIn">
                    {msg.suggestedQuestions.map((q, qIndex) => (
                      <button
                        key={`${msg.id}-${q.id}-${qIndex}`}
                        onClick={() => handleSuggestedQuestion(q.question)}
                        className="text-xs bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-full border border-blue-100 dark:border-gray-600 transition-colors"
                      >
                        {q.question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTypingAnimation && (
              <div className="flex justify-start animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 mr-2 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm"
                  style={{ borderTopLeftRadius: '4px' }}>
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

          {/* Hızlı Yanıtlar */}
          {messages.length <= 3 && (
            <div className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button 
                onClick={() => setShowQuickResponses(!showQuickResponses)}
                className="w-full px-3 py-2 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Hızlı Yanıtlar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${showQuickResponses ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className={`transition-all duration-200 overflow-y-auto ${
                showQuickResponses ? 'max-h-56 opacity-100 p-3' : 'max-h-0 opacity-0 p-0'
              }`}>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response) => (
                    <button
                      key={response.id}
                      onClick={() => handleQuickResponse(response.text)}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors border border-gray-100 dark:border-gray-600 flex-shrink-0"
                    >
                      {response.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojis && (
            <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fadeIn">
              <div className="flex flex-wrap gap-1 justify-center">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <span className="text-lg">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mesajınızı yazın..."
                  className="w-full py-2 px-4 pr-10 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={input.trim() === "" || isLoading}
                className="bg-blue-500 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative animate-fadeIn">
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center shadow-md border-2 border-white">
              {unreadCount}
            </div>
          )}
          <button
            onClick={toggleChat}
            className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition-colors"
            aria-label="Destek Sohbeti Aç"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
} 