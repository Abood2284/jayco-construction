/** When unset, the in-browser product editor is enabled (per product team default). Set to "false" to hide it. */
export function isProductEditorUiEnabled() {
	const flag = process.env.NEXT_PUBLIC_PRODUCT_EDITOR?.trim()
	if (!flag) return true
	return flag.toLowerCase() !== "false"
}
