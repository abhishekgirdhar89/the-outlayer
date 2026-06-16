"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark, Wordmark } from "./BrandMark";
import type { NavItem } from "@/lib/types";

export function NavBar({
  navItems,
  brandName,
  ctaLabel,
  ctaHref,
  active,
}: {
  navItems: NavItem[];
  brandName: string;
  ctaLabel: string;
  ctaHref: string;
  active?: string;
}) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    !!active && (href === `/${active}` || href.endsWith(`/${active}`));

  return (
    <header className={`top${solid ? " solid" : ""}`} id="nav">
      <div className="wrap top-row">
        <Link className="brandline" href="/" aria-label={`${brandName} home`}>
          <BrandMark />
          <Wordmark name={brandName} />
        </Link>
        <nav className="top-links" aria-label="Primary">
          {navItems.map((l) => (
            <Link key={l.id} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="top-cta">
          {ctaLabel && (
            <Link className="btn btn-primary nav-book" href={ctaHref || "/#enquiry"}>
              {ctaLabel}
            </Link>
          )}
          <button
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <nav className={`mobile-menu${open ? " open" : ""}`} id="mobileMenu" aria-label="Mobile">
        {navItems.map((l) => (
          <Link key={l.id} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        {ctaLabel && (
          <Link className="btn btn-primary" href={ctaHref || "/#enquiry"} onClick={() => setOpen(false)}>
            {ctaLabel}
          </Link>
        )}
      </nav>
    </header>
  );
}
