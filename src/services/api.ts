import { ROOMS, type RoomCategory } from '../data/rooms';
import {
  buildMockBookedInventory,
  calculateStayPricing,
  checkRoomAvailability,
  diffNights,
  generateBookingReference,
  getTodayLocalDateStr,
  RATE_PLANS,
  type ConfirmedBooking,
  type EnquiryFormInput,
  type GuestDetailsInput,
  type RatePlanId,
  type StayPricingBreakdown,
} from '../lib/booking';

export interface RoomSearchOffer {
  room: RoomCategory;
  available: boolean;
  remainingRooms: number;
  soldOutDates: string[];
  capacityMet: boolean;
  pricingByPlan: Record<RatePlanId, StayPricingBreakdown>;
}

export interface AvailabilitySearchResponse {
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomsRequested: number;
  offers: RoomSearchOffer[];
}

export interface CreateBookingRequest {
  roomId: string;
  ratePlan: RatePlanId;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  guest: GuestDetailsInput;
}

export interface EnquiryResponse {
  reference: string;
  submittedAtIso: string;
  message: string;
}

/**
 * Service layer abstracting reservation & enquiry operations.
 * Replace the mock bodies with `fetch('/api/...')` calls when connecting a real PMS/backend.
 */
export const bookingApi = {
  async searchAvailability(params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
  }): Promise<AvailabilitySearchResponse> {
    await new Promise((resolve) => setTimeout(resolve, 180));

    const anchor = getTodayLocalDateStr();
    const bookedInventory = buildMockBookedInventory(anchor);
    const nights = Math.max(1, diffNights(params.checkIn, params.checkOut));
    const adultsPerRoom = Math.ceil(params.adults / Math.max(1, params.rooms));
    const childrenPerRoom = Math.ceil(params.children / Math.max(1, params.rooms));

    const offers: RoomSearchOffer[] = ROOMS.map((room) => {
      const availability = checkRoomAvailability({
        roomId: room.id,
        totalInventory: room.totalInventory,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        requestedRooms: params.rooms,
        bookedInventory,
      });

      const capacityMet =
        room.maxAdults >= adultsPerRoom &&
        room.maxAdults + room.maxChildren >= adultsPerRoom + childrenPerRoom;

      const pricingByPlan: Record<RatePlanId, StayPricingBreakdown> = {
        flexible: calculateStayPricing({
          baseNightlyRate: room.startingPriceInr,
          ratePlan: 'flexible',
          nights,
          roomCount: params.rooms,
        }),
        'non-refundable': calculateStayPricing({
          baseNightlyRate: room.startingPriceInr,
          ratePlan: 'non-refundable',
          nights,
          roomCount: params.rooms,
        }),
        breakfast: calculateStayPricing({
          baseNightlyRate: room.startingPriceInr,
          ratePlan: 'breakfast',
          nights,
          roomCount: params.rooms,
        }),
      };

      return {
        room,
        available: availability.available,
        remainingRooms: availability.remainingRooms,
        soldOutDates: availability.soldOutDates,
        capacityMet,
        pricingByPlan,
      };
    });

    return {
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      nights,
      adults: params.adults,
      children: params.children,
      roomsRequested: params.rooms,
      offers,
    };
  },

  async createBooking(req: CreateBookingRequest): Promise<ConfirmedBooking> {
    await new Promise((resolve) => setTimeout(resolve, 220));

    const room = ROOMS.find((r) => r.id === req.roomId);
    if (!room) {
      throw new Error('Selected room category could not be found.');
    }
    const plan = RATE_PLANS.find((p) => p.id === req.ratePlan) ?? RATE_PLANS[0];
    const nights = Math.max(1, diffNights(req.checkIn, req.checkOut));
    const pricing = calculateStayPricing({
      baseNightlyRate: room.startingPriceInr,
      ratePlan: req.ratePlan,
      nights,
      roomCount: req.rooms,
    });

    const reference = generateBookingReference(
      `${req.guest.email}-${req.checkIn}-${req.roomId}-${Date.now()}`
    );

    const confirmed: ConfirmedBooking = {
      reference,
      createdAtIso: new Date().toISOString(),
      roomId: room.id,
      roomName: room.name,
      ratePlan: req.ratePlan,
      ratePlanName: plan.name,
      cancellationSummary: plan.cancellationSummary,
      checkIn: req.checkIn,
      checkOut: req.checkOut,
      nights,
      adults: req.adults,
      children: req.children,
      rooms: req.rooms,
      pricing,
      guest: {
        fullName: req.guest.fullName.trim(),
        email: req.guest.email.trim(),
        phone: req.guest.phone.trim(),
        specialRequests: req.guest.specialRequests.trim(),
      },
    };

    try {
      sessionStorage.setItem('rajvansh_confirmed_booking', JSON.stringify(confirmed));
    } catch {
      // Ignore storage quota / privacy mode errors
    }

    return confirmed;
  },

  async submitEnquiry(input: EnquiryFormInput): Promise<EnquiryResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const reference = generateBookingReference(`${input.email}-${input.eventType}-${Date.now()}`);
    return {
      reference: reference.replace('RVC-', 'ENQ-'),
      submittedAtIso: new Date().toISOString(),
      message:
        'Thank you. Our Celebrations & Reservations Concierge will respond within 4 business hours.',
    };
  },
};
