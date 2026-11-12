import { MEDIA, type MediaAsset } from './media';

export interface RoomCategory {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  sizeSqFt: number;
  sizeSqM: number;
  bedType: string;
  view: string;
  maxAdults: number;
  maxChildren: number;
  totalInventory: number;
  startingPriceInr: number;
  amenities: string[];
  highlights: string[];
  image: MediaAsset;
  gallery: MediaAsset[];
}

export const ROOMS: RoomCategory[] = [
  {
    id: 'palace-courtyard-room',
    slug: 'palace-courtyard-room',
    name: 'Palace Courtyard Room',
    categoryLabel: 'Heritage Wing',
    tagline: 'Carved sandstone arches opening onto tranquil lotus courts.',
    description:
      'Set along the quiet inner colonnade, the Palace Courtyard Room pairs hand-trowelled lime plaster walls with custom Burma teak furnishings, woven Kota dhurries, and a deep sandstone window alcove overlooking our lotus water court.',
    sizeSqFt: 420,
    sizeSqM: 39,
    bedType: 'King Bed',
    view: 'Lotus Courtyard',
    maxAdults: 2,
    maxChildren: 1,
    totalInventory: 8,
    startingPriceInr: 6800,
    amenities: [
      'Hand-loomed Egyptian cotton linen',
      'Rain shower & brass soaking fixtures',
      'Artisanal Darjeeling tea bar',
      'Complimentary high-speed Wi-Fi',
      'Evening turndown service',
      'In-room safe & writing desk',
    ],
    highlights: [
      'Positioned under the ₹7,500 tariff slab (12% GST)',
      'Quiet ground- and first-floor courtyard access',
      'Private cushioned jharokha reading seat',
    ],
    image: MEDIA.introVeranda,
    gallery: [MEDIA.introVeranda, MEDIA.roomRoyalSuite, MEDIA.expAyurvedaSpa],
  },
  {
    id: 'lakeview-veranda-room',
    slug: 'lakeview-veranda-room',
    name: 'Lakeview Veranda Room',
    categoryLabel: 'Upper Terrace',
    tagline: 'Private stone sit-out catching golden hour over Fateh Sagar.',
    description:
      'Elevated on the second level, each Lakeview Veranda Room opens onto a shaded private veranda framed by scalloped sandstone pillars. Morning chai arrives with views across Fateh Sagar Lake and the Aravalli ridge.',
    sizeSqFt: 510,
    sizeSqM: 47,
    bedType: 'King or Twin Beds',
    view: 'Fateh Sagar Lake',
    maxAdults: 2,
    maxChildren: 1,
    totalInventory: 6,
    startingPriceInr: 11500,
    amenities: [
      'Private shaded veranda with lounge seating',
      'Double vanity in Banswara marble',
      'Curated Mewari minibar & espresso machine',
      'Complimentary high-speed Wi-Fi',
      '24-hour courtyard butler on call',
      'Yoga mats & bespoke pillow menu',
    ],
    highlights: [
      'Uninterrupted sunset vista across the water',
      'Interconnecting option for families',
      'Hand-painted miniature wall frescoes',
    ],
    image: MEDIA.roomRoyalSuite,
    gallery: [MEDIA.roomRoyalSuite, MEDIA.introVeranda, MEDIA.expFineDining],
  },
  {
    id: 'maharana-heritage-suite',
    slug: 'maharana-heritage-suite',
    name: 'Maharana Heritage Suite',
    categoryLabel: 'Signature Suite',
    tagline: 'Four-poster teak canopy bedroom with separate drawing salon.',
    description:
      'Crafted as a royal residence, the Maharana Heritage Suite pairs a spacious living salon and dining alcove with an intimate bedroom featuring a hand-carved four-poster teak bed, wool rugs from Bhadohi, and twin arched lake windows.',
    sizeSqFt: 760,
    sizeSqM: 71,
    bedType: 'Four-Poster King Bed',
    view: 'Lake & Aravalli Hills',
    maxAdults: 3,
    maxChildren: 2,
    totalInventory: 5,
    startingPriceInr: 18500,
    amenities: [
      'Separate living salon & four-seat dining table',
      'Carved marble soaking tub & walk-in rain shower',
      'Complimentary airport sedan transfer (one way)',
      'Dedicated butler & pressing service',
      'Curated vinyl & acoustic sound system',
      'Priority courtyard dining seating',
    ],
    highlights: [
      'Ideal bridal or VIP family suite during palace weddings',
      'Twin jharokha bays overlooking the lake',
      'Complimentary evening aperitif in the salon',
    ],
    image: MEDIA.roomRoyalSuite,
    gallery: [MEDIA.roomRoyalSuite, MEDIA.expAyurvedaSpa, MEDIA.heroCourtyard],
  },
  {
    id: 'garden-plunge-pavilion',
    slug: 'garden-plunge-pavilion',
    name: 'Garden Plunge Pavilion',
    categoryLabel: 'Private Courtyard',
    tagline: 'Timber-vaulted sanctuary with heated private plunge pool.',
    description:
      'Tucked behind bougainvillea-draped walls, our Garden Plunge Pavilions feature soaring pitched teak ceilings, indigo block-printed upholstery, and twin arched doors leading directly to a private temperature-controlled stone plunge pool.',
    sizeSqFt: 840,
    sizeSqM: 78,
    bedType: 'King Bed + Daybed',
    view: 'Private Plunge Garden',
    maxAdults: 3,
    maxChildren: 1,
    totalInventory: 4,
    startingPriceInr: 22900,
    amenities: [
      'Private temperature-controlled plunge pool',
      'Outdoor sandstone shower courtyard',
      'High timber-truss ceiling & indigo daybed',
      'In-pavilion Ayurvedic bath ritual kit',
      'Dedicated pavilion host',
      'Complimentary daily laundry (4 pieces)',
    ],
    highlights: [
      'Complete walled garden privacy',
      'Direct step-free access from private lane',
      'Bespoke floating breakfast service available',
    ],
    image: MEDIA.roomGardenPavilion,
    gallery: [MEDIA.roomGardenPavilion, MEDIA.expAyurvedaSpa, MEDIA.introVeranda],
  },
  {
    id: 'rajvansh-royal-residence',
    slug: 'rajvansh-royal-residence',
    name: 'Rajvansh Royal Residence',
    categoryLabel: 'Presidential Wing',
    tagline: 'Two-bedroom rooftop wing with private baradari dining pavilion.',
    description:
      'Occupying the crown of the eastern wing, the Rajvansh Royal Residence spans two master bedrooms, a private library, an open-air baradari terrace for twelve guests, and private elevator access—designed for dignitaries and wedding hosts.',
    sizeSqFt: 1650,
    sizeSqM: 153,
    bedType: 'Two King Master Bedrooms',
    view: '360° Lake & Palace Panorama',
    maxAdults: 4,
    maxChildren: 2,
    totalInventory: 2,
    startingPriceInr: 38500,
    amenities: [
      'Two en-suite bedrooms + private study',
      'Private rooftop baradari dining terrace',
      'Round-trip chauffeur airport transfers',
      'Personal chef consultation for in-suite dining',
      'Two 60-minute Soma Ayurvedic therapies included',
      '24-hour dedicated royal butler',
    ],
    highlights: [
      'Private terrace hosting up to 12 for intimate dinners',
      'Direct private lift from arrival porch',
      'Unrivalled panoramic twilight view over Udaipur',
    ],
    image: MEDIA.heroCourtyard,
    gallery: [MEDIA.heroCourtyard, MEDIA.roomRoyalSuite, MEDIA.roomGardenPavilion],
  },
];

export function getRoomBySlug(slug: string): RoomCategory | undefined {
  return ROOMS.find((room) => room.slug === slug);
}
