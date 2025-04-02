"use client";

import Footer from "@/app/components/Footer";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Sayfanın içeriğini doğrudan gösteriyoruz, ekstra footer ekleme yapmadan */}
      {children}
    </>
  );
} 