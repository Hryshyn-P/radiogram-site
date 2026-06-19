import { Radio, Menu, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const SUPPORT_EMAIL = "hpgameslab@gmail.com";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/support", label: "Support" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent shadow-glow">
              <Radio className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold tracking-tight">Radiogram</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="rounded-md p-2 text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-border/60 bg-background/95 px-6 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-card hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/60">
        <div className="container mx-auto grid gap-8 px-6 py-12 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              <span className="font-semibold">Radiogram</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Radiogram is an independent world internet radio player for iPhone, iPad, and Mac.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Contact
            </h4>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="container mx-auto px-6 py-5 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Radiogram. All rights reserved.</p>
            <p className="mt-2">
              Station directory data provided by{" "}
              <a
                href="https://www.radio-browser.info/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                Radio Browser
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
