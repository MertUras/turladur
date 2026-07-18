import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 pt-16">{children}</main>
      <Footer />
    </>
  );
}
