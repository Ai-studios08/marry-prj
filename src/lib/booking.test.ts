import { describe, expect, it } from 'vitest';
import {
  addDays,
  buildMockBookedInventory,
  calculateStayPricing,
  checkRoomAvailability,
  diffNights,
  formatINR,
  formatINRNumber,
  generateBookingIcs,
  getGstRateForNightlyTariff,
  getHotelSoldOutDates,
  parseLocalDate,
  validateEnquiryForm,
  validateGuestDetails,
  validateSearchParams,
} from './booking';

describe('Local calendar date helpers', () => {
  it('parses valid local calendar dates without UTC off-by-one drift', () => {
    const dt = parseLocalDate('2026-11-15');
    expect(dt).not.toBeNull();
    expect(dt?.getFullYear()).toBe(2026);
    expect(dt?.getMonth()).toBe(10); // November is 0-indexed 10
    expect(dt?.getDate()).toBe(15);
  });

  it('rejects impossible calendar dates like Feb 30', () => {
    expect(parseLocalDate('2026-02-30')).toBeNull();
    expect(parseLocalDate('not-a-date')).toBeNull();
  });

  it('computes exact night difference and adds days cleanly across month boundaries', () => {
    expect(addDays('2026-11-29', 3)).toBe('2026-12-02');
    expect(diffNights('2026-11-29', '2026-12-02')).toBe(3);
    expect(diffNights('2026-12-02', '2026-11-29')).toBe(-3);
  });
});

describe('Search validation', () => {
  const today = '2026-11-12';

  it('rejects past check-in dates and inverted check-out dates', () => {
    const pastResult = validateSearchParams({
      checkIn: '2026-11-10',
      checkOut: '2026-11-13',
      adults: 2,
      children: 0,
      rooms: 1,
      today,
    });
    expect(pastResult.valid).toBe(false);
    expect(pastResult.errors.checkIn).toBeTruthy();

    const sameDayResult = validateSearchParams({
      checkIn: '2026-11-15',
      checkOut: '2026-11-15',
      adults: 2,
      children: 0,
      rooms: 1,
      today,
    });
    expect(sameDayResult.valid).toBe(false);
    expect(sameDayResult.errors.checkOut).toBeTruthy();
  });

  it('enforces maximum stay of 30 nights', () => {
    const overMax = validateSearchParams({
      checkIn: '2026-11-15',
      checkOut: addDays('2026-11-15', 31),
      adults: 2,
      children: 0,
      rooms: 1,
      today,
    });
    expect(overMax.valid).toBe(false);
    expect(overMax.errors.checkOut).toContain('30');

    const exactMax = validateSearchParams({
      checkIn: '2026-11-15',
      checkOut: addDays('2026-11-15', 30),
      adults: 2,
      children: 0,
      rooms: 1,
      today,
    });
    expect(exactMax.valid).toBe(true);
    expect(exactMax.nights).toBe(30);
  });
});

describe('GST tariff slabs and pricing calculation', () => {
  it('applies 12% GST strictly under ₹7,500/night and 18% GST at or above ₹7,500/night', () => {
    expect(getGstRateForNightlyTariff(6800)).toBe(0.12);
    expect(getGstRateForNightlyTariff(7499)).toBe(0.12);
    expect(getGstRateForNightlyTariff(7500)).toBe(0.18);
    expect(getGstRateForNightlyTariff(18500)).toBe(0.18);
  });

  it('calculates flexible, non-refundable (15% off), and breakfast (+₹1,400) plans accurately', () => {
    const flexLow = calculateStayPricing({
      baseNightlyRate: 6800,
      ratePlan: 'flexible',
      nights: 2,
      roomCount: 1,
    });
    expect(flexLow.roomSubtotal).toBe(13600);
    expect(flexLow.gstRate).toBe(0.12);
    expect(flexLow.gstAmount).toBe(1632);
    expect(flexLow.totalAmount).toBe(15232);

    // Adding breakfast pushes ₹6,800 -> ₹8,200/night, crossing into 18% GST slab!
    const breakfastLow = calculateStayPricing({
      baseNightlyRate: 6800,
      ratePlan: 'breakfast',
      nights: 2,
      roomCount: 1,
    });
    expect(breakfastLow.effectiveNightlyPerRoom).toBe(8200);
    expect(breakfastLow.gstRate).toBe(0.18);
    expect(breakfastLow.roomSubtotal).toBe(16400);
    expect(breakfastLow.gstAmount).toBe(2952);
    expect(breakfastLow.totalAmount).toBe(19352);

    const nonRefSuite = calculateStayPricing({
      baseNightlyRate: 18500,
      ratePlan: 'non-refundable',
      nights: 3,
      roomCount: 2,
    });
    expect(nonRefSuite.effectiveNightlyPerRoom).toBe(15725);
    expect(nonRefSuite.roomSubtotal).toBe(15725 * 3 * 2);
    expect(nonRefSuite.gstRate).toBe(0.18);
    expect(nonRefSuite.totalSavings).toBe((18500 - 15725) * 3 * 2);
  });

  it('formats INR currency with Indian digit grouping', () => {
    expect(formatINR(18500)).toContain('18,500');
    expect(formatINR(125000)).toContain('1,25,000');
    expect(formatINRNumber(6800)).toBe('6,800');
    expect(formatINRNumber(125000)).toBe('1,25,000');
  });
});

