import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarPlus, CheckCircle2, MessageCircle } from 'lucide-react';
import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { PriceDisplay } from '../components/PriceDisplay';
import { SITE } from '../data/site';
import {
  buildWhatsAppBookingUrl,
  formatDisplayDate,
  generateBookingIcs,
  type ConfirmedBooking,
} from '../lib/booking';
import { usePageMeta } from '../lib/seo';

export default function BookingConfirmedPage() {
  const location = useLocation();
  const stateBooking = (location.state as { booking?: ConfirmedBooking } | null)?.booking;

  const booking = useMemo<ConfirmedBooking | null>(() => {
    if (stateBooking) return stateBooking;
    try {
      const raw = sessionStorage.getItem('rajvansh_confirmed_booking');
      return raw ? (JSON.parse(raw) as ConfirmedBooking) : null;
    } catch {
      return null;
    }
  }, [stateBooking]);

  usePageMeta({
    title: booking
      ? `Reservation Confirmed (${booking.reference}) — ${SITE.hotelName}`
      : `Reservation Confirmation — ${SITE.hotelName}`,
    description: `Your reservation confirmation at ${SITE.hotelName}, ${SITE.city}.`,
  });

  if (!booking) {
    return (
      <div className="page-fade pt-24 pb-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 text-center space-y-5 py-16">
          <SectionEyebrow>Reservations</SectionEyebrow>
          <h1 className="type-h1 text-[#0F2A43]">No Active Confirmation Found</h1>
          <p className="text-base text-[#5B6470] max-w-[50ch] mx-auto">
            Start a new search to check live availability and receive an instant reservation
            reference.
          </p>
          <div className="pt-2">
            <ActionButton variant="primary" label="Book a Suite" showArrow to="/book" />
          </div>
        </div>
      </div>
    );
  }

  const handleDownloadIcs = () => {
    const icsContent = generateBookingIcs(booking, SITE.hotelName, SITE.fullAddress);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${booking.reference}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const whatsappShareUrl = buildWhatsAppBookingUrl(
    SITE.whatsappNumber,
    booking,
    SITE.hotelName
  );

  return (
    <div className="page-fade pt-20 md:pt-24 pb-20">
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[840px] px-4 md:px-6 space-y-8">
          <div className="rounded-[16px] bg-white border border-[#E7E2D9] p-6 md:p-10 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2E7D5B]/15 text-[#2E7D5B]">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <SectionEyebrow>Reservation Confirmed</SectionEyebrow>
                <h1 className="type-h2 text-[#0F2A43]">
                  We look forward to welcoming you, {booking.guest.fullName}.
                </h1>
                <p className="text-sm text-[#5B6470]">
                  A summary has been prepared for <strong>{booking.guest.email}</strong>.
                </p>
              </div>
            </div>

            <div className="rounded-[12px] bg-[#FAF7F2] border border-[#E7E2D9] p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="block text-xs text-[#5B6470]">Booking Reference</span>
                <span className="font-serif text-2xl font-semibold text-[#0F2A43] tabular-nums">
                  {booking.reference}
                </span>
              </div>
              <div className="text-right tabular-nums">
                <span className="block text-xs text-[#5B6470]">Total Payable (incl. GST)</span>
                <span className="font-serif text-2xl font-semibold text-[#0F2A43]">
                  <PriceDisplay amount={booking.pricing.totalAmount} />
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-[#E7E2D9] text-sm tabular-nums">
              <div>
                <dt className="text-xs text-[#5B6470]">Suite Category</dt>
                <dd className="font-medium text-[#0F2A43] mt-0.5">{booking.roomName}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#5B6470]">Rate Plan</dt>
                <dd className="font-medium text-[#0F2A43] mt-0.5">{booking.ratePlanName}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#5B6470]">Check-in</dt>
                <dd className="font-medium text-[#1B1F24] mt-0.5">
                  {formatDisplayDate(booking.checkIn)} · {SITE.checkInTime}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#5B6470]">Check-out</dt>
                <dd className="font-medium text-[#1B1F24] mt-0.5">
                  {formatDisplayDate(booking.checkOut)} · {SITE.checkOutTime}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#5B6470]">Guests &amp; Rooms</dt>
                <dd className="font-medium text-[#1B1F24] mt-0.5">
                  {booking.rooms} Room{booking.rooms > 1 ? 's' : ''} · {booking.adults} Adults
                  {booking.children > 0 ? `, ${booking.children} Children` : ''} ({booking.nights}{' '}
                  nights)
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#5B6470]">GST Breakdown</dt>
                <dd className="font-medium text-[#1B1F24] mt-0.5">
                  Subtotal <PriceDisplay amount={booking.pricing.roomSubtotal} /> +{' '}
                  {Math.round(booking.pricing.gstRate * 100)}% GST (
                  <PriceDisplay amount={booking.pricing.gstAmount} />)
                </dd>
              </div>
            </dl>

            <p className="text-xs text-[#5B6470]">{booking.cancellationSummary}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#0F2A43] text-white px-5 text-sm font-medium hover:bg-[#193b5c] transition-colors cursor-pointer whitespace-nowrap"
              >
                <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#2E7D5B] text-white px-5 text-sm font-medium hover:bg-[#25674b] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Share on WhatsApp</span>
              </a>

              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#E7E2D9] px-5 text-sm font-medium text-[#0F2A43] hover:border-[#0F2A43] transition-colors whitespace-nowrap"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
