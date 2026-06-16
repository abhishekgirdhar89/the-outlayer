"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Media } from "./Media";
import type { Post } from "@/lib/types";
import { categoryKey, formatMonthYear, formatYear } from "@/lib/utils";

const CHIPS = [
  { key: "all", label: "All" },
  { key: "strategy", label: "Strategy" },
  { key: "ai", label: "AI" },
  { key: "growth", label: "Growth" },
  { key: "ops", label: "Ops" },
];

const HEADINGS: Record<string, string> = {
  all: "More reading",
  strategy: "Strategy",
  ai: "AI in practice",
  growth: "Growth",
  ops: "Operations",
};

export function InsightsList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("all");

  const featured = useMemo(() => posts.find((p) => p.featured) ?? posts[0] ?? null, [posts]);
  const rest = useMemo(
    () => (featured ? posts.filter((p) => p.id !== featured.id) : posts),
    [posts, featured]
  );

  const matches = (p: Post) => filter === "all" || categoryKey(p.category) === filter;
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
            {CHIPS.map((c) => (
              <button
                key={c.key}
                className={`chip${filter === c.key ? " active" : ""}`}
                aria-pressed={filter === c.key}
                onClick={() => setFilter(c.key)}
              >
                {c.label}
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
            <h2>{HEADINGS[filter]}</h2>
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
