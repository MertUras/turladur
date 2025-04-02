"use client";

import dynamic from "next/dynamic";

// ChatWidget'ı dinamik olarak import ediyoruz (sadece client tarafında yüklenecek)
const ChatWidget = dynamic(() => import("../../components/ChatWidget"), {
  ssr: false, // SSR devre dışı bırakılıyor
  loading: () => null, // Yüklenirken hiçbir şey gösterme
});

export default function ChatWidgetWrapper() {
  return <ChatWidget />;
} 