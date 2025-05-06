"use client";

import Link from "next/link";
import Image from "next/image";

export default function PartnerNavbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm py-2">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        {/* Ana Logo */}
                        <Link href="/" className="flex items-center group flex-shrink-0">
                            <div className="relative h-8 w-8 mr-2">
                                <Image
                                    src="/images/logo.png"
                                    alt="Turladur Logo"
                                    width={32}
                                    height={32}
                                    className="transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <span className="text-xl font-semibold text-sky-700 transition-colors duration-300 tracking-tight">
                                Turladur
                            </span>
                        </Link>

                        {/* Slash */}
                        <div className="text-2xl font-light text-sky-700">/</div>

                        {/* Partner Portal Logo */}
                        <div className="flex items-center group flex-shrink-0">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="h-8 w-8 text-white rounded-md flex items-center justify-center">
                                    <Image src="/images/logo.png" alt="Turladur Logo" width={32} height={32} />
                                </div>
                                <div className="ml-2.5 flex flex-col">
                                    <span className="text-lg font-semibold text-sky-700">Turladur</span>
                                    <span className="text-xs text-sky-600 tracking-wide font-medium">Partner Portal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/partner-login"
                            className="px-3.5 py-1 rounded-md text-sm font-medium border border-sky-600 text-sky-600 hover:bg-sky-50/70 transition-colors duration-200"
                        >
                            Giriş Yap
                        </Link>
                        <Link
                            href="/partner-register"
                            className="px-3.5 py-1 rounded-md text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-all duration-300 transform hover:scale-[1.03] shadow-sm"
                        >
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
} 