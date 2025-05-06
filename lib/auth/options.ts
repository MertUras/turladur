import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Normal kullanıcılar için credentials provider
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email ve şifre gerekli');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            tourOperators: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Kullanıcı bulunamadı');
        }

        // Partner kullanıcılarını engelle
        if (user.role === 'TOUR_OPERATOR') {
          throw new Error('Bu giriş partner kullanıcıları için değil. Lütfen partner girişi yapın.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Geçersiz şifre');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: 'credentials',
        };
      },
    }),
    // Partner kullanıcıları için credentials provider
    CredentialsProvider({
      id: "partner-credentials",
      name: "partner-credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email ve şifre gerekli');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            tourOperators: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Kullanıcı bulunamadı');
        }

        // Sadece partner kullanıcılarına izin ver
        if (user.role !== 'TOUR_OPERATOR') {
          throw new Error('Bu giriş sadece partner kullanıcıları içindir. Lütfen normal kullanıcı girişi yapın.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Geçersiz şifre');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: 'partner-credentials',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = user.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}; 