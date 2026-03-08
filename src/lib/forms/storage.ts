import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const logDir = process.env.FORM_STORAGE_DIR ?? "/tmp/jayco-submissions";

export const appendSubmissionRecord = async (kind: "contact" | "careers", payload: Record<string, unknown>) => {
	const filePath = join(logDir, `${kind}.jsonl`);
	await mkdir(logDir, { recursive: true });
	await appendFile(filePath, `${JSON.stringify(payload)}\n`, "utf8");
};

export const persistResumeFile = async (fileName: string, content: ArrayBuffer) => {
	const resumeDir = join(logDir, "resumes");
	await mkdir(resumeDir, { recursive: true });
	const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
	const resumePath = join(resumeDir, `${Date.now()}-${safeName}`);
	await writeFile(resumePath, Buffer.from(content));
	return resumePath;
};
