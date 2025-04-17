import Navbar from "./components/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50">
      <Navbar />
      {children}
    </main>
  );
} 