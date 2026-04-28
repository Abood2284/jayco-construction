import { put } from "@vercel/blob";
import { existsSync } from "node:fs";
import { mkdir, readdir, stat, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const PROJECT_ROOT = process.cwd();

const LOCAL_PRODUCTS_DIR = path.join(
  PROJECT_ROOT,
  "public",
  "images",
  "products",
);

const MANIFEST_OUTPUT_PATH = path.join(
  PROJECT_ROOT,
  "src",
  "lib",
  "content",
  "product-image-manifest.json",
);

const ALLOWED_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

async function walkImages(dir) {
  const results = [];

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) continue;

      results.push(fullPath);
    }
  }

  await walk(dir);
  return results;
}

function getProductKeyAndBlobPath(filePath) {
  const relativePath = path.relative(LOCAL_PRODUCTS_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length < 3) {
    throw new Error(
      `Invalid product image path: ${relativePath}. Expected <category>/<product>/<file>.`,
    );
  }

  const [categorySlug, productSlug] = parts;
  const fileName = parts.slice(2).join(path.sep);

  const productKey = `${categorySlug}/${productSlug}`;

  const blobPath = toPosixPath(
    path.join("products", categorySlug, productSlug, fileName),
  );

  return {
    productKey,
    blobPath,
  };
}

function sortGalleryImages(urls) {
  return urls.sort((a, b) => {
    const aName = a.split("/").pop()?.toLowerCase() ?? "";
    const bName = b.split("/").pop()?.toLowerCase() ?? "";

    const score = (name) => {
      if (name.startsWith("hero.")) return 0;

      const galleryMatch = name.match(/^gallery-(\d+)\./);
      if (galleryMatch) return Number(galleryMatch[1]);

      return 9999;
    };

    return score(aName) - score(bName) || aName.localeCompare(bName);
  });
}


async function uploadWithRetry(blobPath, filePath, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const fileBuffer = await readFile(filePath);

      return await put(blobPath, fileBuffer, {
        access: "public",
        allowOverwrite: true,
      });
    } catch (error) {
      lastError = error;

      console.log(
        `Upload attempt ${attempt}/${maxAttempts} failed for ${blobPath}`,
      );

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }
  }

  throw lastError;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Missing BLOB_READ_WRITE_TOKEN. Run `vercel env pull .env.local` or export it before running this script.",
    );
  }

  if (!existsSync(LOCAL_PRODUCTS_DIR)) {
    throw new Error(`Product image folder not found: ${LOCAL_PRODUCTS_DIR}`);
  }

  const files = await walkImages(LOCAL_PRODUCTS_DIR);

  if (files.length === 0) {
    console.log("No product images found.");
    return;
  }

  console.log(`Found ${files.length} product images.`);
  console.log("Uploading to Vercel Blob...\n");

  const manifest = {};

  for (let index = 0; index < files.length; index += 1) {
    const filePath = files[index];
    const fileStat = await stat(filePath);
    const { productKey, blobPath } = getProductKeyAndBlobPath(filePath);

    console.log(
      `[${index + 1}/${files.length}] ${blobPath} (${Math.round(
        fileStat.size / 1024,
      )} KB)`,
    );

    const blob = await uploadWithRetry(blobPath, filePath);

    if (!manifest[productKey]) {
      manifest[productKey] = [];
    }

    manifest[productKey].push({
      src: blob.url,
      pathname: blob.pathname,
    });
  }

  const sortedManifest = Object.fromEntries(
    Object.entries(manifest)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, images]) => [
        key,
        sortGalleryImages(images.map((image) => image.src)),
      ]),
  );

  await mkdir(path.dirname(MANIFEST_OUTPUT_PATH), { recursive: true });

  await writeFile(
    MANIFEST_OUTPUT_PATH,
    `${JSON.stringify(sortedManifest, null, 2)}\n`,
    "utf8",
  );

  console.log("\nUpload complete.");
  console.log(`Manifest written to: ${MANIFEST_OUTPUT_PATH}`);
}



main().catch((error) => {
  console.error("\nUpload failed:");
  console.error(error);
  process.exit(1);
});
