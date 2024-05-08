import { format } from "date-fns/format";
import { fetchIdioms } from "./idioms.server";

export async function createSitemap() {
  const idioms = await fetchIdioms();

  const idiomFeeds = idioms.map((idiom) => {
    return `
    <url>
      <loc>https://useidioms.com/${idiom.id}</loc>
      <lastmod>${format(idiom.publishedAt, "yyyy-MM-dd")}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
   </url>
    `;
  });
  const publishedAt = format(new Date(), "yyyy-MM-dd");
  const metadata = `
  <url>
  <loc>https://useidioms.com</loc>
  <lastmod>${publishedAt}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1</priority>
</url>
  `;
  const from = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const end = `</urlset>`;

  const sitemap = [from, metadata, ...idiomFeeds, end].join("\n");
  return sitemap;
}
