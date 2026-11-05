"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { siteConfig } from "@/config/site";
import { Icon } from "./icon";

export function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target) && !trigger.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = href.split("#")[1];
    const target = hash ? document.getElementById(hash) : null;
    if (!target) return;
    event.preventDefault();
    window.history.pushState(null, "", `#${hash}`);
    requestAnimationFrame(() => target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }));
  }

  return <header className="site-header">
    <div className="shell header-inner">
      <Link href="/" className="brand" aria-label={`${siteConfig.name} — accueil`} onClick={() => setOpen(false)}>
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/wordmark.svg`} alt="Cognalys Intelligence — Repensons vos systèmes avec intelligence" width={940} height={175} className="brand-logo" priority />
      </Link>
      <nav className="desktop-nav" aria-label="Navigation principale">{siteConfig.nav.map(item => <a key={item.href} href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${item.href}`} className={item.href === "/#demonstration" ? "demo-nav-cta" : undefined} onClick={event => navigate(event, item.href)}>{item.href === "/#demonstration" && <span className="demo-radar" aria-hidden="true" />}{item.label}</a>)}</nav>
      <Link className="button button-header" href="/#contact">{siteConfig.hero.primaryCta} <Icon name="arrowUpRight" /></Link>
      <button ref={trigger} className="menu-toggle icon-button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(value => !value)}><Icon name={open ? "close" : "menu"} /></button>
    </div>
    <div ref={menu} id="mobile-menu" className="mobile-menu" hidden={!open}>
      <nav className="shell" aria-label="Navigation mobile">{siteConfig.nav.map(item => <a key={item.href} href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${item.href}`} className={item.href === "/#demonstration" ? "demo-nav-cta" : undefined} onClick={event => navigate(event, item.href)}>{item.href === "/#demonstration" && <span className="demo-radar" aria-hidden="true" />}{item.label}<Icon name="arrowUpRight" /></a>)}<Link href="/#contact" onClick={() => setOpen(false)}>{siteConfig.hero.primaryCta}<Icon name="arrowUpRight" /></Link></nav>
    </div>
  </header>;
}
