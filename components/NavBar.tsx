"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandMark, Wordmark } from "./BrandMark";
import { PracticeIcon } from "./service/PracticeIcon";
import type { NavItem } from "@/lib/types";

export type PracticeMenuItem = { slug: string; label: string; blurb: string; umbrella: boolean };

export function NavBar({
  navItems,
  services = [],
  brandName,
  ctaLabel,
  ctaHref,
  active,
}: {
  navItems: NavItem[];
  services?: PracticeMenuItem[];
  brandName: string;
  ctaLabel: string;
  ctaHref: string;
  active?: string;
}) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [practice, setPractice] = useState(false); // desktop dropdown
  const [mPractice, setMPractice] = useState(false); // mobile practice expander
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the dropdown on Escape or an outside click (covers click-opened state)
  useEffect(() => {
    if (!practice) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPractice(false);
    const onDoc = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setPractice(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDoc);
    };
  }, [practice]);

  const isActive = (href: string) => !!active && (href === `/${active}` || href.endsWith(`/${active}`));
  const isPractice = (item: NavItem) =>
    services.length > 0 && (/practice/i.test(item.label) || item.href.includes("#services"));

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPractice(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPractice(false), 140);
  };

  const panel = (onItemClick?: () => void) => (
    <div className="practice-panel" role="menu" aria-label="Practice areas">
      <div className="practice-head">Practice areas</div>
      {services.map((s) => (
        <Link
          key={s.slug}
          className="practice-item"
          href={`/services/${s.slug}`}
          role="menuitem"
          onClick={onItemClick}
        >
          <span className="pi-icon"><PracticeIcon slug={s.slug} /></span>
          <span className="pi-body">
            <span className="pi-title">
              {s.label}
              {s.umbrella && <span className="pi-badge">Umbrella</span>}
            </span>
            <span className="pi-blurb">{s.blurb}</span>
          </span>
          <span className="pi-arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );

  return (
    <header className={`top${solid ? " solid" : ""}`} id="nav">
      <div className="wrap top-row">
        <Link className="brandline" href="/" aria-label={`${brandName} home`}>
          <BrandMark />
          <Wordmark name={brandName} />
        </Link>
        <nav className="top-links" aria-label="Primary">
          <ul className="top-links-list">
            {navItems.map((l) =>
              isPractice(l) ? (
                <li className="nav-drop" key={l.id} ref={dropRef} onMouseEnter={openNow} onMouseLeave={scheduleClose}>
                  <button
                    type="button"
                    className={`nav-drop-btn${practice ? " open" : ""}`}
                    aria-haspopup="true"
                    aria-expanded={practice}
                    onClick={() => setPractice((v) => !v)}
                  >
                    {l.label}
                    <span className="nav-caret" aria-hidden="true" />
                  </button>
                  <div className={`practice-wrap${practice ? " open" : ""}`}>{panel(() => setPractice(false))}</div>
                </li>
              ) : (
                <li key={l.id}>
                  <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
                    {l.label}
                  </Link>
                </li>
              )
            )}
          </ul>
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
        {navItems.map((l) =>
          isPractice(l) ? (
            <div className="m-practice" key={l.id}>
              <button
                type="button"
                className={`m-practice-btn${mPractice ? " open" : ""}`}
                aria-expanded={mPractice}
                onClick={() => setMPractice((v) => !v)}
              >
                {l.label}
                <span className="nav-caret" aria-hidden="true" />
              </button>
              {mPractice && (
                <div className="m-practice-list">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      className="practice-item"
                      href={`/services/${s.slug}`}
                      onClick={() => { setOpen(false); setMPractice(false); }}
                    >
                      <span className="pi-icon"><PracticeIcon slug={s.slug} /></span>
                      <span className="pi-body">
                        <span className="pi-title">
                          {s.label}
                          {s.umbrella && <span className="pi-badge">Umbrella</span>}
                        </span>
                        <span className="pi-blurb">{s.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={l.id} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          )
        )}
        {ctaLabel && (
          <Link className="btn btn-primary" href={ctaHref || "/#enquiry"} onClick={() => setOpen(false)}>
            {ctaLabel}
          </Link>
        )}
      </nav>
    </header>
  );
}
