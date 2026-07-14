"use server";
import { cookies } from 'next/headers';

export async function loginAdmin(email: string, password: string) {
  // Simulação de verificação
  if (email === "admin@tiger.com" && password === "admin123") {
    // Define um cookie que expira em 30 dias
    (await cookies()).set('admin_session', 'true', {
      maxAge: 60 * 60 * 24 * 30, // 30 dias em segundos
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return { success: true };
  }
  return { success: false };
}