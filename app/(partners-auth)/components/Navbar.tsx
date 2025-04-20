"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function PartnerNavbar() {
    const pathname = usePathname();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200/80 shadow-sm py-2.5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-8 w-8 mr-2 flex-shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="TourTech Partner"
                                fill
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-neutral-800 transition-colors duration-300 group-hover:text-sky-700">
                                TourTech
                            </span>
                            <span className="text-xs text-sky-600 tracking-wide font-medium">Partner Portal</span>
                        </div>
                    </Link>

                    {/* Auth Links */}
                    <div className="flex items-center space-x-2">
                        <Link 
                            href="/partner-login" 
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ease-out ${
                                pathname === '/partner-login' 
                                ? 'bg-sky-100/80 text-sky-700'
                                : 'text-neutral-600 hover:text-sky-700 hover:bg-neutral-100'
                            }`}
                        >
                            Giriş Yap
                        </Link>
                        <Link 
                            href="/partner-register" 
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ease-out border ${
                                pathname === '/partner-register' 
                                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
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