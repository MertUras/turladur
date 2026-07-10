import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import AuthProvider from "../components/providers/AuthProvider";
import ChatWidgetWrapper from "./components/ChatWidgetWrapper";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { authOptions } from "@/lib/auth/options";
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
  title: "Turladur - Türkiye'nin En İyi Seyahat Platformu",
  description: "En iyi oteller, turlar ve seyahat deneyimleri için TourTech'i tercih edin.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable} font-poppins antialiased`} suppressHydrationWarning>
        <AuthProvider session={session}>
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
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
