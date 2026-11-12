import { MEDIA, type MediaAsset } from './media';

export interface VenueSpace {
  id: string;
  name: string;
  type: 'Indoor Banquet' | 'Outdoor Lawn' | 'Rooftop Terrace' | 'Executive Salon';
  tagline: string;
  description: string;
  areaSqFt: number;
  dimensions: string;
  ceilingHeight: string;
  capacities: {
    seatedBanquet: number;
    cocktailReception: number;
    theatre: number;
    cluster: number;
  };
  idealFor: string[];
  features: string[];
  image: MediaAsset;
}

export const VENUES: VenueSpace[] = [
  {
    id: 'grand-durbar-hall',
    name: 'The Grand Durbar Hall',
    type: 'Indoor Banquet',
    tagline: 'Vaulted sandstone grandeur for formal receptions and gala banquets.',
    description:
      'Anchored by soaring arched sandstone ribs and warm brass chandeliers, The Grand Durbar Hall offers acoustic precision, a private bridal/VIP green room, and seamless pre-function flow onto the colonnade veranda.',
    areaSqFt: 6200,
    dimensions: '100 ft × 62 ft',
    ceilingHeight: '24 ft vaulted',
    capacities: {
      seatedBanquet: 320,
      cocktailReception: 500,
      theatre: 450,
      cluster: 260,
    },
    idealFor: ['Sangeet & Reception Galas', 'Leadership Summits', 'Formal Sit-Down Banquets'],
    features: [
      'Pillarless sightlines with acoustic stone baffling',
      'Dedicated 1,800 sq ft colonnade pre-function gallery',
      'Dual private green suites & staging kitchen access',
      'Integrated warm dimming architectural lighting',
    ],
    image: MEDIA.venueGrandDurbar,
  },
  {
    id: 'chandra-bagh-lawns',
    name: 'Chandra Bagh Lawns',
    type: 'Outdoor Lawn',
    tagline: 'Manicured lakeside lawns framed by the illuminated palace facade.',
    description:
      'Stretching between the eastern palace portico and the promenade edge, Chandra Bagh Lawns host starlit pheras, orchestral cocktails, and heritage destination weddings with natural Aravalli views.',
    areaSqFt: 18500,
    dimensions: '185 ft × 100 ft',
    ceilingHeight: 'Open sky',
    capacities: {
      seatedBanquet: 550,
      cocktailReception: 850,
      theatre: 700,
      cluster: 420,
    },
    idealFor: ['Mandap & Royal Baraat', 'Twilight Cocktail Receptions', 'Cultural Folk Evenings'],
    features: [
      'Dedicated Baraat arrival driveway & ceremonial portico',
      'Concealed high-load power & rigging points for mandaps',
      'Adjoining covered veranda contingency for weather comfort',
      'Hand-hammered brass mashaal torch perimeter lighting',
    ],
    image: MEDIA.venueChandraLawn,
  },
  {
    id: 'jharokha-terrace',
    name: 'Jharokha Sunset Terrace',
    type: 'Rooftop Terrace',
    tagline: 'Elevated stone terrace tailored for mehendi brunches and private toasts.',
    description:
      'Overlooking both the lotus courtyard below and Fateh Sagar Lake beyond, Jharokha Terrace captures Udaipur’s crisp evening breeze for intimate welcome lunches and cocktail hours.',
    areaSqFt: 3100,
    dimensions: '78 ft × 40 ft',
    ceilingHeight: 'Open sky with carved chhatris',
    capacities: {
      seatedBanquet: 110,
      cocktailReception: 160,
      theatre: 130,
      cluster: 90,
    },
    idealFor: ['Mehendi & Haldi Brunches', 'Welcome Sundowners', 'Intimate Milestone Dinners'],
    features: [
      'Built-in carved sandstone bar & live chaat counter alcove',
      'Four corner chhatri pavilions for shaded lounge seating',
      'Direct private lift access for elderly guests',
    ],
    image: MEDIA.heroCourtyard,
  },
  {
    id: 'diwan-boardroom',
    name: 'Diwan Heritage Salon',
    type: 'Executive Salon',
    tagline: 'Private wood-panelled boardroom for offsites and family councils.',
    description:
      'Designed for executive retreats, private tastings, and intimate family gatherings, the Diwan Salon combines heritage walnut craftsmanship with discreet 4K conferencing and curated espresso service.',
    areaSqFt: 980,
    dimensions: '35 ft × 28 ft',
    ceilingHeight: '14 ft',
    capacities: {
      seatedBanquet: 36,
      cocktailReception: 55,
      theatre: 48,
      cluster: 28,
    },
    idealFor: ['Executive Board Offsites', 'Private Wine & Spice Tastings', 'Wedding Planning Briefings'],
    features: [
      'Bespoke 18-seat Burma teak board table',
      'Concealed 4K display & room-wide conferencing audio',
      'Adjacent courtyard breakout deck for coffee intervals',
    ],
    image: MEDIA.introVeranda,
  },
];
