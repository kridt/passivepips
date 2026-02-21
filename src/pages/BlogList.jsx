import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import posts from "virtual:blog-manifest";
import "../blog.css";

export default function BlogList() {
  return (
    <>
      <Helmet>
        <title>Blog | PassivePips — Forex & PAMM Trading Insights</title>
        <meta name="description" content="Expert insights on PAMM trading, passive forex income, and automated investment strategies from PassivePips." />
        <link rel="canonical" href="https://www.passivepips.com/blog" />
      </Helmet>

      <div className="blog-page">
        <header className="blog-header">
          <Link to="/" className="blog-header__back">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Home
          </Link>
          <Link to="/" className="blog-header__logo">PassivePips</Link>
        </header>

        <main className="blog-main">
          <div className="blog-main__header">
            <h1 className="blog-main__title">Blog</h1>
            <p className="blog-main__desc">
              Insights on forex trading, PAMM investing, and building passive income.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="blog-empty">
              <p>No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card__body">
                    {post.date && (
                      <time className="blog-card__date" dateTime={post.date}>
                        {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </time>
                    )}
                    <h2 className="blog-card__title">{post.title}</h2>
                    {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
                    {post.tags?.length > 0 && (
                      <div className="blog-card__tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="blog-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="blog-card__arrow">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </main>

        <footer className="blog-footer">
          <span>&copy; {new Date().getFullYear()} PassivePips. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}
