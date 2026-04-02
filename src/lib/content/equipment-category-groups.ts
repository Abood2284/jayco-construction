import type { Product } from "@/lib/cms/types"

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
