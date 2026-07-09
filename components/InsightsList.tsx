"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Media } from "./Media";
import type { Post } from "@/lib/types";
import { formatMonthYear, formatYear } from "@/lib/utils";

export function InsightsList({ posts, categoryOrder = [] }: { posts: Post[]; categoryOrder?: string[] }) {
  const [filter, setFilter] = useState("All");

  // Chips are built from the categories that actually have published posts, so
  // empty categories never appear. Order follows the managed category list;
  // any tag not in that list is appended after. "All" is always first.
  const chips = useMemo(() => {
    const present = new Set(posts.map((p) => p.category).filter(Boolean));
    const ordered = categoryOrder.filter((name) => present.has(name));
    const extras = [...present].filter((name) => !categoryOrder.includes(name));
    return ["All", ...ordered, ...extras];
  }, [posts, categoryOrder]);

  const featured = useMemo(() => posts.find((p) => p.featured) ?? posts[0] ?? null, [posts]);
  const rest = useMemo(
    () => (featured ? posts.filter((p) => p.id !== featured.id) : posts),
    [posts, featured]
  );

  const matches = (p: Post) => filter === "All" || p.category === filter;
  const featuredVisible = featured ? matches(featured) : false;
  const visibleRest = rest.filter(matches);
  const shownCount = (featuredVisible ? 1 : 0) + visibleRest.length;

  return (
    <>
      {/* FILTER BAR */}
      <div className="filters">
        <div className="wrap">
          <span className="fl-label">Filter</span>
          <div className="chips" role="group" aria-label="Filter by topic">
            {chips.map((name) => (
              <button
                key={name}
                className={`chip${filter === name ? " active" : ""}`}
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <span className="fl-count">
            {shownCount} {shownCount === 1 ? "article" : "articles"}
          </span>
        </div>
      </div>

      {/* FEATURED LEAD */}
      {featured && featuredVisible && (
        <section className="sec">
          <div className="wrap">
            <Link className="feat" href={`/insights/${featured.slug}`}>
              <div className="f-img">
                <span className="f-tag">Latest</span>
                <Media src={featured.cover_image_url} alt={featured.title} />
              </div>
              <div className="f-body">
                <div className="f-eye">{featured.category} · Featured</div>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <div className="f-meta">
                  <span>{featured.author}</span>
                  <span className="sep" />
                  <span>{formatMonthYear(featured.published_at)}</span>
                  <span className="sep" />
                  <span>{featured.read_minutes} min read</span>
                </div>
                <span className="f-more">
                  Read the article <span className="arr">→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="sec">
        <div className="wrap">
          <div className="grid-head">
            <h2>{filter === "All" ? "More reading" : filter}</h2>
            <span className="gh-note">Newest first</span>
          </div>
          <div className="writing">
            {visibleRest.map((post) => (
              <Link className="art" href={`/insights/${post.slug}`} key={post.id}>
                <div className="art-img">
                  <Media src={post.cover_image_url} alt={post.title} />
                </div>
                <div className="art-body">
                  <div className="meta">
                    <span className="cat">{post.category}</span>
                    <span className="date">{formatYear(post.published_at)}</span>
                    <span className="rt">{post.read_minutes} min</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="more">
                    Read article <span className="arr">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className={`no-match${shownCount === 0 ? " show" : ""}`}>
            No articles in this topic yet — more on the way.
          </div>
        </div>
      </section>
    </>
  );
}
