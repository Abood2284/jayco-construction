import type { Product, ProductCategory } from "@/lib/cms/types"

/** CMS category slugs bundled into one filter pill each (order = display order). */
export const EQUIPMENT_CATEGORY_GROUPS = [
	{
		id: "cranes",
		label: "Cranes",
		categorySlugs: ["eot-cranes", "jib-cranes", "floor-gantry-cranes"],
	},
	{
		id: "hoists",
		label: "Hoists & chain blocks",
		categorySlugs: ["electric-hoist", "chain-pulley-block"],
	},
	{
		id: "lifts-platforms",
		label: "Lifts & platforms",
		categorySlugs: ["goods-lift", "lifting-platforms"],
	},
	{
		id: "stackers-pallet",
		label: "Stackers & pallet handling",
		categorySlugs: ["hydraulic-stacker", "pallet-drum-handling"],
	},
	{
		id: "transport-docking",
		label: "Transport & docking",
		categorySlugs: ["material-transport-docking"],
	},
	{
		id: "slings",
		label: "Slings & rigging",
		categorySlugs: ["sling"],
	},
] as const

export const OTHER_EQUIPMENT_GROUP_ID = "other"

const groupedSlugSet: Set<string> = new Set(
	EQUIPMENT_CATEGORY_GROUPS.flatMap((g) => [...g.categorySlugs]),
)

export interface EquipmentGroupPill {
	id: string
	label: string
}

export function buildEquipmentGroupPills(products: Product[]): EquipmentGroupPill[] {
	const slugsInCatalog = new Set(products.map((p) => p.categorySlug))

	const pills: EquipmentGroupPill[] = EQUIPMENT_CATEGORY_GROUPS.filter((g) =>
		g.categorySlugs.some((slug) => slugsInCatalog.has(slug)),
	).map((g) => ({ id: g.id, label: g.label }))

	const hasUngrouped = [...slugsInCatalog].some((slug) => !groupedSlugSet.has(slug))
	if (hasUngrouped) pills.push({ id: OTHER_EQUIPMENT_GROUP_ID, label: "Other" })

	return pills
}

export function productMatchesEquipmentGroup(product: Product, groupId: string): boolean {
	if (groupId === OTHER_EQUIPMENT_GROUP_ID) return !groupedSlugSet.has(product.categorySlug)

	const group = EQUIPMENT_CATEGORY_GROUPS.find((g) => g.id === groupId)
	if (!group) return false

	return (group.categorySlugs as readonly string[]).includes(product.categorySlug)
}

export interface EquipmentCategorySummaryRow {
	groupId: string
	label: string
	subCategoryNames: string[]
}

function slugToTitleCase(slug: string): string {
	return slug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ")
}

/** One row per equipment group: main label + CMS category names present in the catalog. */
export function buildEquipmentCategorySummaryRows(
	products: Product[],
	categories: ProductCategory[],
): EquipmentCategorySummaryRow[] {
	const slugsInCatalog = new Set(products.map((p) => p.categorySlug))
	const nameBySlug = new Map<string, string>()
	for (const c of categories) nameBySlug.set(c.slug, c.name)

	function resolveName(slug: string): string {
		return nameBySlug.get(slug) ?? slugToTitleCase(slug)
	}

	const rows: EquipmentCategorySummaryRow[] = []

	for (const g of EQUIPMENT_CATEGORY_GROUPS) {
		const subCategoryNames = g.categorySlugs
			.filter((slug) => slugsInCatalog.has(slug))
			.map((slug) => resolveName(slug))
		if (subCategoryNames.length === 0) continue
		rows.push({ groupId: g.id, label: g.label, subCategoryNames })
	}

	const ungroupedSlugs = new Set<string>()
	for (const p of products) {
		if (!groupedSlugSet.has(p.categorySlug)) ungroupedSlugs.add(p.categorySlug)
	}
	if (ungroupedSlugs.size > 0) {
		const subCategoryNames = [...ungroupedSlugs].sort().map((slug) => resolveName(slug))
		rows.push({
			groupId: OTHER_EQUIPMENT_GROUP_ID,
			label: "Other",
			subCategoryNames,
		})
	}

	return rows
}
