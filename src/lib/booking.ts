export type RatePlanId = 'flexible' | 'non-refundable' | 'breakfast';

export interface RatePlanOption {
  id: RatePlanId;
  name: string;
  shortTag: string;
  cancellationSummary: string;
  description: string;
}

export const RATE_PLANS: RatePlanOption[] = [
  {
    id: 'flexible',
    name: 'Flexible Stay',
    shortTag: 'Free cancellation up to 48h',
    cancellationSummary: 'Free cancellation until 2:00 PM, 48 hours prior to arrival. One night charged thereafter.',
    description: 'Room-only tariff with full flexibility to modify or cancel up to two days before check-in.',
  },
  {
    id: 'non-refundable',
    name: 'Advance Purchase (Save 15%)',
    shortTag: '15% savings · Non-refundable',
    cancellationSummary: 'Non-refundable upon confirmation. Dates may be shifted once subject to tariff difference.',
    description: 'Preferential tariff with 15% instant savings on room nights for confirmed itineraries.',
  },
  {
    id: 'breakfast',
    name: 'Royal Breakfast Included',
    shortTag: 'Includes daily Darbar breakfast',
    cancellationSummary: 'Free cancellation until 2:00 PM, 48 hours prior to arrival. Includes daily breakfast for two.',
    description: 'Includes daily Mewari & continental breakfast for two guests per room in Darbar Courtyard.',
  },
];

