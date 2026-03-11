import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
	return buildMetadata({
		title: "About",
		description: "Industrial manufacturing company profile, capabilities, quality systems, and lifecycle support model.",
		path: "/about",
	});
}

export default function AboutPage() {
	return (
		<main className="container section narrow">
			<h1>About Jayco Hoist &amp; Cranes Mfg. Co.</h1>
			<p>
				We build high-load industrial systems and fabricated assemblies for process-critical operations. Our team combines
				design understanding, fabrication control, and site delivery planning to keep projects predictable.
			</p>
			<p>
				From structural modules and pressure equipment to material handling packages, our work is built for service life,
				not catalog shelf aesthetics.
			</p>
		</main>
	);
}
