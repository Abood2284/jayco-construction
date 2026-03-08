import rules from "@/lib/seo/legacy-redirect-rules.json";

export type RedirectRule = {
	oldPath: string;
	newPath: string;
	notes?: string;
};

export const legacyRedirectRules: RedirectRule[] = rules;

export const getRedirectMap = () => new Map(legacyRedirectRules.map((rule) => [rule.oldPath, rule.newPath]));
