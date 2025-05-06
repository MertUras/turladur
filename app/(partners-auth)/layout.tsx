import PartnerNavbar from "./components/Navbar";

export default function PartnerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-neutral-50">
      <PartnerNavbar />
      <main className="h-[calc(100vh-3.5rem)]">
        {children}
      </main>
    </div>
  );
}