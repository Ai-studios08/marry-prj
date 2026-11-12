import { MEDIA, type MediaAsset } from './media';

export type GalleryCategory =
  | 'All'
  | 'Architecture'
  | 'Rooms & Suites'
  | 'Venues & Weddings'
  | 'Dining & Spa';

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: Exclude<GalleryCategory, 'All'>;
  asset: MediaAsset;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Architecture',
  'Rooms & Suites',
  'Venues & Weddings',
  'Dining & Spa',
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Twilight Courtyard Reflections',
    caption: 'The central infinity pool reflecting honey sandstone arches at blue hour.',
    category: 'Architecture',
    asset: MEDIA.heroCourtyard,
  },
  {
    id: 'gal-2',
    title: 'The Grand Durbar Hall',
    caption: 'Vaulted stone ceilings dressed for a 300-guest candlelit banquet.',
    category: 'Venues & Weddings',
    asset: MEDIA.venueGrandDurbar,
  },
  {
    id: 'gal-3',
    title: 'Maharana Heritage Suite',
    caption: 'Hand-carved four-poster teak bed beside arched lakefront windows.',
    category: 'Rooms & Suites',
    asset: MEDIA.roomRoyalSuite,
  },
  {
    id: 'gal-4',
    title: 'Darbar Courtyard Dining',
    caption: 'Private travertine tables lit by brass lanterns beside the water court.',
    category: 'Dining & Spa',
    asset: MEDIA.expFineDining,
  },
  {
    id: 'gal-5',
    title: 'Chandra Bagh Lawns at Dusk',
    caption: 'Evening reception setup overlooking Fateh Sagar and the illuminated portico.',
    category: 'Venues & Weddings',
    asset: MEDIA.venueChandraLawn,
  },
  {
    id: 'gal-6',
    title: 'Lotus Veranda Colonnade',
    caption: 'Carved sandstone jali screens and morning tea seating.',
    category: 'Architecture',
    asset: MEDIA.introVeranda,
  },
  {
    id: 'gal-7',
    title: 'Garden Plunge Pavilion',
    caption: 'Timber-beamed suite opening to a private stone plunge terrace.',
    category: 'Rooms & Suites',
    asset: MEDIA.roomGardenPavilion,
  },
  {
    id: 'gal-8',
    title: 'Soma Ayurvedic Sanctuary',
    caption: 'Carved marble floral bath prepared with fresh marigold and rose petals.',
    category: 'Dining & Spa',
    asset: MEDIA.expAyurvedaSpa,
  },
];
