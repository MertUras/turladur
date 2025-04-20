"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function PartnerNavbar() {
    const pathname = usePathname();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-900 to-indigo-800 shadow-lg backdrop-blur-sm border-b border-indigo-700/50 py-3">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-9 w-9 mr-2.5 flex-shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="Turladur Partner"
                                layout="fill"
                                objectFit="contain"
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-indigo-100">
                                TurlaDur
                            </span>
                            <span className="text-xs text-indigo-300 tracking-wide">Partner Portal</span>
                        </div>
                    </Link>

                    {/* Auth Links */}
                    <div className="flex items-center space-x-3">
                        <Link 
                            href="/partner-login" 
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                                pathname === '/partner-login' 
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-indigo-100 hover:text-white hover:bg-indigo-700/60'
                            }`}
                        >
                            Giriş Yap
                        </Link>
                        <Link 
                            href="/partner-register" 
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out border ${
                                pathname === '/partner-register' 
                                ? 'bg-white text-indigo-700 border-white shadow-sm'
                                : 'text-indigo-100 border-indigo-600 hover:text-white hover:border-indigo-400 hover:bg-indigo-700/60'
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