"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function PartnerNavbar() {
    const pathname = usePathname();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-indigo-900 shadow-md py-3 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-10 w-10 mr-2">
                            <Image
                                src="/images/logo.png"
                                alt="Turladur Partner"
                                width={40}
                                height={40}
                                className="transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white transition-all duration-300">
                                TurlaDur
                            </span>
                            <span className="text-xs text-indigo-200">Partner Portal</span>
                        </div>
                    </Link>

                    {/* Auth Links */}
                    <div className="flex items-center space-x-3">
                        <Link 
                            href="/partner-login" 
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                pathname === '/partner-login' 
                                ? 'bg-white text-indigo-700' 
                                : 'text-white hover:bg-indigo-800'
                            }`}
                        >
                            Giriş Yap
                        </Link>
                        <Link 
                            href="/partner-register" 
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                pathname === '/partner-register' 
                                ? 'bg-white text-indigo-700' 
                                : 'text-indigo-100 border border-indigo-700 hover:border-indigo-300 hover:bg-indigo-800'
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