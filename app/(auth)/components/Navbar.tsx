"use client";

import Link from "next/link";
// Removed unnecessary imports: usePathname, useSession, signOut, useState, Icons

export default function Navbar() {
    // Removed pathname, session status, mobile menu state
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 shadow-sm py-4 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo - Added transition for consistency */} 
                    <Link href="/" className="flex items-center transition-all duration-200">
                        <span className="text-2xl font-bold text-black">
                            TourTech
                        </span>
                    </Link>

                    {/* Auth Links */} 
                    <div className="flex items-center space-x-2">
                        <Link 
                            href="/login" 
                            // Added subtle hover scale effect
                            className="px-4 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Giriş Yap
                        </Link>
                        <Link 
                            href="/register" 
                            // Ensured consistent transition
                            className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
                        >
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            </div>
            {/* Removed Mobile Menu Panel */}
        </header>
    );
}