describe('Availability & sold-out dates', () => {
  const anchor = '2026-11-12';
  const inventory = buildMockBookedInventory(anchor);

  it('detects sold-out nights within a multi-night stay', () => {
    const blockedNight = addDays(anchor, 10);
    const res = checkRoomAvailability({
      roomId: 'lakeview-veranda-room',
      totalInventory: 6,
      checkIn: addDays(anchor, 9),
      checkOut: addDays(anchor, 12),
      requestedRooms: 1,
      bookedInventory: inventory,
    });
    expect(res.available).toBe(false);
    expect(res.soldOutDates).toContain(blockedNight);
    expect(res.remainingRooms).toBe(0);
  });

  it('respects requestedRooms when limited inventory remains', () => {
    const checkIn = addDays(anchor, 14);
    const singleRoom = checkRoomAvailability({
      roomId: 'palace-courtyard-room',
      totalInventory: 8,
      checkIn,
      checkOut: addDays(checkIn, 1),
      requestedRooms: 1,
      bookedInventory: inventory,
    });
    expect(singleRoom.available).toBe(true);
    expect(singleRoom.remainingRooms).toBe(1);

    const twoRooms = checkRoomAvailability({
      roomId: 'palace-courtyard-room',
      totalInventory: 8,
      checkIn,
      checkOut: addDays(checkIn, 1),
      requestedRooms: 2,
      bookedInventory: inventory,
    });
    expect(twoRooms.available).toBe(false);
  });

  it('computes property-wide sold-out dates when all room categories are exhausted', () => {
    const fakeRooms = [
      { id: 'lakeview-veranda-room', totalInventory: 6 },
      { id: 'maharana-heritage-suite', totalInventory: 5 },
    ];
    const soldOut = getHotelSoldOutDates(fakeRooms, inventory, anchor, 15);
    expect(soldOut.has(addDays(anchor, 10))).toBe(true);
    expect(soldOut.has(addDays(anchor, 1))).toBe(false);
  });
});

describe('Guest, enquiry validation & ICS generation', () => {
  it('validates guest and enquiry inputs strictly', () => {
    const badGuest = validateGuestDetails({
      fullName: 'A',
      email: 'invalid',
      phone: '123',
      specialRequests: '',
      acceptedTerms: false,
    });
    expect(badGuest.valid).toBe(false);
    expect(badGuest.errors.fullName).toBeTruthy();
    expect(badGuest.errors.email).toBeTruthy();
    expect(badGuest.errors.phone).toBeTruthy();
    expect(badGuest.errors.acceptedTerms).toBeTruthy();

    const badEnquiry = validateEnquiryForm(
      {
        name: 'Meera',
        email: 'meera@example.com',
        phone: '+91 98200 11223',
        eventDate: '2026-11-01',
        eventType: 'Wedding Celebration',
        message: 'Too short',
      },
      '2026-11-12'
    );
    expect(badEnquiry.valid).toBe(false);
    expect(badEnquiry.errors.eventDate).toBeTruthy();
    expect(badEnquiry.errors.message).toBeTruthy();
  });

  it('generates valid VCALENDAR .ics content with date-only local entries', () => {
    const pricing = calculateStayPricing({
      baseNightlyRate: 11500,
      ratePlan: 'flexible',
      nights: 2,
      roomCount: 1,
    });
    const ics = generateBookingIcs(
      {
        reference: 'RVC-2026-102938',
        createdAtIso: '2026-11-12T10:00:00.000Z',
        roomId: 'lakeview-veranda-room',
        roomName: 'Lakeview Veranda Room',
        ratePlan: 'flexible',
        ratePlanName: 'Flexible Stay',
        cancellationSummary: 'Free cancellation up to 48h',
        checkIn: '2026-11-15',
        checkOut: '2026-11-17',
        nights: 2,
        adults: 2,
        children: 0,
        rooms: 1,
        pricing,
        guest: {
          fullName: 'Ananya Deshmukh',
          email: 'ananya@example.com',
          phone: '+91 98200 11223',
          specialRequests: 'Quiet wing',
        },
      },
      'The Rajvansh Courtyard',
      '14 Fateh Sagar Promenade, Udaipur'
    );
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261115');
    expect(ics).toContain('DTEND;VALUE=DATE:20261117');
    expect(ics).toContain('RVC-2026-102938');
  });
});
