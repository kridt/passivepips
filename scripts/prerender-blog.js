/**
 * Pre-render blog posts as static HTML files.
 *
 * After Vite builds the SPA into dist/, this script:
 *   1. Reads every markdown file in content/blog/
 *   2. Generates dist/blog/{slug}/index.html with:
 *      - Unique <title>, <meta description>, <meta og:*>, canonical URL
 *      - JSON-LD BlogPosting schema
 *      - The full article body rendered as HTML (visible to crawlers)
 *      - The SPA's JS bundle so React hydrates on the client
 *
 * Run: node scripts/prerender-blog.js  (after vite build)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.resolve(ROOT, "content/blog");
const DIST_DIR = path.resolve(ROOT, "dist");
const SITE_URL = "https://www.passivepips.com";

marked.setOptions({ gfm: true, breaks: false });

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAssetReferences() {
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf-8");

  const scriptMatches = [...indexHtml.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)];
  const scripts = scriptMatches.map((m) => m[0]);

  const cssMatches = [...indexHtml.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]*"[^>]*>/g)];
  const stylesheets = cssMatches.map((m) => m[0]);

  const preloadMatches = [...indexHtml.matchAll(/<link[^>]*rel="modulepreload"[^>]*>/g)];
  const preloads = preloadMatches.map((m) => m[0]);

  return { scripts, stylesheets, preloads };
}

function generateBlogPostHtml(post, articleHtml, assets) {
  const { slug, title, seoTitle, date, excerpt, metaDescription, tags } = post;
  const url = `${SITE_URL}/blog/${slug}`;
  const ogImage = `${SITE_URL}/og-preview.png`;
  const displayTitle = seoTitle || title;
  const displayDescription = metaDescription || excerpt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: date || undefined,
    dateModified: date || undefined,
    description: displayDescription,
    author: { "@type": "Person", name: "Christian" },
    publisher: {
      "@type": "Organization",
      name: "PassivePips",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: ogImage,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const tagsHtml =
    tags && tags.length > 0
      ? `<div class="blog-article__tags">${tags.map((t) => `<span class="blog-tag">${escapeHtml(t)}</span>`).join("")}</div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(displayTitle)} | PassivePips Blog</title>
    <meta name="description" content="${escapeHtml(displayDescription)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="author" content="Christian" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <link rel="alternate" type="application/rss+xml" title="PassivePips Blog" href="/feed.xml" />

    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(displayTitle)}" />
    <meta property="og:description" content="${escapeHtml(displayDescription)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="PassivePips" />
    <meta property="og:locale" content="en_US" />
    ${date ? `<meta property="article:published_time" content="${date}T00:00:00Z" />` : ""}
    ${date ? `<meta property="article:modified_time" content="${date}T00:00:00Z" />` : ""}
    <meta property="article:author" content="Christian" />
    ${tags && tags.length > 0 ? tags.map((t) => `<meta property="article:tag" content="${escapeHtml(t)}" />`).join("\n    ") : ""}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(displayTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(displayDescription)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <!-- JSON-LD: BlogPosting -->
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

    <!-- JSON-LD: BreadcrumbList -->
    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

    <!-- Stylesheets from Vite build -->
    ${assets.stylesheets.join("\n    ")}

    <!-- Modulepreloads from Vite build -->
    ${assets.preloads.join("\n    ")}

    <style>
      body { margin: 0; background: #080A12; color: #E2E8F0; font-family: 'Instrument Sans', sans-serif; }
      .seo-fallback { max-width: 800px; margin: 0 auto; padding: 4rem 2rem; line-height: 1.8; }
      .seo-fallback h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2.2rem; margin-bottom: 0.5rem; }
      .seo-fallback h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.4rem; margin: 2rem 0 0.75rem; color: #A5D7E8; }
      .seo-fallback h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.15rem; margin: 1.5rem 0 0.5rem; color: #A5D7E8; }
      .seo-fallback p { color: rgba(226,232,240,0.7); margin-bottom: 1rem; }
      .seo-fallback a { color: #A5D7E8; }
      .seo-fallback ul, .seo-fallback ol { color: rgba(226,232,240,0.7); padding-left: 1.5rem; }
      .seo-fallback li { margin-bottom: 0.5rem; }
      .seo-fallback .meta { color: rgba(226,232,240,0.4); font-size: 0.9rem; margin-bottom: 1.5rem; }
      .seo-fallback .back-link { color: #A5D7E8; text-decoration: none; font-size: 0.9rem; display: inline-block; margin-bottom: 2rem; }
      .seo-fallback .disclaimer { font-size: 0.8rem; color: rgba(226,232,240,0.35); margin-top: 2rem; border-top: 1px solid rgba(226,232,240,0.08); padding-top: 1rem; }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="seo-fallback">
        <a href="/blog" class="back-link">← Back to Blog</a>
        ${date ? `<p class="meta">${formattedDate}</p>` : ""}
        ${tagsHtml}
        <article>
          <h1>${escapeHtml(title)}</h1>
          ${articleHtml}
        </article>
        <p class="disclaimer">Trading forex carries significant risk. Past performance does not guarantee future results. Only invest what you can afford to lose.</p>
        <p style="margin-top:2rem"><a href="${SITE_URL}">← PassivePips Home</a></p>
      </div>
    </div>

    <!-- SPA scripts — React will hydrate and take over -->
    ${assets.scripts.join("\n    ")}
  </body>
</html>`;
}

function generateBlogListPage(files, assets) {
  const posts = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      const slug = data.slug || file.replace(/\.md$/, "");
      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
        excerpt: data.excerpt || "",
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const postListHtml = posts
    .map((p) => {
      const dateStr = p.date
        ? new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";
      return `<li style="margin-bottom:1.5rem">
          ${dateStr ? `<time style="color:rgba(226,232,240,0.4);font-size:0.85rem">${dateStr}</time>` : ""}
          <h2 style="margin:0.25rem 0 0.5rem;font-size:1.2rem"><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></h2>
          ${p.excerpt ? `<p style="margin:0;font-size:0.9rem">${escapeHtml(p.excerpt)}</p>` : ""}
        </li>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blog | PassivePips — Forex & PAMM Trading Insights</title>
    <meta name="description" content="Expert insights on PAMM trading, passive forex income, and automated investment strategies. Learn how to earn passive income from forex with PassivePips." />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${SITE_URL}/blog" />
    <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
    <link rel="alternate" type="application/rss+xml" title="PassivePips Blog" href="/feed.xml" />

    <!-- Open Graph -->
    <meta property="og:title" content="Blog | PassivePips — Forex & PAMM Trading Insights" />
    <meta property="og:description" content="Expert insights on PAMM trading, passive forex income, and automated investment strategies from PassivePips." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/blog" />
    <meta property="og:image" content="${SITE_URL}/og-preview.png" />
    <meta property="og:site_name" content="PassivePips" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Blog | PassivePips — Forex & PAMM Trading Insights" />
    <meta name="twitter:description" content="Expert insights on PAMM trading, passive forex income, and automated investment strategies from PassivePips." />
    <meta name="twitter:image" content="${SITE_URL}/og-preview.png" />

    <!-- JSON-LD -->
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      ],
    })}</script>

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

    <!-- Stylesheets from Vite build -->
    ${assets.stylesheets.join("\n    ")}

    <!-- Modulepreloads from Vite build -->
    ${assets.preloads.join("\n    ")}

    <style>
      body { margin: 0; background: #080A12; color: #E2E8F0; font-family: 'Instrument Sans', sans-serif; }
      .seo-fallback { max-width: 800px; margin: 0 auto; padding: 4rem 2rem; line-height: 1.8; }
      .seo-fallback h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2.2rem; margin-bottom: 1rem; }
      .seo-fallback p { color: rgba(226,232,240,0.7); margin-bottom: 1rem; }
      .seo-fallback a { color: #A5D7E8; }
      .seo-fallback ul { list-style: none; padding: 0; }
      .seo-fallback .back-link { color: #A5D7E8; text-decoration: none; font-size: 0.9rem; display: inline-block; margin-bottom: 2rem; }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="seo-fallback">
        <a href="/" class="back-link">← Home</a>
        <h1>Blog</h1>
        <p>Insights on forex trading, PAMM investing, and building passive income.</p>
        <ul>
          ${postListHtml}
        </ul>
      </div>
    </div>

    <!-- SPA scripts — React will hydrate and take over -->
    ${assets.scripts.join("\n    ")}
  </body>
</html>`;

  const outDir = path.join(DIST_DIR, "blog");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
  console.log("Pre-rendered blog list page");
}

function prerender() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("dist/ directory not found — run vite build first");
    process.exit(1);
  }

  if (!fs.existsSync(BLOG_DIR)) {
    console.log("No blog content directory found, skipping pre-render");
    return;
  }

  const assets = getAssetReferences();
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  let count = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = data.slug || file.replace(/\.md$/, "");
    const title = data.title || slug;
    const seoTitle = data.seoTitle || null;
    const date = data.date || null;
    const excerpt = data.excerpt || "";
    const metaDescription = data.metaDescription || null;
    const tags = data.tags || [];

    const articleHtml = marked.parse(content);

    const post = { slug, title, seoTitle, date, excerpt, metaDescription, tags };
    const html = generateBlogPostHtml(post, articleHtml, assets);

    const outDir = path.join(DIST_DIR, "blog", slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    count++;
  }

  generateBlogListPage(files, assets);

  console.log(`Pre-rendered ${count} blog posts as static HTML`);
}

prerender();
