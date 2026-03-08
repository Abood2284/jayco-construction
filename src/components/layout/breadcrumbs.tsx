import Link from "next/link";

type Crumb = {
	name: string;
	path: string;
};

type BreadcrumbsProps = {
	items: Crumb[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<nav aria-label="Breadcrumb" className="mx-auto w-full">
			<ol className="flex flex-wrap items-center gap-2 text-[0.8rem] text-slate-400 sm:text-sm">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<li key={item.path} className="inline-flex items-center gap-2">
							{isLast ? (
								<span aria-current="page" className="font-semibold text-slate-200">
									{item.name}
								</span>
							) : (
								<Link href={item.path} className="font-medium transition hover:text-amber-400">
									{item.name}
								</Link>
							)}
							{!isLast && (
								<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-600" aria-hidden="true">
									<path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
