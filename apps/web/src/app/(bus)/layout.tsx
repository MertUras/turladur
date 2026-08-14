import { BusShell } from '@/components/layout/bus-shell';

export const dynamic = 'force-dynamic';

export default function BusLayout({ children }: { children: React.ReactNode }) {
  return <BusShell>{children}</BusShell>;
}
