export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full-bleed auth screens (legacy split layout) — no marketing header/footer
  return <>{children}</>;
}
