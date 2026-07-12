import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import AuthProvider from "../components/providers/AuthProvider";
import ChatWidgetWrapper from "./components/ChatWidgetWrapper";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { authOptions } from "@/lib/auth/options";
import { ensureAuthEnv, getMissingAuthEnv } from "@/lib/auth/ensure-auth-env";

ensureAuthEnv();

function isDynamicServerUsageError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('Dynamic server usage') ||
      (typeof (error as { digest?: string }).digest === 'string' &&
        (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE'))
  );
}

async function getSafeServerSession() {
  const missing = getMissingAuthEnv();
  if (missing.includes("NEXTAUTH_SECRET")) {
    console.error(
      "[RootLayout] Oturum devre dışı — Vercel Preview env eksik:",
      missing.join(", ")
    );
    return null;
  }

  try {
    return await getServerSession(authOptions);
  } catch (error) {
    if (isDynamicServerUsageError(error)) {
      throw error;
    }
    console.error("[RootLayout] getServerSession başarısız:", error);
    return null;
  }
}

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
  const session = await getSafeServerSession();

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
