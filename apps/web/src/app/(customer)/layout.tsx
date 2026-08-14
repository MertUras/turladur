import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export const dynamic = 'force-dynamic';

export default function CustomerLayout({
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
