import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/providers/AuthProvider";
import ChatWidgetWrapper from "./components/ChatWidgetWrapper";
import { ThemeProvider } from "./providers/theme-provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TourTech - Türkiye'nin En İyi Seyahat Platformu",
  description: "En iyi oteller, turlar ve seyahat deneyimleri için TourTech'i tercih edin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable} font-poppins antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex-grow">{children}</main>
            <ChatWidgetWrapper />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
