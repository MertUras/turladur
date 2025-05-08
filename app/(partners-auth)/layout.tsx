import AuthProvider from "@/components/providers/AuthProvider";
import PartnerNavbar from "./components/Navbar";

export default function PartnerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="h-screen flex flex-col">
        <PartnerNavbar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </AuthProvider>
  );
}