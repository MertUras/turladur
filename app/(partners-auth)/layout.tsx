import PartnerNavbar from "./components/Navbar";

export default function PartnerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <PartnerNavbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}