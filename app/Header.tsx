"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, LogOut, BookOpen } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black select-none">
            P
          </div>
          PlacedIn
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/sheets" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
            <BookOpen size={14} />
            Sheets
          </Link>
          <Link href="/#features" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
            Features
          </Link>
          <Link href="/#faq" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Auth — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/signIn" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                Sign in
              </Link>
              <Link href="/signUp" className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                Get started free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 py-4 space-y-1">
          <Link href="/sheets" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors" onClick={() => setOpen(false)}>
            <BookOpen size={14} /> Sheets
          </Link>
          <Link href="/#features" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors" onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link href="/#faq" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors" onClick={() => setOpen(false)}>
            FAQ
          </Link>
          <div className="pt-2 border-t border-border/40 mt-2 space-y-1">
            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors" onClick={() => setOpen(false)}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/signIn" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link href="/signUp" className="block px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors" onClick={() => setOpen(false)}>
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
