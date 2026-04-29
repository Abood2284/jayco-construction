export const sendFormNotification = async (subject: string, payload: Record<string, unknown>) => {
	const to = process.env.FORM_NOTIFICATION_EMAIL;
	if (!to) {
		console.info("[form-notification-disabled]", subject, { fields: Object.keys(payload) });
		return;
	}

	// Integrate with SendGrid/Postmark/Resend in production.
	console.info("[form-notification-placeholder]", { to, subject, fields: Object.keys(payload) });
};
