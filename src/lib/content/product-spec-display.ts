import type { ProductSpec } from "@/lib/cms/types"

/** Catalogue / market “typical bands” copy — not buyer-critical on the product page. */
function isIndustryContextSpec(label: string) {
	return /^Industry\s*[—\-]/i.test(label.trim())
}

export interface PartitionedProductSpecs {
	/** Concrete Jayco / tender / datasheet-style rows for above-the-fold scanning */
	primaryRows: ProductSpec[]
	/** Industry bands, long-form reference, and frontmatter `additionalInfo` */
	secondaryRows: ProductSpec[]
	/** True when every `specs` row was industry-only so we show the full list once */
	usedFallback: boolean
}

/**
 * Splits `specs` so the primary block stays short and CRO-friendly: real limits,
 * reference-sheet lines, and normal B2B fields stay up top; “Industry—…” bands move down.
 */
export function partitionSpecsForPrimaryDisplay(
	specs: ProductSpec[],
	additionalInfo: ProductSpec[],
): PartitionedProductSpecs {
	const industryRows = specs.filter((s) => isIndustryContextSpec(s.label))
	const primaryRows = specs.filter((s) => !isIndustryContextSpec(s.label))
	const secondaryRows = [...industryRows, ...additionalInfo]

	if (primaryRows.length === 0 && specs.length > 0)
		return {
			primaryRows: specs,
			secondaryRows: additionalInfo,
			usedFallback: true,
		}

	return { primaryRows, secondaryRows, usedFallback: false }
}
