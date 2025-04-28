import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Credentails provider'ı kullanırken adapter'ı kullanmıyoruz
  // Bu async_hooks hatası ile ilgili bir çözüm
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('E-posta ve şifre gerekli');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            hotels: true,
            agencies: true,
            tourOperators: true,
            experiences: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Kullanıcı bulunamadı');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Geçersiz şifre');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          hotels: user.hotels,
          agencies: user.agencies,
          tourOperators: user.tourOperators,
          experiences: user.experiences,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}; 