"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
    const pathname = usePathname();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 border-b border-neutral-200/80 shadow-sm py-2.5 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-12">
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-8 w-8 mr-2 flex-shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="TourTech"
                                fill
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-neutral-800 transition-colors duration-300 group-hover:text-sky-700">
                                TourTech
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-2">
                        <Link 
                            href="/login"
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ease-out ${
                                pathname === '/login'
                                ? 'bg-sky-100/80 text-sky-700'
                                : 'text-neutral-600 hover:text-sky-700 hover:bg-neutral-100'
                            }`}
                        >
                            Giriş Yap
                        </Link>
                        <Link 
                            href="/register"
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ease-out border ${
                                pathname === '/register'
                                ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                                : 'bg-sky-600 text-white border-sky-600 hover:bg-sky-700 hover:border-sky-700'
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