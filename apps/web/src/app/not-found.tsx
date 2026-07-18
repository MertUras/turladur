import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">Sayfa bulunamadı</h1>
      <Link href="/" className="text-sky-700 hover:underline">
        Ana sayfaya dön
      </Link>
    </div>
  );
}
