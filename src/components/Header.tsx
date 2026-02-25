import { Link, useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, Menu, X, LogOut, LayoutList } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { useScrolled } from "@/hooks/use-scroll";
import { NAV_ITEMS, COMPANY_WEBSITE_URL } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/AuthContext";

export function Header() {
  const scrolled = useScrolled(40);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Auth button for desktop (non-scrolled)
  const DesktopAuthButtonFlat = user ? (
    <div className="flex items-center gap-1.5">
      <Link
        to="/applications"
        className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <LayoutList className="h-3.5 w-3.5" />
        My Applications
      </Link>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm font-bold uppercase tracking-[0.1em] text-background transition-all hover:opacity-90"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign Out
      </button>
    </div>
  ) : (
    <Link
      to="/signin"
      className="rounded-full bg-foreground px-5 py-2 text-sm font-bold uppercase tracking-[0.1em] text-background transition-all hover:opacity-90"
    >
      Sign In
    </Link>
  );

  // Auth button for desktop (scrolled)
  const DesktopAuthButtonScrolled = user ? (
    <>
      <Link
        to="/applications"
        className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <LayoutList className="h-3.5 w-3.5" />
        My Applications
      </Link>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-all hover:text-foreground"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign Out
      </button>
    </>
  ) : (
    <Link
      to="/signin"
      className="rounded-full bg-foreground px-5 py-1.5 text-sm font-bold uppercase tracking-[0.1em] text-background transition-all hover:opacity-90"
    >
      Sign In
    </Link>
  );

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4 lg:px-8">
      {/* Default: single bar. Scrolled: two separate pills */}
      <div
        className={cn(
          "mx-auto transition-all duration-500",
          scrolled ? "flex items-center justify-between gap-4" : "block"
        )}
      >
        {/* When not scrolled: unified bar */}
        {!scrolled && (
          <div className="flex items-center justify-between py-2 px-2">
            <Link to="/" className="flex-shrink-0 px-2">
              <Logo />
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              <nav className="flex items-center gap-6">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="nav-link-wavy relative px-1 py-2 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={COMPANY_WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link-wavy relative flex items-center gap-1 px-1 py-2 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Company
                  <ExternalLink className="h-3 w-3" />
                </a>
              </nav>

              {DesktopAuthButtonFlat}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}

        {/* When scrolled: two separate glass pills */}
        {scrolled && (
          <>
            <Link
              to="/"
              className="flex-shrink-0 rounded-full glass px-4 py-2.5 transition-all duration-300"
            >
              <Logo />
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-1 rounded-full glass px-3 py-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="nav-link-wavy relative rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={COMPANY_WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link-wavy relative flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Company
                  <ExternalLink className="h-3 w-3" />
                </a>
                <div className="mx-2 h-4 w-px bg-border" />
                {DesktopAuthButtonScrolled}
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-full glass p-2.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden"
          >
            <nav className="mt-2 flex flex-col gap-1 rounded-2xl glass p-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={COMPANY_WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Company
                <ExternalLink className="h-3 w-3" />
              </a>
              {user ? (
                <>
                  <Link
                    to="/applications"
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <LayoutList className="h-4 w-4" />
                    My Applications
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="mt-2 rounded-xl bg-foreground px-4 py-3 text-center text-sm font-medium text-background"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
