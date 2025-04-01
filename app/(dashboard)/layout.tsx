import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TourTech",
    description: "TourTech - Türkiye'nin En İyi Tur Deneyimleri",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
} 