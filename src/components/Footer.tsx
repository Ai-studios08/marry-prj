import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Instagram, Facebook, Linkedin } from 'lucide-react';
import { SITE } from '../data/site';

export function Footer() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [pastHero, setPastHero] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    const update = () => setPastHero(window.scrollY > 260);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isHome]);

  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
    SITE.whatsappPrefill
  )}`;

  return (
    <>
      <footer className="bg-[#0F2A43] text-[#FAF7F2] border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Brand & Address */}
            <div className="space-y-4">
              <Link to="/" className="font-serif text-2xl font-semibold text-white block">
                {SITE.hotelName}
              </Link>
              <p className="text-sm leading-relaxed text-[#FAF7F2]/80 max-w-[30ch]">
                {SITE.tagline} in {SITE.city}, {SITE.state}.
              </p>
              <address className="not-italic text-sm leading-relaxed text-[#FAF7F2]/75">
                {SITE.addressLine1},
                <br />
                {SITE.addressLine2}
              </address>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg text-white">Explore</h2>
              <ul className="space-y-2.5 text-sm text-[#FAF7F2]/80">
                <li>
                  <Link to="/rooms" className="hover:text-[#C8963E] transition-colors">
                    Rooms &amp; Suites
                  </Link>
                </li>
                <li>
                  <Link to="/venues" className="hover:text-[#C8963E] transition-colors">
                    Venues &amp; Banquets
                  </Link>
                </li>
                <li>
                  <Link to="/experiences" className="hover:text-[#C8963E] transition-colors">
                    Dining &amp; Soma Spa
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="hover:text-[#C8963E] transition-colors">
                    Photo Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Reservations */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg text-white">Reservations</h2>
              <ul className="space-y-2.5 text-sm text-[#FAF7F2]/80">
                <li>
                  <Link to="/book" className="hover:text-[#C8963E] transition-colors">
                    Book Online
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#C8963E] transition-colors">
                    Wedding &amp; Event Enquiry
                  </Link>
                </li>
                <li>Check-in: {SITE.checkInTime}</li>
                <li>Check-out: {SITE.checkOutTime}</li>
              </ul>
            </div>

            {/* Column 4: Direct Desk & Social */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg text-white">Concierge Desk</h2>
              <div className="space-y-2 text-sm text-[#FAF7F2]/80">
                <p>
                  <a href={SITE.phoneHref} className="hover:text-[#C8963E] transition-colors">
                    {SITE.phone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="hover:text-[#C8963E] transition-colors break-all"
                  >
                    {SITE.email}
                  </a>
                </p>
                <p className="text-xs text-[#FAF7F2]/65 pt-1">{SITE.deskHours}</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={SITE.socialLinks[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/20 text-[#FAF7F2] hover:border-[#C8963E] hover:text-[#C8963E] transition-colors"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={SITE.socialLinks[1].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/20 text-[#FAF7F2] hover:border-[#C8963E] hover:text-[#C8963E] transition-colors"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={SITE.socialLinks[2].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/20 text-[#FAF7F2] hover:border-[#C8963E] hover:text-[#C8963E] transition-colors"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-[#FAF7F2]/70">
            <p>
              © {new Date().getFullYear()} {SITE.hotelName}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/book" className="hover:text-white transition-colors">
                Booking &amp; Cancellation Terms
              </Link>
              <a href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Concierge Button (48px compact touch target, unobtrusive bottom-right) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Concierge"
        tabIndex={pastHero ? 0 : -1}
        aria-hidden={!pastHero}
        className={`fixed bottom-4 right-4 z-30 inline-flex h-12 w-12 md:w-auto md:px-4 items-center justify-center gap-2 rounded-full bg-[#2E7D5B] text-white shadow-lg border border-white/20 hover:bg-[#25674b] transition-[transform,opacity] duration-200 ${
          pastHero
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="hidden md:inline text-sm font-medium whitespace-nowrap">WhatsApp</span>
      </a>
    </>
  );
}
