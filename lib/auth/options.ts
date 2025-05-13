import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    provider: string;
    isMainUser?: boolean;
    tourOperatorId?: string;
    permissions?: any;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      provider: string;
      isMainUser?: boolean;
      tourOperatorId?: string;
      permissions?: any;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    provider: string;
    isMainUser?: boolean;
    tourOperatorId?: string;
    permissions?: any;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/partner-login",
    error: "/partner-login",
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

        // Önce ana kullanıcıyı kontrol et
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            tourOperators: true,
          },
        });

        console.log('Partner giriş denemesi:', { 
          email: credentials.email,
          userFound: !!user,
          userRole: user?.role,
          tourOperatorCount: user?.tourOperators?.length 
        });

        if (!user || !user.password) {
          throw new Error('Geçersiz email veya şifre');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Geçersiz email veya şifre');
        }

        if (user.role !== 'TOUR_OPERATOR') {
          throw new Error('Bu hesap bir partner hesabı değil');
        }

        const tourOperator = user.tourOperators[0];
        
        if (!tourOperator) {
          throw new Error('Partner hesabı bulunamadı');
        }

        console.log('Tour operator durumu:', { 
          status: tourOperator.status,
          companyName: tourOperator.companyName
        });

        // Duruma göre kontrol
        switch (tourOperator.status) {
          case 'pending':
            throw new Error('Hesabınız henüz onaylanmamış. Lütfen admin onayını bekleyin.');
          case 'rejected':
            throw new Error('Hesabınız reddedilmiş. Daha fazla bilgi için lütfen bizimle iletişime geçin.');
          case 'suspended':
            throw new Error('Hesabınız askıya alınmış. Daha fazla bilgi için lütfen bizimle iletişime geçin.');
          case 'approved':
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              provider: 'partner-credentials',
              isMainUser: true,
              tourOperatorId: tourOperator.id,
            };
          default:
            throw new Error('Geçersiz hesap durumu');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.provider = user.provider;
        token.isMainUser = user.isMainUser;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.provider = token.provider;
        session.user.isMainUser = token.isMainUser;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}; 