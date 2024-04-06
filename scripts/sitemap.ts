import { format } from "date-fns/format";
import dotenv from "dotenv";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";

dotenv.config();

export interface Idiom {
  id: string;
  idiom: string;
  meaningBrief: string;
  meaningFull: string;
  createdAt: Date;
  thumbnail?: string;
  thumbnailPrompt: string;
  examples: string[];
}
export async function runSitemap() {
  const apiURL = process.env["VITE_API_URL_PROD"];
  const response = await fetch(
    `${apiURL}/idioms?count=120&order_by=created_at`
  );
  const data: { idioms: Idiom[] } = await response.json();

  const idioms = data.idioms.map((idiom) => {
    return `
    <url>
      <loc>https://useidioms.com/${idiom.id}</loc>
      <lastmod>${format(idiom.createdAt, "yyyy-MM-dd")}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
   </url>
    `;
  });
  const createdAt = format(new Date(), "yyyy-MM-dd");
  const metadata = `
  <url>
  <loc>https://useidioms.com</loc>
  <lastmod>${createdAt}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1</priority>
</url>
  `;
  const from = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const end = `</urlset>`;

  const sitemap = [from, metadata, ...idioms, end].join("\n");
  await fs.writeFile(
    path.resolve(process.cwd(), "./public/sitemap.xml"),
    sitemap,
    { encoding: "utf-8" }
  );
}

runSitemap();
