import Link from "next/link";

export default function NotFound() {
	return (
		<main className="container section narrow">
			<h1>Page Not Found</h1>
			<p>The requested page is unavailable or moved to a new location.</p>
			<p>
				<Link href="/">Return to home</Link>
			</p>
		</main>
	);
}
