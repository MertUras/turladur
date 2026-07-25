import { PartnerShell } from '@/components/layout/partner-shell';

export const dynamic = 'force-dynamic';

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartnerShell>{children}</PartnerShell>;
}
