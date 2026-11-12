import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Star,
} from 'lucide-react';
import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { EnquirySection } from '../components/EnquirySection';
import { MediaImage } from '../components/MediaImage';
import { Reveal } from '../components/Reveal';
import { EXPERIENCES } from '../data/experiences';
import { MEDIA } from '../data/media';
import { REVIEWS } from '../data/reviews';
import { ROOMS } from '../data/rooms';
import { SITE } from '../data/site';
import { VENUES } from '../data/venues';
import {
  addDays,
  formatINR,
  getTodayLocalDateStr,
  validateSearchParams,
} from '../lib/booking';
import { usePageMeta } from '../lib/seo';

export default function HomePage() {
  const navigate = useNavigate();
  const today = getTodayLocalDateStr();

  usePageMeta({
    title: `${SITE.hotelName} — Luxury Heritage Hotel & Banquets, ${SITE.city}`,
    description:
      'Carved sandstone courtyards, twenty-eight lakeside suites, Ayurvedic spa sanctuary, and grand banquet halls in Udaipur, India.',
  });

  // Hero glass booking bar state
  const [checkIn, setCheckIn] = useState(() => addDays(today, 1));
  const [checkOut, setCheckOut] = useState(() => addDays(today, 3));
  const [guests, setGuests] = useState(2);
  const [barError, setBarError] = useState<string | null>(null);

  // Rooms carousel state
  const roomsTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  // Experiences hover/active crossfade state (desktop)
  const [activeExpIndex, setActiveExpIndex] = useState(0);

  // Reviews carousel state
  const reviewsTrackRef = useRef<HTMLDivElement | null>(null);

  const handleBookingBarSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateSearchParams({
      checkIn,
      checkOut,
      adults: guests,
      children: 0,
      rooms: Math.max(1, Math.ceil(guests / 3)),
      today,
    });
    if (!validation.valid) {
      setBarError(
        validation.errors.checkIn ??
          validation.errors.checkOut ??
          validation.errors.guests ??
          'Please select valid stay dates.'
      );
      return;
    }
    setBarError(null);
    const roomsNeeded = Math.max(1, Math.ceil(guests / 3));
    try {
      sessionStorage.setItem(
        'rajvansh_booking_draft',
        JSON.stringify({
          step: 2,
          checkIn,
          checkOut,
          adults: guests,
          children: 0,
          rooms: roomsNeeded,
          selectedRoomId: ROOMS[0].id,
          ratePlan: 'flexible',
          guest: {
            fullName: '',
            email: '',
            phone: '',
            specialRequests: '',
            acceptedTerms: false,
          },
        })
      );
    } catch {
      // Ignore storage failures
    }
    navigate(
      `/book?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(
        checkOut
      )}&adults=${guests}&rooms=${roomsNeeded}`
    );
  };

  const scrollRoomsBy = (direction: -1 | 1) => {
    const track = roomsTrackRef.current;
    if (!track) return;
    const nextIdx = Math.max(0, Math.min(ROOMS.length - 1, activeRoomIndex + direction));
    setActiveRoomIndex(nextIdx);
    const child = track.children[nextIdx] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
  };

  const handleRoomsScroll = () => {
    const track = roomsTrackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let minDiff = Infinity;
    Array.from(track.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const diff = Math.abs(el.offsetLeft - track.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closest = idx;
      }
    });
    setActiveRoomIndex(closest);
  };

  const scrollReviewsBy = (direction: -1 | 1) => {
    const track = reviewsTrackRef.current;
    if (!track) return;
    const step = Math.min(440, track.clientWidth * 0.85);
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const scrollToEnquiryWithContext = () => {
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-fade">
      {/* 1. HERO SECTION */}
      <section
        aria-label="Welcome to The Rajvansh Courtyard"
        className="relative min-h-[100svh] flex flex-col justify-between bg-[#0F2A43] text-white overflow-hidden pt-20 md:pt-28 pb-6 md:pb-10"
      >
        {/* Background Image with slow 12s zoom + dark scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <MediaImage
            asset={MEDIA.heroCourtyard}
            priority
            sizes="100vw"
            className="hero-bg-zoom h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A43]/90 via-[#0F2A43]/55 to-[#0F2A43]/40" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 md:px-6 flex-1 flex flex-col justify-center py-4 md:py-10">
          <div className="max-w-[740px] space-y-4 md:space-y-5">
            <p
              style={{ '--hero-delay': '0ms' } as React.CSSProperties}
              className="hero-stagger text-[13px] font-medium tracking-[0.16em] uppercase text-[#C8963E]"
            >
              {SITE.city}, {SITE.country} · {SITE.tagline}
            </p>

            <h1 className="type-h1 text-white font-medium">
              <span
                style={{ '--hero-delay': '60ms' } as React.CSSProperties}
                className="hero-stagger block"
              >
                {SITE.heroHeadingLines[0]}
              </span>
              <span
                style={{ '--hero-delay': '120ms' } as React.CSSProperties}
                className="hero-stagger block italic font-normal text-[#FAF7F2]"
              >
                {SITE.heroHeadingLines[1]}
              </span>
            </h1>

            <p
              style={{ '--hero-delay': '180ms' } as React.CSSProperties}
              className="hero-stagger text-[15px] md:text-lg leading-[1.55] md:leading-[1.6] text-[#FAF7F2]/90 max-w-[58ch]"
            >
              {SITE.heroSubtext}
            </p>

            <div
              style={{ '--hero-delay': '240ms' } as React.CSSProperties}
              className="hero-stagger flex flex-wrap items-center gap-3 md:gap-4 pt-1"
            >
              <ActionButton variant="gold" label="Book Now" showArrow to="/book" />
              <ActionButton variant="ghost-light" label="Explore Rooms" to="/rooms" />
            </div>
          </div>
        </div>

        {/* Bottom Area: Glass Booking Bar + Scroll Indicator in clean non-overlapping flow */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 md:px-6 space-y-4 md:space-y-5">
          <form
            onSubmit={handleBookingBarSubmit}
            aria-label="Quick availability search"
            className="rounded-[16px] bg-[#0F2A43]/88 md:bg-[#0F2A43]/75 backdrop-blur-md border border-white/20 p-3.5 md:p-5 shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 items-end">
              <div className="lg:col-span-3">
                <label
                  htmlFor="hero-checkin"
                  className="block text-xs font-medium tracking-wide uppercase text-[#FAF7F2]/80 mb-1.5"
                >
                  Check-in
                </label>
                <input
                  id="hero-checkin"
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    const nextIn = e.target.value;
                    setCheckIn(nextIn);
                    if (nextIn >= checkOut) {
                      setCheckOut(addDays(nextIn, 1));
                    }
                  }}
                  className="h-12 w-full rounded-[12px] bg-white text-[#1B1F24] px-3.5 text-sm font-medium border border-[#E7E2D9]"
                />
              </div>

              <div className="lg:col-span-3">
                <label
                  htmlFor="hero-checkout"
                  className="block text-xs font-medium tracking-wide uppercase text-[#FAF7F2]/80 mb-1.5"
                >
                  Check-out
                </label>
                <input
                  id="hero-checkout"
                  type="date"
                  min={addDays(checkIn, 1)}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="h-12 w-full rounded-[12px] bg-white text-[#1B1F24] px-3.5 text-sm font-medium border border-[#E7E2D9]"
                />
              </div>

              <div className="lg:col-span-3">
                <label
                  htmlFor="hero-guests"
                  className="block text-xs font-medium tracking-wide uppercase text-[#FAF7F2]/80 mb-1.5"
                >
                  Guests
                </label>
                <select
                  id="hero-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-12 w-full rounded-[12px] bg-white text-[#1B1F24] px-3.5 text-sm font-medium border border-[#E7E2D9]"
                >
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3">
                <ActionButton
                  type="submit"
                  variant="gold"
                  label="Check Availability"
                  fullWidth
                />
              </div>
            </div>

            {barError && (
              <p role="alert" className="mt-3 text-xs text-[#FADBD8] font-medium">
                {barError}
              </p>
            )}
          </form>

          <div className="flex items-center justify-center">
            <a
              href="#intro"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-[#FAF7F2]/80 hover:text-white transition-colors py-1"
            >
              <span>Scroll</span>
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section id="intro" className="py-14 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <Reveal className="lg:col-span-5 space-y-5">
              <SectionEyebrow>The Estate · Fateh Sagar</SectionEyebrow>
              <h2 className="type-h2 text-[#0F2A43]">
                Hand-dressed Mewari sandstone around quiet lotus courts.
              </h2>
              <p className="text-base leading-[1.65] text-[#5B6470] max-w-[65ch]">
                Restored over four years with Udaipur’s third-generation silawat stone masons,{' '}
                {SITE.hotelName} pairs intimate lakeside living with ceremonial scale. Mornings
                unfold to courtyard birdsong and Soma herbal baths; evenings gather beneath the
                Grand Durbar vaults.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-[#1B1F24] border-t border-[#E7E2D9]">
                <div className="pt-4">
                  <span className="font-serif text-2xl font-medium text-[#0F2A43] tabular-nums">
                    28
                  </span>
                  <span className="block text-xs text-[#5B6470]">Courtyard &amp; Lake Suites</span>
                </div>
                <div className="pt-4">
                  <span className="font-serif text-2xl font-medium text-[#0F2A43] tabular-nums">
                    850
                  </span>
                  <span className="block text-xs text-[#5B6470]">Max Banquet Capacity</span>
                </div>
                <div className="pt-4">
                  <span className="font-serif text-2xl font-medium text-[#0F2A43] tabular-nums">
                    4.2
                  </span>
                  <span className="block text-xs text-[#5B6470]">Acres of Lawns &amp; Courts</span>
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={80} className="lg:col-span-7">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 sm:col-span-8 overflow-hidden rounded-[16px] shadow-md">
                  <MediaImage
                    asset={MEDIA.introVeranda}
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                <div className="col-span-8 sm:col-span-4 sm:-mt-12 overflow-hidden rounded-[16px] shadow-md border-4 border-[#FAF7F2]">
                  <MediaImage
                    asset={MEDIA.expAyurvedaSpa}
                    sizes="(max-width: 768px) 60vw, 260px"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. ROOMS & SUITES CAROUSEL */}
      <section aria-labelledby="rooms-heading" className="py-14 md:py-24 bg-white border-y border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <Reveal className="space-y-3">
              <SectionEyebrow>Accommodations</SectionEyebrow>
              <h2 id="rooms-heading" className="type-h2 text-[#0F2A43]">
                Rooms, Pavilions &amp; Royal Suites
              </h2>
            </Reveal>

            <div className="flex items-center gap-4">
              <span
                aria-live="polite"
                className="text-sm font-medium text-[#5B6470] tabular-nums"
              >
                {String(activeRoomIndex + 1).padStart(2, '0')} /{' '}
                {String(ROOMS.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRoomsBy(-1)}
                  disabled={activeRoomIndex === 0}
                  aria-label="Previous room"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#E7E2D9] text-[#0F2A43] hover:bg-[#FAF7F2] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRoomsBy(1)}
                  disabled={activeRoomIndex === ROOMS.length - 1}
                  aria-label="Next room"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#E7E2D9] text-[#0F2A43] hover:bg-[#FAF7F2] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal CSS scroll-snap carousel */}
          <div
            ref={roomsTrackRef}
            onScroll={handleRoomsScroll}
            role="region"
            aria-roledescription="carousel"
            aria-label="Rooms and Suites showcase"
            className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4"
          >
            {ROOMS.map((room) => (
              <article
                key={room.id}
                className="group snap-start shrink-0 w-[86%] sm:w-[62%] md:w-[46%] lg:w-[376px] rounded-[16px] bg-[#FAF7F2] border border-[#E7E2D9] overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="overflow-hidden aspect-[4/3]">
                  <MediaImage
                    asset={room.image}
                    sizes="(max-width: 640px) 86vw, 376px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[13px] text-[#5B6470]">
                      <span>{room.sizeSqFt} sq ft</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>{room.view}</span>
                    </p>
                    <h3 className="type-h3 text-[#0F2A43]">{room.name}</h3>
                    <p className="text-sm text-[#5B6470] leading-relaxed">{room.tagline}</p>
                  </div>

                  <div className="pt-4 border-t border-[#E7E2D9] flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-xs text-[#5B6470]">From</span>
                      <span className="font-serif text-xl font-medium text-[#0F2A43] tabular-nums">
                        {formatINR(room.startingPriceInr)}
                      </span>
                      <span className="text-xs text-[#5B6470]"> / night</span>
                    </div>
                    <Link
                      to={`/rooms/${room.slug}`}
                      className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#0F2A43] px-4 text-sm font-medium text-[#0F2A43] hover:bg-[#0F2A43] hover:text-white transition-colors whitespace-nowrap shrink-0"
                    >
                      View Room
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <ActionButton variant="ghost" label="Explore All Five Categories" showArrow to="/rooms" />
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCES (01-05 crossfade on desktop, stacked cards on mobile) */}
      <section aria-labelledby="experiences-heading" className="py-14 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <Reveal className="space-y-3 mb-10">
            <SectionEyebrow>Life at the Courtyard</SectionEyebrow>
            <h2 id="experiences-heading" className="type-h2 text-[#0F2A43]">
              Curated Dining, Spa &amp; Heritage Rituals
            </h2>
          </Reveal>

          {/* Desktop interactive list + crossfading media */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 divide-y divide-[#E7E2D9] border-y border-[#E7E2D9]">
              {EXPERIENCES.map((exp, idx) => {
                const isActive = activeExpIndex === idx;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onMouseEnter={() => setActiveExpIndex(idx)}
                    onFocus={() => setActiveExpIndex(idx)}
                    onClick={() => navigate(`/experiences#${exp.id}`)}
                    className={`w-full text-left py-5 px-4 transition-colors cursor-pointer flex items-start gap-5 ${
                      isActive ? 'bg-white' : 'hover:bg-white/60'
                    }`}
                  >
                    <span
                      className={`font-serif text-xl tabular-nums pt-0.5 ${
                        isActive ? 'text-[#C8963E]' : 'text-[#5B6470]'
                      }`}
                    >
                      {exp.number}
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-serif text-2xl text-[#0F2A43]">{exp.title}</h3>
                        <span className="text-xs text-[#5B6470] whitespace-nowrap">
                          {exp.category}
                        </span>
                      </div>
                      <p className="text-sm text-[#5B6470] leading-relaxed">{exp.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-6 relative rounded-[16px] overflow-hidden shadow-md min-h-[440px] bg-[#0F2A43]">
              {EXPERIENCES.map((exp, idx) => (
                <div
                  key={exp.id}
                  aria-hidden={activeExpIndex !== idx}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    activeExpIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <MediaImage
                    asset={exp.image}
                    sizes="560px"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A43]/85 via-[#0F2A43]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                    <p className="text-xs tracking-[0.12em] uppercase text-[#C8963E]">
                      {exp.timing}
                    </p>
                    <p className="font-serif text-2xl">{exp.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile stacked cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
            {EXPERIENCES.map((exp) => (
              <article
                key={exp.id}
                className="rounded-[16px] bg-white border border-[#E7E2D9] overflow-hidden shadow-sm"
              >
                <MediaImage
                  asset={exp.image}
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-5 space-y-2">
                  <p className="text-xs text-[#8C6421] font-medium tabular-nums">
                    {exp.number} · {exp.category}
                  </p>
                  <h3 className="font-serif text-xl text-[#0F2A43]">{exp.title}</h3>
                  <p className="text-sm text-[#5B6470]">{exp.subtitle}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <ActionButton variant="ghost" label="View All Experiences" showArrow to="/experiences" />
          </div>
        </div>
      </section>

      {/* 5. TEXT TICKER BAND */}
      <div
        aria-label="Hotel highlights"
        className="ticker-wrapper overflow-hidden bg-[#0F2A43] text-[#FAF7F2] py-4 border-y border-white/10"
      >
        <div className="ticker-track">
          {[0, 1].map((dup) => (
            <div key={dup} aria-hidden={dup === 1} className="flex items-center shrink-0">
              {SITE.tickerWords.map((word) => (
                <div key={`${dup}-${word}`} className="flex items-center">
                  <span className="px-6 font-serif text-lg md:text-xl tracking-wide whitespace-nowrap">
                    {word}
                  </span>
                  <span className="text-[#C8963E] text-xs" aria-hidden="true">
                    ◆
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 6. VENUES (Two alternating image + text blocks) */}
      <section aria-labelledby="venues-heading" className="py-14 md:py-24 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-16">
          <Reveal className="space-y-3 max-w-[65ch]">
            <SectionEyebrow>Banquets &amp; Celebrations</SectionEyebrow>
            <h2 id="venues-heading" className="type-h2 text-[#0F2A43]">
              Venues Built for Landmark Gatherings
            </h2>
            <p className="text-base text-[#5B6470] leading-relaxed">
              From candlelit sangeet galas inside vaulted stone halls to lakeside mandaps under open
              Rajasthani skies.
            </p>
          </Reveal>

          {VENUES.slice(0, 2).map((venue, idx) => {
            const reverseOnDesktop = idx % 2 === 1;
            return (
              <Reveal
                key={venue.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`lg:col-span-7 overflow-hidden rounded-[16px] shadow-md ${
                    reverseOnDesktop ? 'lg:order-2' : ''
                  }`}
                >
                  <MediaImage
                    asset={venue.image}
                    sizes="(max-width: 1024px) 100vw, 680px"
                    className="w-full aspect-[16/9] object-cover"
                  />
                </div>

                <div
                  className={`lg:col-span-5 space-y-5 ${
                    reverseOnDesktop ? 'lg:order-1' : ''
                  }`}
                >
                  <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8C6421]">
                    {venue.type}
                  </p>
                  <h3 className="type-h2 text-[#0F2A43]">{venue.name}</h3>
                  <p className="text-base text-[#5B6470] leading-relaxed">{venue.description}</p>

                  <dl className="grid grid-cols-3 gap-4 py-4 border-y border-[#E7E2D9] tabular-nums">
                    <div>
                      <dt className="text-xs text-[#5B6470]">Seated</dt>
                      <dd className="font-serif text-xl text-[#0F2A43]">
                        {venue.capacities.seatedBanquet}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#5B6470]">Reception</dt>
                      <dd className="font-serif text-xl text-[#0F2A43]">
                        {venue.capacities.cocktailReception}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#5B6470]">Area</dt>
                      <dd className="font-serif text-xl text-[#0F2A43]">
                        {venue.areaSqFt.toLocaleString('en-IN')} sq ft
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center gap-3">
                    <ActionButton
                      variant="primary"
                      label="Enquire"
                      showArrow
                      onClick={scrollToEnquiryWithContext}
                    />
                    <ActionButton variant="ghost" label="All Venues" to="/venues" />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 7. REVIEWS CAROUSEL */}
      <section aria-labelledby="reviews-heading" className="py-14 md:py-24 border-t border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <Reveal className="space-y-3">
              <SectionEyebrow>Guest Impressions</SectionEyebrow>
              <h2 id="reviews-heading" className="type-h2 text-[#0F2A43]">
                Words from Guests &amp; Wedding Hosts
              </h2>
            </Reveal>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollReviewsBy(-1)}
                aria-label="Previous review"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#E7E2D9] bg-white text-[#0F2A43] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollReviewsBy(1)}
                aria-label="Next review"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#E7E2D9] bg-white text-[#0F2A43] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={reviewsTrackRef}
            className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2"
          >
            {REVIEWS.map((review) => (
              <article
                key={review.id}
                className="snap-start shrink-0 w-[88%] sm:w-[460px] rounded-[16px] bg-white border border-[#E7E2D9] p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="font-serif text-4xl leading-none text-[#C8963E]"
                    >
                      “
                    </span>
                    <div
                      className="flex items-center gap-1 text-[#C8963E]"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[#C8963E] text-[#C8963E]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-base leading-[1.65] text-[#1B1F24]">{review.quote}</p>
                </div>

                <div className="pt-4 border-t border-[#E7E2D9] text-sm">
                  <p className="font-medium text-[#0F2A43]">{review.guestName}</p>
                  <p className="text-xs text-[#5B6470] mt-0.5">
                    {review.occasion} · {review.source}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ENQUIRY FORM */}
      <EnquirySection id="enquiry" />

      {/* 9. LOCATION */}
      <section aria-labelledby="location-heading" className="py-14 md:py-24 bg-white border-t border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <SectionEyebrow>Arrivals &amp; Connectivity</SectionEyebrow>
              <h2 id="location-heading" className="type-h2 text-[#0F2A43]">
                Along Fateh Sagar Promenade, {SITE.city}
              </h2>
              <p className="text-sm text-[#5B6470]">{SITE.fullAddress}</p>
            </div>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#0F2A43] px-5 text-sm font-medium text-[#0F2A43] hover:bg-[#0F2A43] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Open in Maps</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SITE.landmarks.map((landmark) => (
              <div
                key={landmark.name}
                className="rounded-[12px] bg-[#FAF7F2] border border-[#E7E2D9] p-4 flex flex-col justify-between gap-2"
              >
                <span className="text-sm font-medium text-[#0F2A43]">{landmark.name}</span>
                <div className="text-xs text-[#5B6470] tabular-nums">
                  <span className="font-semibold text-[#1B1F24]">{landmark.travelTime}</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span>{landmark.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