export const MAX_STAY_NIGHTS = 30;
export const BREAKFAST_SUPPLEMENT_INR = 1400;
export const NON_REFUNDABLE_DISCOUNT = 0.15;

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseLocalDate(dateStr: string): Date | null {
  const match = DATE_RE.exec(dateStr.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const dt = new Date(year, month - 1, day);
  if (
    dt.getFullYear() !== year ||
    dt.getMonth() !== month - 1 ||
    dt.getDate() !== day
  ) {
    return null;
  }
  return dt;
}

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayLocalDateStr(now: Date = new Date()): string {
  return formatLocalDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function addDays(dateStr: string, days: number): string {
  const dt = parseLocalDate(dateStr);
  if (!dt) return dateStr;
  dt.setDate(dt.getDate() + days);
  return formatLocalDate(dt);
}

export function diffNights(checkIn: string, checkOut: string): number {
  const start = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);
  if (!start || !end) return 0;
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((utcEnd - utcStart) / 86400000);
}

export function formatDisplayDate(dateStr: string): string {
  const dt = parseLocalDate(dateStr);
  if (!dt) return dateStr;
  return dt.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatINRNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export interface SearchParamsInput {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  today?: string;
}

export interface SearchValidationResult {
  valid: boolean;
  nights: number;
  errors: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export function validateSearchParams(input: SearchParamsInput): SearchValidationResult {
  const today = input.today ?? getTodayLocalDateStr();
  const errors: SearchValidationResult['errors'] = {};

  const inDate = parseLocalDate(input.checkIn);
  const outDate = parseLocalDate(input.checkOut);
  const todayDate = parseLocalDate(today);

  if (!inDate) {
    errors.checkIn = 'Select a valid check-in date.';
  } else if (todayDate && input.checkIn < today) {
    errors.checkIn = 'Check-in cannot be in the past.';
  }

  let nights = 0;
  if (!outDate) {
    errors.checkOut = 'Select a valid check-out date.';
  } else if (inDate) {
    nights = diffNights(input.checkIn, input.checkOut);
    if (nights < 1) {
      errors.checkOut = 'Check-out must be at least one night after check-in.';
    } else if (nights > MAX_STAY_NIGHTS) {
      errors.checkOut = `Online reservations are capped at ${MAX_STAY_NIGHTS} nights. Please contact our desk for extended stays.`;
    }
  }

  if (input.adults < 1 || input.rooms < 1) {
    errors.guests = 'At least 1 adult and 1 room are required.';
  } else if (input.adults > input.rooms * 4) {
    errors.guests = 'Maximum 4 adults per room/residence. Please add another room.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    nights,
    errors,
  };
}

export function getGstRateForNightlyTariff(nightlyTariffInr: number): 0.12 | 0.18 {
  return nightlyTariffInr < 7500 ? 0.12 : 0.18;
}

export interface StayPricingInput {
  baseNightlyRate: number;
  ratePlan: RatePlanId;
  nights: number;
  roomCount: number;
}

export interface StayPricingBreakdown {
  baseNightlyPerRoom: number;
  effectiveNightlyPerRoom: number;
  nights: number;
  roomCount: number;
  roomSubtotal: number;
  gstRate: 0.12 | 0.18;
  gstAmount: number;
  totalAmount: number;
  savingsPerNight: number;
  totalSavings: number;
}

export function calculateStayPricing(input: StayPricingInput): StayPricingBreakdown {
  const nights = Math.max(1, Math.floor(input.nights));
  const roomCount = Math.max(1, Math.floor(input.roomCount));
  const base = Math.max(0, Math.round(input.baseNightlyRate));

  let effectiveNightlyPerRoom = base;
  let savingsPerNight = 0;

  if (input.ratePlan === 'non-refundable') {
    effectiveNightlyPerRoom = Math.round(base * (1 - NON_REFUNDABLE_DISCOUNT));
    savingsPerNight = base - effectiveNightlyPerRoom;
  } else if (input.ratePlan === 'breakfast') {
    effectiveNightlyPerRoom = base + BREAKFAST_SUPPLEMENT_INR;
  }

  const roomSubtotal = effectiveNightlyPerRoom * nights * roomCount;
  const gstRate = getGstRateForNightlyTariff(effectiveNightlyPerRoom);
  const gstAmount = Math.round(roomSubtotal * gstRate);
  const totalAmount = roomSubtotal + gstAmount;

  return {
    baseNightlyPerRoom: base,
    effectiveNightlyPerRoom,
    nights,
    roomCount,
    roomSubtotal,
    gstRate,
    gstAmount,
    totalAmount,
    savingsPerNight,
    totalSavings: savingsPerNight * nights * roomCount,
  };
}

export type InventoryMap = Record<string, Record<string, number>>;

/**
 * Generates deterministic mock sold-out & limited dates relative to a base anchor date
 * so availability testing and the calendar UI reflect realistic demand spikes.
 */
export function buildMockBookedInventory(anchorDateStr: string): InventoryMap {
  return {
    'palace-courtyard-room': {
      [addDays(anchorDateStr, 6)]: 8, // sold out
      [addDays(anchorDateStr, 7)]: 8,
      [addDays(anchorDateStr, 14)]: 7, // only 1 left
    },
    'lakeview-veranda-room': {
      [addDays(anchorDateStr, 10)]: 6, // sold out
      [addDays(anchorDateStr, 11)]: 6,
      [addDays(anchorDateStr, 18)]: 5,
    },
    'maharana-heritage-suite': {
      [addDays(anchorDateStr, 10)]: 5,
      [addDays(anchorDateStr, 11)]: 5,
      [addDays(anchorDateStr, 21)]: 4,
    },
    'garden-plunge-pavilion': {
      [addDays(anchorDateStr, 5)]: 4, // sold out
      [addDays(anchorDateStr, 10)]: 4,
      [addDays(anchorDateStr, 11)]: 4,
    },
    'rajvansh-royal-residence': {
      [addDays(anchorDateStr, 10)]: 2, // sold out
      [addDays(anchorDateStr, 11)]: 2,
      [addDays(anchorDateStr, 15)]: 2,
    },
  };
}

export interface RoomAvailabilityInput {
  roomId: string;
  totalInventory: number;
  checkIn: string;
  checkOut: string;
  requestedRooms: number;
  bookedInventory: InventoryMap;
}

export interface RoomAvailabilityResult {
  available: boolean;
  remainingRooms: number;
  soldOutDates: string[];
}

export function checkRoomAvailability(input: RoomAvailabilityInput): RoomAvailabilityResult {
  const nights = diffNights(input.checkIn, input.checkOut);
  if (nights <= 0) {
    return { available: false, remainingRooms: 0, soldOutDates: [] };
  }

  const roomBooked = input.bookedInventory[input.roomId] ?? {};
  let minRemaining = input.totalInventory;
  const soldOutDates: string[] = [];

  for (let i = 0; i < nights; i++) {
    const nightStr = addDays(input.checkIn, i);
    const bookedCount = roomBooked[nightStr] ?? 0;
    const remaining = Math.max(0, input.totalInventory - bookedCount);
    if (remaining < minRemaining) {
      minRemaining = remaining;
    }
    if (remaining < input.requestedRooms) {
      soldOutDates.push(nightStr);
    }
  }

  return {
    available: soldOutDates.length === 0 && minRemaining >= input.requestedRooms,
    remainingRooms: minRemaining,
    soldOutDates,
  };
}

export function getHotelSoldOutDates(
  rooms: { id: string; totalInventory: number }[],
  bookedInventory: InventoryMap,
  windowStart: string,
  daysCount: number = 90
): Set<string> {
  const fullySoldOut = new Set<string>();
  for (let i = 0; i < daysCount; i++) {
    const dayStr = addDays(windowStart, i);
    const anyAvailable = rooms.some((room) => {
      const booked = bookedInventory[room.id]?.[dayStr] ?? 0;
      return room.totalInventory - booked > 0;
    });
    if (!anyAvailable) {
      fullySoldOut.add(dayStr);
    }
  }
  return fullySoldOut;
}

export interface GuestDetailsInput {
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
  acceptedTerms: boolean;
}

export interface GuestValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof GuestDetailsInput, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{7,18}$/;

export function validateGuestDetails(input: GuestDetailsInput): GuestValidationResult {
  const errors: GuestValidationResult['errors'] = {};
  if (input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter the primary guest’s full name.';
  }
  if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = 'Enter a valid email address for your confirmation voucher.';
  }
  if (!PHONE_RE.test(input.phone.trim())) {
    errors.phone = 'Enter a valid mobile or telephone number with country/area code.';
  }
  if (!input.acceptedTerms) {
    errors.acceptedTerms = 'Please accept the booking and cancellation terms to proceed.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface EnquiryFormInput {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  message: string;
}

export function validateEnquiryForm(
  input: EnquiryFormInput,
  today: string = getTodayLocalDateStr()
): { valid: boolean; errors: Partial<Record<keyof EnquiryFormInput, string>> } {
  const errors: Partial<Record<keyof EnquiryFormInput, string>> = {};
  if (input.name.trim().length < 2) {
    errors.name = 'Please share your full name.';
  }
  if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }
  if (!PHONE_RE.test(input.phone.trim())) {
    errors.phone = 'Please provide a valid contact number.';
  }
  if (input.eventDate.trim()) {
    const parsed = parseLocalDate(input.eventDate);
    if (!parsed) {
      errors.eventDate = 'Please select a valid date.';
    } else if (input.eventDate < today) {
      errors.eventDate = 'Event date cannot be in the past.';
    }
  }
  if (!input.eventType.trim()) {
    errors.eventType = 'Select an enquiry category.';
  }
  if (input.message.trim().length < 10) {
    errors.message = 'Please share a brief note about your dates or guest count (at least 10 characters).';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface ConfirmedBooking {
  reference: string;
  createdAtIso: string;
  roomId: string;
  roomName: string;
  ratePlan: RatePlanId;
  ratePlanName: string;
  cancellationSummary: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  pricing: StayPricingBreakdown;
  guest: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests: string;
  };
}

export function generateBookingReference(seedStr: string): string {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) % 900000;
  }
  const code = String(100000 + Math.abs(hash)).slice(0, 6);
  const year = new Date().getFullYear();
  return `RVC-${year}-${code}`;
}

export function generateBookingIcs(
  booking: ConfirmedBooking,
  hotelName: string,
  hotelAddress: string
): string {
  const dtStart = booking.checkIn.replace(/-/g, '');
  const dtEnd = booking.checkOut.replace(/-/g, '');
  const uid = `${booking.reference}@rajvanshcourtyard.example`;
  const summary = `Stay at ${hotelName} — ${booking.roomName}`;
  const description = [
    `Booking Reference: ${booking.reference}`,
    `Suite: ${booking.roomName} (${booking.rooms} room${booking.rooms > 1 ? 's' : ''})`,
    `Plan: ${booking.ratePlanName}`,
    `Guests: ${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}`,
    `Total Payable: ${formatINR(booking.pricing.totalAmount)}`,
    `Check-in: 2:00 PM | Check-out: 12:00 PM`,
  ].join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Rajvansh Courtyard//Reservations//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `LOCATION:${hotelAddress}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function buildWhatsAppBookingUrl(
  whatsappNumber: string,
  booking: ConfirmedBooking,
  hotelName: string
): string {
  const message = [
    `Reservation Confirmed at ${hotelName}`,
    `Reference: ${booking.reference}`,
    `Guest: ${booking.guest.fullName}`,
    `Suite: ${booking.roomName} (${booking.rooms} room${booking.rooms > 1 ? 's' : ''})`,
    `Dates: ${formatDisplayDate(booking.checkIn)} to ${formatDisplayDate(booking.checkOut)} (${booking.nights} nights)`,
    `Plan: ${booking.ratePlanName}`,
    `Total (incl. GST): ${formatINR(booking.pricing.totalAmount)}`,
  ].join('\n');
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
