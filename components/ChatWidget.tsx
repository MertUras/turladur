"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { Send, X, MessageCircle, BellRing, Smile, ThumbsUp, Trash2, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { Transition, Dialog } from "@headlessui/react";

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  rich?: boolean;
  suggestedQuestions?: SuggestedQuestion[];
  hideSuggested?: boolean;
  feedbackGiven?: boolean;
  isError?: boolean;
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
  const [userId, setUserId] = useState<string>('');
  const [hiddenSuggestions, setHiddenSuggestions] = useState<Record<string, boolean>>({});
  const [feedbackStates, setFeedbackStates] = useState<Record<string, boolean>>({});
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRenderRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Kullanıcı ID'si oluşturma
  useEffect(() => {
    const storedUserId = localStorage.getItem('chat_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
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

  const openClearConfirm = () => {
    setIsClearConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    setMessages(initialMessages);
    localStorage.removeItem('chat_messages');
    localStorage.removeItem('last_read_index');
    setUnreadCount(0);
    setIsClearConfirmOpen(false);
  };

  const simulateTyping = async (text: string) => {
    setIsTypingAnimation(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsTypingAnimation(false);
    return text;
  };

  const handleSendMessage = async (text = input) => {
    if (text.trim() === "") return;

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
    setHiddenSuggestions({});

    try {
      const response = await axios.post("/api/chat", {
        message: text,
        userId: userId,
      });

      if (response.data && response.data.success) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.message,
          isBot: true,
          timestamp: new Date(response.data.timestamp),
          rich: true,
          suggestedQuestions: response.data.suggestedQuestions || [],
          hideSuggested: false,
          feedbackGiven: false,
        };
        // Simulate typing before adding bot response
        await simulateTyping(response.data.message);
        setMessages((prev) => [...prev, botResponse]);

        if (!isOpen) {
           if ('Notification' in window && Notification.permission === 'granted') {
             new Notification('TourTech Destek', {
               body: botResponse.text.substring(0, 100) + (botResponse.text.length > 100 ? '...' : ''),
               icon: '/favicon.ico'
             });
           }
           playNotificationSound();
        }
      } else {
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.data.error || "Beklenmedik bir sunucu hatası oluştu.",
            isBot: true,
            timestamp: new Date(),
            rich: false,
            isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }

    } catch (error) {
      console.error("Chat API hatası:", error);
      let errorText = "Mesajınız gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
          errorText = axiosError.response.data.error;
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isBot: true,
        timestamp: new Date(),
        rich: false,
        isError: true,
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

  const handleSuggestedQuestion = (question: string, messageId: string) => {
    setHiddenSuggestions(prev => ({ ...prev, [messageId]: true }));
    handleSendMessage(question);
  };

  const handleFeedbackClick = (messageId: string) => {
      setFeedbackStates(prev => ({ ...prev, [messageId]: true }));
  };

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const formatRichText = (text: string) => {
    if (!text) return '';
    let formattedText = text.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/•\s(.*?)(<br>|$)/g, '<li class="ml-4">$1</li>');
    if (formattedText.includes('<li>')) {
      formattedText = formattedText.replace(/<li>(.*?)<\/li>/g, '<ul class="list-disc list-outside mb-1">$&</ul>').replace(/<\/ul><ul/g, '<ul');
    }
    formattedText = formattedText.replace(/(\d+)\.\s(.*?)(<br>|$)/g, '<li class="ml-4">$2</li>');
    if (formattedText.includes('<li>') && !formattedText.includes('list-disc')) {
      formattedText = formattedText.replace(/<li>(.*?)<\/li>/g, '<ol class="list-decimal list-outside mb-1">$&</ol>').replace(/<\/ol><ol/g, '<ol');
    }
    formattedText = formattedText.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '<span class="inline-block align-middle">$1</span>');
    const highlightTerms = ['%100', '%75', '%50', 'iade', 'TourTech Wallet', 'Fethiye', 'Kapadokya', 'İstanbul', 'Pamukkale', 'Antalya'];
    highlightTerms.forEach(term => {
      formattedText = formattedText.replace(new RegExp(term, 'g'), `<span class="font-medium text-sky-600 dark:text-sky-400">${term}</span>`);
    });
    return formattedText;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTypingAnimation]);

  const emojis = ["😊", "👍", "🙏", "❤️", "👋", "🌟", "🏖️", "🧳", "🗺️", "✈️", "🏨", "🏞️", "🚌", "🎫"];

  return (
    <Fragment>
      <div className="fixed bottom-5 right-5 z-[1000]">
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={`bg-white dark:bg-neutral-900 rounded-lg shadow-lg flex flex-col ${
            isMobile ? 'fixed inset-x-2 top-16 bottom-4' : 'w-80 md:w-96 h-[500px] md:h-[600px]'
          } border border-neutral-200 dark:border-neutral-700 overflow-hidden`}
          >
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-3 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9">
                  <Image
                    src="/images/chat-bot.png"
                    alt="Destek Avatarı"
                    fill
                    className="rounded-full object-cover bg-neutral-100 dark:bg-neutral-800"
                     onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.outerHTML = `<span class="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500"><MessageCircle size={20} /></span>`;
                    }}
                  />
                   <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-neutral-900"></span>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-100">TourTech Destek</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Genellikle hemen yanıt verir</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                   onClick={openClearConfirm}
                   className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                   title="Sohbeti temizle"
                   aria-label="Sohbet geçmişini temizle"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={toggleChat}
                   className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors ml-1"
                  aria-label="Sohbet penceresini kapat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div
              aria-live="polite"
              className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-50 dark:bg-neutral-800/30 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent"
            >
              {messages.map((msg, index) => {
                const prevMessage = messages[index - 1];
                const isSameSenderAsPrev = prevMessage ? prevMessage.isBot === msg.isBot : false;
                const nextMessage = messages[index + 1];
                const isSameSenderAsNext = nextMessage ? nextMessage.isBot === msg.isBot : false;

                return (
                  <div key={msg.id} className={`flex flex-col ${isSameSenderAsNext ? 'mb-0.5' : 'mb-2.5'}`}>
                    <div className={`flex items-start gap-2.5 ${msg.isBot ? "justify-start" : "justify-end"}`}>
                      {msg.isBot && !isSameSenderAsPrev && (
                         <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 flex items-center justify-center mt-1">
                           <MessageCircle size={14} className="text-neutral-600 dark:text-neutral-400" />
                         </div>
                      )}
                      {msg.isBot && isSameSenderAsPrev && <div className="w-6 flex-shrink-0 mr-2.5"></div>}

                      <div
                        className={`max-w-[80%] md:max-w-[75%] px-3.5 py-2.5 rounded-lg ${
                          msg.isBot
                            ? msg.isError
                              ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-600/50"
                              : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100"
                            : "bg-sky-500 dark:bg-sky-600 text-white"
                        }
                         ${isSameSenderAsPrev ? '' : (msg.isBot ? 'rounded-tl-none' : 'rounded-tr-none')} 
                         ${isSameSenderAsNext ? '' : (msg.isBot ? 'rounded-bl-none' : 'rounded-br-none')}
                        `}
                      >
                        {msg.isBot && msg.isError && (
                            <AlertTriangle size={14} className="mr-1.5 -mt-0.5 inline-block text-red-500" />
                        )}
                        {msg.rich && !msg.isError ? (
                          <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-ul:my-0.5 prose-ol:my-0.5 prose-li:m-0" dangerouslySetInnerHTML={{ __html: formatRichText(msg.text) }}></div>
                        ) : (
                          <p className={`text-sm leading-relaxed ${msg.isError ? 'font-medium' : ''}`}>{msg.text}</p>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center justify-end mt-0.5 px-1 ${msg.isBot ? 'ml-8' : ''}`}>
                      {msg.isBot && !msg.isError && !isSameSenderAsNext && (
                        <button
                          className={`transition-colors text-xs mr-2 ${
                            feedbackStates[msg.id]
                              ? 'text-sky-500 dark:text-sky-400'
                              : 'text-neutral-400 dark:text-neutral-500 hover:text-sky-500 dark:hover:text-sky-400'
                          }`}
                          title={feedbackStates[msg.id] ? "Alındı" : "Faydalı oldu"}
                          aria-label={feedbackStates[msg.id] ? "Beğenildi" : "Beğen"}
                          disabled={feedbackStates[msg.id]}
                          onClick={() => handleFeedbackClick(msg.id)}
                        >
                          <ThumbsUp size={14} />
                        </button>
                      )}
                      <p className={`text-xs ${msg.isError ? 'text-red-500/80' : 'text-neutral-400 dark:text-neutral-500'}`}>
                         {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                       </p>
                    </div>

                    {msg.isBot && !msg.isError && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && !hiddenSuggestions[msg.id] && (
                       <div className="ml-8 mt-1.5 flex flex-wrap gap-1.5">
                         {msg.suggestedQuestions.map((q) => (
                           <button
                            key={`${msg.id}-${q.id}`}
                            onClick={() => handleSuggestedQuestion(q.question, msg.id)}
                             className="text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 px-2.5 py-1 rounded-md transition-colors"
                          >
                            {q.question}
                           </button>
                         ))}
                       </div>
                    )}
                  </div>
                );
              })}
              {isTypingAnimation && (
                 <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 flex items-center justify-center mt-1">
                      <MessageCircle size={14} className="text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg rounded-tl-none px-3.5 py-2.5">
                       <div className="flex space-x-1.5 items-center">
                         <div className="h-1.5 w-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                         <div className="h-1.5 w-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                         <div className="h-1.5 w-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"></div>
                       </div>
                     </div>
                   </div>
              )}
              {isLoading && !isTypingAnimation && (
                <div className="flex justify-center items-center p-3">
                  <Loader2 size={20} className="text-neutral-500 animate-spin" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 3 && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 flex-shrink-0">
                 <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Veya şunları deneyin:</p>
                 <div className="flex flex-wrap gap-1.5">
                   {quickResponses.slice(0, 4).map((response) => (
                     <button
                       key={response.id}
                       onClick={() => handleQuickResponse(response.text)}
                       className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs rounded-md transition-colors"
                     >
                       {response.text}
                     </button>
                   ))}
                 </div>
              </div>
            )}

            <Transition
              show={showEmojis}
              enter="transition-opacity ease-in-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-in-out duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="p-2 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex-shrink-0">
                <div className="grid grid-cols-8 gap-0.5">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="aspect-square flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors text-lg"
                       aria-label={`Emoji: ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </Transition>

            <div className="border-t border-neutral-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={`p-1.5 rounded-md text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${showEmojis ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
                   aria-label={showEmojis ? "Emoji kapat" : "Emoji aç"}
                >
                  <Smile size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Mesajınızı yazın..."
                    className="w-full py-2 px-3.5 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm transition-colors"
                    disabled={isLoading}
                    aria-label="Sohbet mesajı"
                  />
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={input.trim() === "" || isLoading || isTypingAnimation}
                  className="bg-sky-500 text-white p-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-sky-600 active:bg-sky-700 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-1 dark:focus:ring-offset-neutral-900 shrink-0"
                  aria-label={isLoading ? "Gönderiliyor" : "Gönder"}
                >
                  {isLoading && !isTypingAnimation ? (
                      <Loader2 size={20} className="animate-spin" />
                  ) : (
                      <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <Transition
            show={!isOpen}
            as={Fragment}
            enter="transition-opacity duration-200 delay-100 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-100 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="relative">
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow border border-white dark:border-neutral-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
              <button
                onClick={toggleChat}
                className="bg-sky-500 text-white p-3 rounded-full shadow-md hover:bg-sky-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                aria-label="Sohbeti Aç"
              >
                <MessageCircle size={24} />
              </button>
            </div>
        </Transition>
      </div>

      <Transition appear show={isClearConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1100]" onClose={() => setIsClearConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-neutral-900 dark:text-neutral-100"
                  >
                    Sohbeti Temizle
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Tüm sohbet geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-colors"
                      onClick={() => setIsClearConfirmOpen(false)}
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-colors"
                      onClick={handleConfirmClear}
                    >
                      Sil
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
} 