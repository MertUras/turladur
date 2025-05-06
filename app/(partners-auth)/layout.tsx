import Header from "../components/Header";

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50/50">
            <Header />
            {children}
        </main>
    );
}