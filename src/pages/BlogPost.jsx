import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import posts from "virtual:blog-manifest";
import "../blog.css";

export default function BlogPost() {
  const { slug } = useParams();
  const [views, setViews] = useState(null);

  useEffect(() => {
    if (!slug) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((r) => r.json())
      .then((d) => setViews(d.views))
      .catch(() => {});
  }, [slug]);

  const modules = import.meta.glob("/content/blog/*.md", { query: "?raw", import: "default", eager: true });
  let post = null;

  for (const [filePath, raw] of Object.entries(modules)) {
    const fileName = filePath.split("/").pop().replace(/\.md$/, "");
    const meta = posts.find((p) => p.file === filePath.split("/").pop());
    const fileSlug = meta?.slug || fileName;
    if (fileSlug === slug) {
      const content = raw.replace(/^---[\s\S]*?---\s*/, "");
      post = { ...meta, content, slug: fileSlug };
      break;
    }
  }

  if (!post) {
    return (
      <div className="blog-page">
        <header className="blog-header">
          <Link to="/blog" className="blog-header__back">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Blog
          </Link>
          <Link to="/" className="blog-header__logo">PassivePips</Link>
        </header>
        <main className="blog-main">
          <div className="blog-empty">
            <h1>Post not found</h1>
            <p>The blog post you're looking for doesn't exist.</p>
            <Link to="/blog" className="blog-back-link">Back to Blog</Link>
          </div>
        </main>
      </div>
    );
  }

  const relatedPosts = posts
    .filter((p) => p.slug !== slug && p.tags?.some((t) => post.tags?.includes(t)))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    author: { "@type": "Person", name: "Christian" },
    publisher: {
      "@type": "Organization",
      name: "PassivePips",
      url: "https://www.passivepips.com",
    },
    mainEntityOfPage: `https://www.passivepips.com/blog/${slug}`,
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | PassivePips Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://www.passivepips.com/blog/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.passivepips.com/blog/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="blog-page">
        <header className="blog-header">
          <Link to="/blog" className="blog-header__back">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Blog
          </Link>
          <Link to="/" className="blog-header__logo">PassivePips</Link>
        </header>

        <main className="blog-main">
          <article className="blog-article">
            <div className="blog-article__meta">
              {post.date && (
                <time dateTime={post.date}>
                  {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
              )}
              {views !== null && (
                <span className="blog-views">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                  {views} {views === 1 ? "view" : "views"}
                </span>
              )}
              {post.tags?.length > 0 && (
                <div className="blog-article__tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="blog-article__title">{post.title}</h1>

            <div className="blog-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* CTA Banner */}
            <div className="blog-cta">
              <h3 className="blog-cta__title">Ready to start earning passive forex income?</h3>
              <p className="blog-cta__text">
                Join PassivePips PAMM — automated trading, no hidden fees, withdraw anytime.
              </p>
              <a
                className="blog-cta__btn"
                href="https://www.vantagemarkets.com/open-live-account/?affid=MTQ2OTEz"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Started
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="blog-related">
              <h2 className="blog-related__title">Related Posts</h2>
              <div className="blog-grid">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} to={`/blog/${rp.slug}`} className="blog-card">
                    <div className="blog-card__body">
                      {rp.date && (
                        <time className="blog-card__date" dateTime={rp.date}>
                          {new Date(rp.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                      )}
                      <h3 className="blog-card__title">{rp.title}</h3>
                      {rp.excerpt && <p className="blog-card__excerpt">{rp.excerpt}</p>}
                    </div>
                    <span className="blog-card__arrow">
                      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="blog-footer">
          <span>&copy; {new Date().getFullYear()} PassivePips. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}
