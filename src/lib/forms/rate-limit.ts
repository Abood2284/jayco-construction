const attempts = new Map<string, number[]>();

export const checkRateLimit = (key: string, maxAttempts: number, windowMs: number) => {
	const now = Date.now();
	const timestamps = attempts.get(key) ?? [];
	const active = timestamps.filter((timestamp) => now - timestamp < windowMs);

	if (active.length >= maxAttempts) {
		attempts.set(key, active);
		return false;
	}

	active.push(now);
	attempts.set(key, active);
	return true;
};
