import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell" id="main-content">
      <p>404</p>
      <h1>Page not found</h1>
      <p>The requested MINDEQ page is not available.</p>
      <nav aria-label="Recovery">
        <Link href="/">Home</Link>
        {" · "}
        <Link href="/machines">Machines</Link>
        {" · "}
        <Link href="/contact">Contact</Link>
      </nav>
    </main>
  );
}
