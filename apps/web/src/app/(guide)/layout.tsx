import { GuideShell } from '@/components/layout/guide-shell';

export const dynamic = 'force-dynamic';

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuideShell>{children}</GuideShell>;
}
