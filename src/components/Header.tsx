import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { SITE } from '../data/site';

const EXPERIENCES_MENU = [
  { label: 'All Experiences', to: '/experiences' },
  { label: 'Darbar Courtyard Dining', to: '/experiences#darbar-courtyard-dining' },
  { label: 'Soma Ayurvedic Sanctuary', to: '/experiences#soma-ayurveda-sanctuary' },
  { label: 'Stepwell Pool & Heritage', to: '/experiences#heated-stepwell-pool' },
];

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [scrolledPastHeroThreshold, setScrolledPastHeroThreshold] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setExpDropdownOpen(false);
    setHiddenOnScroll(false);
  }, [location.pathname, location.hash]);

  // Passive scroll listener with rAF for transparent->solid & hide-down/show-up
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolledPastHeroThreshold(y > 40);

        if (mobileMenuOpen) {
          setHiddenOnScroll(false);
        } else if (y > 120 && y > lastScrollY.current + 6) {
          setHiddenOnScroll(true);
          setExpDropdownOpen(false);
        } else if (y < lastScrollY.current - 6 || y <= 80) {
          setHiddenOnScroll(false);
        }

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileMenuOpen]);

  // Close Experiences dropdown on outside click or Escape
  useEffect(() => {
    if (!expDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExpDropdownOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [expDropdownOpen]);

  // Mobile drawer scroll lock, Escape, and focus trap
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const drawer = mobileDrawerRef.current;
    const focusables = drawer
      ? Array.from(
          drawer.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];

    if (focusables[0]) {
      focusables[0].focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const useSolidHeader = !isHome || scrolledPastHeroThreshold;

  const headerBgClass = useSolidHeader
    ? 'bg-[#FAF7F2]/95 text-[#1B1F24] border-b border-[#E7E2D9] backdrop-blur-sm'
    : 'bg-gradient-to-b from-[#0F2A43]/70 to-transparent text-white border-b border-transparent';

  const navLinkClass = (path: string) => {
    const active =
      path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(path);
    return `relative py-1 text-[15px] font-medium whitespace-nowrap shrink-0 transition-opacity duration-200 hover:opacity-80 ${
      active ? 'underline underline-offset-8 decoration-[#C8963E] decoration-2' : ''
    }`;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-16 md:h-[72px] transition-transform duration-300 ease-out ${
          hiddenOnScroll ? '-translate-y-full' : 'translate-y-0'
        } ${headerBgClass}`}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-8 px-4 md:px-6">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="font-serif text-[20px] md:text-[22px] font-semibold tracking-tight whitespace-nowrap shrink-0"
          >
            {SITE.hotelName}
          </Link>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7"
          >
            <Link to="/rooms" className={navLinkClass('/rooms')}>
              Rooms
            </Link>
            <Link to="/venues" className={navLinkClass('/venues')}>
              Venues
            </Link>

            {/* Experiences with accessible dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                aria-expanded={expDropdownOpen}
                aria-haspopup="menu"
                onClick={() => setExpDropdownOpen((prev) => !prev)}
                className={`${navLinkClass('/experiences')} inline-flex items-center gap-1.5 cursor-pointer`}
              >
                <span>Experiences</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expDropdownOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {expDropdownOpen && (
                <div
                  role="menu"
                  aria-label="Experiences submenu"
                  className="absolute left-0 top-full mt-3 w-64 rounded-[12px] bg-[#FAF7F2] text-[#1B1F24] border border-[#E7E2D9] shadow-lg py-2 z-50"
                >
                  {EXPERIENCES_MENU.map((item) => (
                    <Link
                      key={item.to}
                      role="menuitem"
                      to={item.to}
                      onClick={() => setExpDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium hover:bg-white hover:text-[#0F2A43] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/gallery" className={navLinkClass('/gallery')}>
              Gallery
            </Link>
            <Link to="/contact" className={navLinkClass('/contact')}>
              Contact
            </Link>
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/book"
              className="btn-motion btn-gold-shimmer hidden sm:inline-flex items-center justify-center h-11 md:h-12 px-5 md:px-6 rounded-[12px] bg-[#C8963E] text-[#0F2A43] text-[14px] md:text-[15px] font-semibold whitespace-nowrap shrink-0"
            >
              <span className="relative z-10">Book Now</span>
            </Link>

            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[12px] border border-current/25 cursor-pointer"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          ref={mobileDrawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col bg-[#0F2A43] text-[#FAF7F2] px-6 py-5 overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif text-[20px] font-semibold whitespace-nowrap"
            >
              {SITE.hotelName}
            </Link>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => {
                setMobileMenuOpen(false);
                mobileMenuButtonRef.current?.focus();
              }}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[12px] border border-white/25 text-white cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile primary navigation" className="mt-10 flex flex-col gap-4">
            {[
              { label: 'Home', to: '/' },
              { label: 'Rooms & Suites', to: '/rooms' },
              { label: 'Venues & Banquets', to: '/venues' },
              { label: 'Experiences', to: '/experiences' },
              { label: 'Gallery', to: '/gallery' },
              { label: 'Contact', to: '/contact' },
            ].map((item, idx) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{ '--hero-delay': `${idx * 55}ms` } as React.CSSProperties}
                className="hero-stagger font-serif text-3xl py-2 border-b border-white/10 hover:text-[#C8963E] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 flex flex-col gap-4">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center h-12 px-6 rounded-[12px] bg-[#C8963E] text-[#0F2A43] font-semibold text-base"
            >
              Book Your Stay
            </Link>
            <div className="text-sm text-[#FAF7F2]/80 space-y-1">
              <p>{SITE.phone}</p>
              <p>{SITE.addressLine1}, {SITE.city}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
