import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { DateRangePicker } from '../components/DateRangePicker';
import { MediaImage } from '../components/MediaImage';
import { ROOMS } from '../data/rooms';
import { SITE } from '../data/site';
import {
  addDays,
  buildMockBookedInventory,
  diffNights,
  formatDisplayDate,
  formatINR,
  getHotelSoldOutDates,
  getTodayLocalDateStr,
  RATE_PLANS,
  validateGuestDetails,
  validateSearchParams,
  type GuestDetailsInput,
  type RatePlanId,
} from '../lib/booking';
import { usePageMeta } from '../lib/seo';
import { bookingApi, type AvailabilitySearchResponse } from '../services/api';

const DRAFT_STORAGE_KEY = 'rajvansh_booking_draft';

interface BookingDraft {
  step: 1 | 2 | 3;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  selectedRoomId: string;
  ratePlan: RatePlanId;
  guest: GuestDetailsInput;
}

function getDefaultDraft(searchParams: URLSearchParams): BookingDraft {
  const today = getTodayLocalDateStr();
  let stored: Partial<BookingDraft> | null = null;
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) stored = JSON.parse(raw) as Partial<BookingDraft>;
  } catch {
    stored = null;
  }

  const paramCheckIn = searchParams.get('checkIn');
  const paramCheckOut = searchParams.get('checkOut');
  const paramAdults = searchParams.get('adults');
  const paramRooms = searchParams.get('rooms');
  const paramRoomId = searchParams.get('room');

  const checkIn = paramCheckIn ?? stored?.checkIn ?? addDays(today, 1);
  const checkOut = paramCheckOut ?? stored?.checkOut ?? addDays(today, 3);
  const adults = paramAdults ? Number(paramAdults) : stored?.adults ?? 2;
  const rooms = paramRooms ? Number(paramRooms) : stored?.rooms ?? 1;

  return {
    step: paramCheckIn && paramCheckOut ? 2 : stored?.step ?? 1,
    checkIn,
    checkOut,
    adults: Number.isFinite(adults) && adults >= 1 ? adults : 2,
    children: stored?.children ?? 0,
    rooms: Number.isFinite(rooms) && rooms >= 1 ? rooms : 1,
    selectedRoomId: paramRoomId ?? stored?.selectedRoomId ?? ROOMS[0].id,
    ratePlan: stored?.ratePlan ?? 'flexible',
    guest: stored?.guest ?? {
      fullName: '',
      email: '',
      phone: '',
      specialRequests: '',
      acceptedTerms: false,
    },
  };
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  usePageMeta({
    title: `Reserve Your Stay — ${SITE.hotelName}, ${SITE.city}`,
    description:
      'Check live suite availability, compare flexible and breakfast-inclusive rates with transparent GST breakdown, and reserve online.',
  });

  const today = getTodayLocalDateStr();
  const [draft, setDraft] = useState<BookingDraft>(() => getDefaultDraft(searchParams));

  const [searchErrors, setSearchErrors] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySearchResponse | null>(null);

  const [guestErrors, setGuestErrors] = useState<
    Partial<Record<keyof GuestDetailsInput, string>>
  >({});
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const soldOutDates = useMemo(() => {
    const inventory = buildMockBookedInventory(today);
    return getHotelSoldOutDates(ROOMS, inventory, today, 90);
  }, [today]);

  // Persist draft in sessionStorage (wrapped in try/catch)
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage failures
    }
  }, [draft]);

  // Load availability automatically when entering Step 2 or Step 3
  useEffect(() => {
    if (draft.step < 2) return;
    const validation = validateSearchParams({
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      adults: draft.adults,
      children: draft.children,
      rooms: draft.rooms,
      today,
    });
    if (!validation.valid) {
      setDraft((prev) => ({ ...prev, step: 1 }));
      setSearchErrors(validation.errors);
      return;
    }

    let cancelled = false;
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    bookingApi
      .searchAvailability({
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        adults: draft.adults,
        children: draft.children,
        rooms: draft.rooms,
      })
      .then((res) => {
        if (!cancelled) setAvailability(res);
      })
      .catch(() => {
        if (!cancelled) {
          setAvailabilityError('Could not load suite availability. Please retry.');
        }
      })
      .finally(() => {
        if (!cancelled) setAvailabilityLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [draft.step, draft.checkIn, draft.checkOut, draft.adults, draft.children, draft.rooms, today]);

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateSearchParams({
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      adults: draft.adults,
      children: draft.children,
      rooms: draft.rooms,
      today,
    });
    if (!validation.valid) {
      setSearchErrors(validation.errors);
      return;
    }
    setSearchErrors({});
    setDraft((prev) => ({ ...prev, step: 2 }));
  };

  const selectedOffer = useMemo(() => {
    return availability?.offers.find((o) => o.room.id === draft.selectedRoomId) ?? null;
  }, [availability, draft.selectedRoomId]);

  const selectedPricing = selectedOffer ? selectedOffer.pricingByPlan[draft.ratePlan] : null;
  const selectedPlanMeta =
    RATE_PLANS.find((p) => p.id === draft.ratePlan) ?? RATE_PLANS[0];

  const handleConfirmBooking = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateGuestDetails(draft.guest);
    if (!validation.valid) {
      setGuestErrors(validation.errors);
      return;
    }
    if (!selectedOffer || !selectedOffer.available) {
      setSubmitError('Please return to Step 2 and select an available suite.');
      return;
    }

    setGuestErrors({});
    setSubmittingBooking(true);
    try {
      const confirmed = await bookingApi.createBooking({
        roomId: draft.selectedRoomId,
        ratePlan: draft.ratePlan,
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        adults: draft.adults,
        children: draft.children,
        rooms: draft.rooms,
        guest: draft.guest,
      });
      try {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore
      }
      navigate('/booking/confirmed', { state: { booking: confirmed } });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to complete reservation. Please try again.'
      );
    } finally {
      setSubmittingBooking(false);
    }
  };

  const nightsCount = Math.max(0, diffNights(draft.checkIn, draft.checkOut));

  return (
    <div className="page-fade pt-16 md:pt-[72px] pb-20">
      {/* Header & Step Progress */}
      <section className="py-10 md:py-14 border-b border-[#E7E2D9] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-6">
          <SectionEyebrow>Direct Reservations</SectionEyebrow>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="type-h1 text-[#0F2A43]">Reserve Your Stay</h1>

            <nav aria-label="Booking progress" className="flex flex-wrap items-center gap-3">
              {[
                { num: 1 as const, label: '1. Dates & Guests' },
                { num: 2 as const, label: '2. Choose Suite' },
                { num: 3 as const, label: '3. Guest Details' },
              ].map((s) => {
                const active = draft.step === s.num;
                const completed = draft.step > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    disabled={s.num > draft.step}
                    onClick={() => setDraft((prev) => ({ ...prev, step: s.num }))}
                    aria-current={active ? 'step' : undefined}
                    className={`h-10 px-4 rounded-[12px] text-sm font-medium border transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#0F2A43] text-white border-[#0F2A43]'
                        : completed
                        ? 'bg-[#FAF7F2] text-[#0F2A43] border-[#C8963E] cursor-pointer'
                        : 'bg-transparent text-[#5B6470] border-[#E7E2D9] opacity-60'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          {/* STEP 1: SEARCH DATES & GUESTS */}
          {draft.step === 1 && (
            <form onSubmit={handleStep1Submit} noValidate className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                  <DateRangePicker
                    checkIn={draft.checkIn}
                    checkOut={draft.checkOut}
                    soldOutDates={soldOutDates}
                    onChange={(nextIn, nextOut) => {
                      setSearchErrors({});
                      setDraft((prev) => ({ ...prev, checkIn: nextIn, checkOut: nextOut }));
                    }}
                  />
                </div>

                <div className="lg:col-span-4 rounded-[16px] bg-white border border-[#E7E2D9] p-6 space-y-5 shadow-sm">
                  <h2 className="type-h3 text-[#0F2A43]">Stay Summary</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="bk-checkin"
                        className="block text-xs font-medium text-[#5B6470] mb-1"
                      >
                        Check-in
                      </label>
                      <input
                        id="bk-checkin"
                        type="date"
                        min={today}
                        value={draft.checkIn}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, checkIn: e.target.value }))
                        }
                        aria-invalid={Boolean(searchErrors.checkIn)}
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] px-3 text-sm text-[#1B1F24]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bk-checkout"
                        className="block text-xs font-medium text-[#5B6470] mb-1"
                      >
                        Check-out
                      </label>
                      <input
                        id="bk-checkout"
                        type="date"
                        min={addDays(draft.checkIn, 1)}
                        value={draft.checkOut}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, checkOut: e.target.value }))
                        }
                        aria-invalid={Boolean(searchErrors.checkOut)}
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] px-3 text-sm text-[#1B1F24]"
                      />
                    </div>
                  </div>

                  {searchErrors.checkIn && (
                    <p role="alert" className="text-xs text-[#C0392B]">
                      {searchErrors.checkIn}
                    </p>
                  )}
                  {searchErrors.checkOut && (
                    <p role="alert" className="text-xs text-[#C0392B]">
                      {searchErrors.checkOut}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label
                        htmlFor="bk-adults"
                        className="block text-xs font-medium text-[#5B6470] mb-1"
                      >
                        Adults
                      </label>
                      <select
                        id="bk-adults"
                        value={draft.adults}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, adults: Number(e.target.value) }))
                        }
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] px-3 text-sm text-[#1B1F24]"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="bk-children"
                        className="block text-xs font-medium text-[#5B6470] mb-1"
                      >
                        Children
                      </label>
                      <select
                        id="bk-children"
                        value={draft.children}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, children: Number(e.target.value) }))
                        }
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] px-3 text-sm text-[#1B1F24]"
                      >
                        {[0, 1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="bk-rooms"
                        className="block text-xs font-medium text-[#5B6470] mb-1"
                      >
                        Rooms
                      </label>
                      <select
                        id="bk-rooms"
                        value={draft.rooms}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, rooms: Number(e.target.value) }))
                        }
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] px-3 text-sm text-[#1B1F24]"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {searchErrors.guests && (
                    <p role="alert" className="text-xs text-[#C0392B]">
                      {searchErrors.guests}
                    </p>
                  )}

                  <div className="pt-3 border-t border-[#E7E2D9] flex items-center justify-between text-sm tabular-nums">
                    <span className="text-[#5B6470]">Duration</span>
                    <span className="font-medium text-[#0F2A43]">
                      {nightsCount > 0 ? `${nightsCount} night${nightsCount > 1 ? 's' : ''}` : '—'}
                    </span>
                  </div>

                  <ActionButton
                    type="submit"
                    variant="gold"
                    label="Search Available Suites"
                    showArrow
                    fullWidth
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: CHOOSE ROOM & RATE PLAN */}
          {draft.step === 2 && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-white border border-[#E7E2D9] p-4 md:p-5">
                <div className="text-sm text-[#1B1F24] tabular-nums">
                  <strong className="text-[#0F2A43]">
                    {formatDisplayDate(draft.checkIn)} → {formatDisplayDate(draft.checkOut)}
                  </strong>
                  <span className="mx-2 text-[#5B6470]" aria-hidden="true">·</span>
                  <span>
                    {nightsCount} night{nightsCount > 1 ? 's' : ''}
                  </span>
                  <span className="mx-2 text-[#5B6470]" aria-hidden="true">·</span>
                  <span>
                    {draft.adults} Adults{draft.children > 0 ? `, ${draft.children} Children` : ''} ·{' '}
                    {draft.rooms} Room{draft.rooms > 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, step: 1 }))}
                  className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#E7E2D9] px-4 text-sm font-medium text-[#0F2A43] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Modify Dates</span>
                </button>
              </div>

              {availabilityLoading && (
                <div className="space-y-6" aria-busy="true" aria-label="Loading suite availability">
                  {[1, 2, 3].map((k) => (
                    <div
                      key={k}
                      className="h-56 rounded-[16px] bg-white border border-[#E7E2D9] animate-pulse"
                    />
                  ))}
                </div>
              )}

              {availabilityError && (
                <div
                  role="alert"
                  className="rounded-[16px] bg-white border border-[#C0392B]/40 p-6 space-y-4"
                >
                  <p className="text-base text-[#C0392B] font-medium">{availabilityError}</p>
                  <ActionButton
                    variant="primary"
                    label="Retry Search"
                    onClick={() => setDraft((prev) => ({ ...prev, step: 1 }))}
                  />
                </div>
              )}

              {!availabilityLoading &&
                !availabilityError &&
                availability &&
                availability.offers.every((o) => !o.available) && (
                  <div className="rounded-[16px] bg-white border border-[#E7E2D9] p-8 text-center space-y-4">
                    <h2 className="type-h3 text-[#0F2A43]">
                      Selected Dates Are Fully Reserved
                    </h2>
                    <p className="text-base text-[#5B6470] max-w-[54ch] mx-auto">
                      All twenty-eight suites are reserved for at least one night in your selected
                      window. Try shifting dates by one day or enquire directly for waitlist
                      priority.
                    </p>
                    <ActionButton
                      variant="primary"
                      label="Choose Different Dates"
                      onClick={() => setDraft((prev) => ({ ...prev, step: 1 }))}
                    />
                  </div>
                )}

              {!availabilityLoading && !availabilityError && availability && (
                <div className="space-y-6">
                  {availability.offers.map((offer) => {
                    const isSelectedRoom = draft.selectedRoomId === offer.room.id;
                    const activePlanPricing = offer.pricingByPlan[draft.ratePlan];
                    const gstPercent = Math.round(activePlanPricing.gstRate * 100);

                    return (
                      <article
                        key={offer.room.id}
                        className={`rounded-[16px] bg-white border p-5 md:p-6 shadow-sm transition-colors ${
                          isSelectedRoom && offer.available
                            ? 'border-[#0F2A43] ring-1 ring-[#0F2A43]'
                            : 'border-[#E7E2D9]'
                        }`}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          <div className="lg:col-span-4 overflow-hidden rounded-[12px]">
                            <MediaImage
                              asset={offer.room.image}
                              sizes="(max-width: 1024px) 100vw, 360px"
                              className="w-full aspect-[4/3] object-cover"
                            />
                          </div>

                          <div className="lg:col-span-8 space-y-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="space-y-1.5">
                                <p className="text-xs text-[#8C6421] font-medium uppercase tracking-[0.12em]">
                                  {offer.room.categoryLabel} · {offer.room.sizeSqFt} sq ft ·{' '}
                                  {offer.room.view}
                                </p>
                                <h2 className="type-h3 text-[#0F2A43]">{offer.room.name}</h2>
                                <p className="text-sm text-[#5B6470]">{offer.room.tagline}</p>
                              </div>

                              {offer.available ? (
                                <span className="text-xs font-medium text-[#2E7D5B] tabular-nums">
                                  {offer.remainingRooms} suite{offer.remainingRooms > 1 ? 's' : ''}{' '}
                                  available
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-[#C0392B]">
                                  Sold out on selected dates
                                </span>
                              )}
                            </div>

                            {/* Amenities snippet */}
                            <p className="text-xs text-[#5B6470]">
                              {offer.room.amenities.slice(0, 4).join(' · ')}
                            </p>

                            {/* Rate Plan Selector */}
                            {offer.available && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {RATE_PLANS.map((plan) => {
                                  const pricing = offer.pricingByPlan[plan.id];
                                  const chosen =
                                    isSelectedRoom && draft.ratePlan === plan.id;
                                  return (
                                    <button
                                      key={plan.id}
                                      type="button"
                                      onClick={() =>
                                        setDraft((prev) => ({
                                          ...prev,
                                          selectedRoomId: offer.room.id,
                                          ratePlan: plan.id,
                                        }))
                                      }
                                      aria-pressed={chosen}
                                      className={`text-left rounded-[12px] border p-3.5 transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                                        chosen
                                          ? 'border-[#0F2A43] bg-[#FAF7F2]'
                                          : 'border-[#E7E2D9] hover:border-[#0F2A43]/50'
                                      }`}
                                    >
                                      <div>
                                        <p className="text-sm font-semibold text-[#0F2A43]">
                                          {plan.name}
                                        </p>
                                        <p className="text-xs text-[#5B6470] mt-0.5">
                                          {plan.shortTag}
                                        </p>
                                      </div>
                                      <div className="pt-2 border-t border-[#E7E2D9]/80 tabular-nums">
                                        <span className="font-serif text-lg font-medium text-[#0F2A43]">
                                          {formatINR(pricing.effectiveNightlyPerRoom)}
                                        </span>
                                        <span className="text-xs text-[#5B6470]"> / night</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Price Breakdown + Proceed */}
                            {offer.available && (
                              <div className="pt-4 border-t border-[#E7E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="text-xs text-[#5B6470] space-y-0.5 tabular-nums">
                                  <p>
                                    Room subtotal ({draft.rooms} × {availability.nights} night
                                    {availability.nights > 1 ? 's' : ''}):{' '}
                                    <strong className="text-[#1B1F24]">
                                      {formatINR(activePlanPricing.roomSubtotal)}
                                    </strong>
                                  </p>
                                  <p>
                                    GST ({gstPercent}% slab):{' '}
                                    <strong className="text-[#1B1F24]">
                                      {formatINR(activePlanPricing.gstAmount)}
                                    </strong>
                                    <span className="mx-2" aria-hidden="true">·</span>
                                    Total:{' '}
                                    <strong className="text-[#0F2A43] text-sm">
                                      {formatINR(activePlanPricing.totalAmount)}
                                    </strong>
                                  </p>
                                </div>

                                <ActionButton
                                  variant={isSelectedRoom ? 'gold' : 'primary'}
                                  label="Select & Continue"
                                  showArrow
                                  onClick={() =>
                                    setDraft((prev) => ({
                                      ...prev,
                                      selectedRoomId: offer.room.id,
                                      step: 3,
                                    }))
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: GUEST DETAILS & CONFIRM */}
          {draft.step === 3 && selectedOffer && selectedPricing && (
            <form
              onSubmit={handleConfirmBooking}
              noValidate
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-7 rounded-[16px] bg-white border border-[#E7E2D9] p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E7E2D9]">
                  <h2 className="type-h3 text-[#0F2A43]">Guest Information</h2>
                  <button
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, step: 2 }))}
                    className="text-sm font-medium text-[#0F2A43] underline underline-offset-4 cursor-pointer"
                  >
                    Change Suite
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                    >
                      Primary Guest Full Name *
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      value={draft.guest.fullName}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          guest: { ...prev.guest, fullName: e.target.value },
                        }))
                      }
                      aria-invalid={Boolean(guestErrors.fullName)}
                      aria-describedby={guestErrors.fullName ? 'guest-name-err' : undefined}
                      placeholder="As per government photo ID"
                      className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-4 text-base text-[#1B1F24]"
                    />
                    {guestErrors.fullName && (
                      <p id="guest-name-err" className="mt-1.5 text-xs text-[#C0392B]">
                        {guestErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="guest-email"
                        className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="guest-email"
                        type="email"
                        value={draft.guest.email}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            guest: { ...prev.guest, email: e.target.value },
                          }))
                        }
                        aria-invalid={Boolean(guestErrors.email)}
                        aria-describedby={guestErrors.email ? 'guest-email-err' : undefined}
                        placeholder="you@domain.com"
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-4 text-base text-[#1B1F24]"
                      />
                      {guestErrors.email && (
                        <p id="guest-email-err" className="mt-1.5 text-xs text-[#C0392B]">
                          {guestErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="guest-phone"
                        className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                      >
                        Mobile Number *
                      </label>
                      <input
                        id="guest-phone"
                        type="tel"
                        value={draft.guest.phone}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            guest: { ...prev.guest, phone: e.target.value },
                          }))
                        }
                        aria-invalid={Boolean(guestErrors.phone)}
                        aria-describedby={guestErrors.phone ? 'guest-phone-err' : undefined}
                        placeholder="+91 98200 11223"
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-4 text-base text-[#1B1F24]"
                      />
                      {guestErrors.phone && (
                        <p id="guest-phone-err" className="mt-1.5 text-xs text-[#C0392B]">
                          {guestErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="guest-requests"
                      className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                    >
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="guest-requests"
                      rows={3}
                      value={draft.guest.specialRequests}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          guest: { ...prev.guest, specialRequests: e.target.value },
                        }))
                      }
                      placeholder="Airport pickup time, dietary preferences, quiet courtyard wing, baby cot..."
                      className="w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 p-4 text-base text-[#1B1F24]"
                    />
                  </div>

                  <div className="rounded-[12px] bg-[#FAF7F2] border border-[#E7E2D9] p-4 space-y-2 text-sm">
                    <p className="font-medium text-[#0F2A43]">Cancellation Policy</p>
                    <p className="text-[#5B6470]">{selectedPlanMeta.cancellationSummary}</p>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer text-sm text-[#1B1F24]">
                      <input
                        type="checkbox"
                        checked={draft.guest.acceptedTerms}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            guest: { ...prev.guest, acceptedTerms: e.target.checked },
                          }))
                        }
                        aria-invalid={Boolean(guestErrors.acceptedTerms)}
                        className="mt-1 h-4 w-4 accent-[#0F2A43]"
                      />
                      <span>
                        I agree to the reservation terms, check-in policy ({SITE.checkInTime}), and
                        applicable cancellation policy for {selectedPlanMeta.name}.
                      </span>
                    </label>
                    {guestErrors.acceptedTerms && (
                      <p className="mt-1.5 text-xs text-[#C0392B]">
                        {guestErrors.acceptedTerms}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p role="alert" className="text-sm text-[#C0392B]">
                      {submitError}
                    </p>
                  )}

                  <ActionButton
                    type="submit"
                    variant="gold"
                    label={submittingBooking ? 'Confirming Reservation...' : 'Confirm Reservation'}
                    showArrow={!submittingBooking}
                    fullWidth
                    disabled={submittingBooking}
                  />
                </div>
              </div>

              {/* Right Column: Price Summary */}
              <aside className="lg:col-span-5 rounded-[16px] bg-white border border-[#E7E2D9] p-6 md:p-8 shadow-sm space-y-5">
                <h2 className="type-h3 text-[#0F2A43]">Reservation Summary</h2>

                <div className="overflow-hidden rounded-[12px]">
                  <MediaImage
                    asset={selectedOffer.room.image}
                    sizes="420px"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <p className="font-serif text-xl text-[#0F2A43]">{selectedOffer.room.name}</p>
                  <p className="text-sm text-[#5B6470]">{selectedPlanMeta.name}</p>
                </div>

                <dl className="space-y-3 pt-4 border-t border-[#E7E2D9] text-sm tabular-nums">
                  <div className="flex justify-between">
                    <dt className="text-[#5B6470]">Check-in</dt>
                    <dd className="font-medium text-[#1B1F24]">
                      {formatDisplayDate(draft.checkIn)} ({SITE.checkInTime})
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5B6470]">Check-out</dt>
                    <dd className="font-medium text-[#1B1F24]">
                      {formatDisplayDate(draft.checkOut)} ({SITE.checkOutTime})
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5B6470]">Occupancy</dt>
                    <dd className="font-medium text-[#1B1F24]">
                      {draft.rooms} Room{draft.rooms > 1 ? 's' : ''} · {draft.adults} Adults
                      {draft.children > 0 ? `, ${draft.children} Children` : ''}
                    </dd>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#E7E2D9]">
                    <dt className="text-[#5B6470]">
                      {formatINR(selectedPricing.effectiveNightlyPerRoom)} × {selectedPricing.nights}{' '}
                      nights × {selectedPricing.roomCount} room
                    </dt>
                    <dd className="font-medium text-[#1B1F24]">
                      {formatINR(selectedPricing.roomSubtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5B6470]">
                      Taxes (GST {Math.round(selectedPricing.gstRate * 100)}%)
                    </dt>
                    <dd className="font-medium text-[#1B1F24]">
                      {formatINR(selectedPricing.gstAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#E7E2D9] text-base">
                    <dt className="font-semibold text-[#0F2A43]">Total Payable</dt>
                    <dd className="font-serif text-2xl font-semibold text-[#0F2A43]">
                      {formatINR(selectedPricing.totalAmount)}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-start gap-2.5 text-xs text-[#2E7D5B] pt-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Direct best-rate assurance · Pay at hotel or via concierge link.</span>
                </div>
                {draft.ratePlan === 'breakfast' && (
                  <div className="flex items-start gap-2.5 text-xs text-[#5B6470]">
                    <Check className="h-4 w-4 text-[#2E7D5B] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Includes daily Darbar Courtyard breakfast for two per room.</span>
                  </div>
                )}
              </aside>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
