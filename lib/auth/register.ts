import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "../types/index";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export const validatePassword = (password: string) => {
  // Şifre uzunluk kontrolü
  if (password.length < 8) {
    return { valid: false, message: 'Şifre en az 8 karakter olmalıdır' };
  }

  // Şifre karmaşıklık kontrolü
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return { 
      valid: false, 
      message: 'Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir' 
    };
  }

  return { valid: true, message: 'Şifre geçerli' };
};

export const checkEmailExists = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  return !!existingUser;
};

export const hashPassword = async (password: string) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
  return bcrypt.hash(password, saltRounds);
};

export const createUser = async (data: RegisterData) => {
  const { name, email, password, role } = data;
  
  // E-posta kontrolü
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error('Bu e-posta adresi zaten kullanımda');
  }
  
  // Şifre kontrolü
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message);
  }
  
  // Şifreyi hashle
  const hashedPassword = await hashPassword(password);
  
  // Kullanıcıyı oluştur
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: (role as UserRole) || 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  
  return user;
}; 