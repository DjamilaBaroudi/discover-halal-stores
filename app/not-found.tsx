import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-5xl" aria-hidden>
        🕌
      </p>
      <h1 className="mt-4 text-2xl font-bold">Store not found</h1>
      <p className="mt-2 text-stone-500">
        This store may no longer exist, or the link is incorrect.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </main>
  );
}
