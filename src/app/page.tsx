import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell" id="main-content">
      <p>Moroccan industrial machine manufacturer</p>
      <h1>MINDEQ</h1>
      <p>
        The machine catalogue and technical page architecture are under active
        development.
      </p>
      <Link href="/machines">Browse machines</Link>
    </main>
  );
}
