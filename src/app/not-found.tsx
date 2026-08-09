import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell" id="main-content">
      <p>404</p>
      <h1>Page not found</h1>
      <p>The requested MINDEQ page is not available.</p>
      <nav aria-label="Recovery">
        <Link href="/">Return home</Link>
        {" · "}
        <Link href="/machines">Browse machines</Link>
      </nav>
    </main>
  );
}
