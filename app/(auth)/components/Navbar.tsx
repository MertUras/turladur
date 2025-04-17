"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 shadow-sm py-3 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-10 w-10 mr-2">
                            <Image
                                src="/images/logo.png"
                                alt="TourTech Logo"
                                width={40}
                                height={40}
                                className="transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <span className="text-2xl font-bold text-blue-700 transition-all duration-300">
                            TourTech
                        </span>
                    </Link>

                    {/* Auth Links */}
                    <div className="flex items-center space-x-3">
                        <Link 
                            href="/login" 
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                pathname === '/login' 
                                ? 'bg-blue-600 text-white' 
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            Giriş Yap
                        </Link>
                        <Link 
                            href="/register" 
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                pathname === '/register' 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}