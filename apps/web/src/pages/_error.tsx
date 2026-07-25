/**
 * Minimal Pages Router error page so Next can prerender /500 without
 * pulling the default Document Html context (known App Router monorepo quirk).
 * App Router UI remains the primary surface — this is build-only plumbing.
 */
import type { NextPageContext } from 'next';

type ErrorProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>{statusCode ?? 'Error'}</h1>
      <p>Bir sorun oluştu. Lütfen tekrar deneyin.</p>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;
