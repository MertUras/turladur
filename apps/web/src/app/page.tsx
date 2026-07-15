import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">TurlaDur</h1>
      <p className="text-muted-foreground text-sm">
        apps/web scaffold — Sprint 11.2
      </p>
      <Button type="button">Shadcn Button</Button>
    </main>
  );
}
