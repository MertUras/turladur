"use client";

import { useState } from "react";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, subject, message }),
    });

    const result = await res.json();

    if (result.success) {
      alert("Mesaj başarıyla gönderildi!");
    } else {
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-colors"
            placeholder="Ad Soyad"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresiniz</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-colors"
            placeholder="email@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-colors"
            placeholder="+90 5XX XXX XX XX"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
          <select
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-colors"
            required
          >
            <option value="">Konu Seçiniz</option>
            <option value="reservation">Rezervasyon</option>
            <option value="cancellation">İptal & İade</option>
            <option value="support">Teknik Destek</option>
            <option value="partnership">İş Ortaklığı</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-colors"
          placeholder="Mesajınızı detaylı bir şekilde yazınız..."
          required
        ></textarea>
      </div>

      <div className="flex items-start">
        <input
          id="privacy"
          name="privacy"
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
          required
        />
        <label htmlFor="privacy" className="ml-3 text-sm text-gray-600">
          <span className="span-inherit">Kişisel verilerimin işlenmesine ilişkin </span>
          <Link href="/privacy-policy" className="text-blue-600 hover:underline">
            aydınlatma metnini
          </Link>
          <span className="span-inherit"> okudum ve kabul ediyorum.</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center justify-center"
      >
        <EnvelopeIcon className="w-5 h-5 mr-2" />
        Mesajı Gönder
      </button>
    </form>
  );
}