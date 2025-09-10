'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
      if (!isMobileMenuOpen) return;

      if (event.key === 'Tab') {
        const container = mobileMenuRef.current;
        if (!container) return;

        const focusableSelectors = [
          'a[href]',
          'button:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ];
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
        ).filter(
          (el) =>
            !el.hasAttribute('disabled') &&
            el.tabIndex !== -1 &&
            el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const isShift = event.shiftKey;

        if (isShift && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!isShift && active === last) {
          event.preventDefault();
          first.focus();
        } else if (!container.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    if (isMobileMenuOpen) {
      lastFocusedRef.current = (document.activeElement as HTMLElement) || null;
      window.addEventListener('keydown', onKeyDown);
      // Focus first focusable element when opening
      setTimeout(() => {
        const container = mobileMenuRef.current;
        if (!container) return;
        const first = container.querySelector<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();
      }, 0);
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            My App
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              aria-haspopup="menu"
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </Button>
          </div>
        </div>
        {/* Backdrop */}
        <div
          aria-hidden={!isMobileMenuOpen}
          className={`md:hidden fixed inset-0 bg-black/40 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => {
            setIsMobileMenuOpen(false);
            (menuButtonRef.current || lastFocusedRef.current)?.focus?.();
          }}
        />

        {/* Mobile Menu Panel (slide-down) */}
        <div
          id="mobile-nav"
          aria-hidden={!isMobileMenuOpen}
          role="dialog"
          aria-modal="true"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out space-y-2 relative z-10 ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 pb-4'
              : 'max-h-0 opacity-0 pb-0 pointer-events-none'
          }`}
          ref={mobileMenuRef}
        >
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block"
          >
            <Button variant="outline" className="w-full justify-center">
              Login
            </Button>
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block"
          >
            <Button className="w-full justify-center">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
