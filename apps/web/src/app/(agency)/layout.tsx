import { AgencyShell } from '@/components/layout/agency-shell';

export const dynamic = 'force-dynamic';

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgencyShell>{children}</AgencyShell>;
}
