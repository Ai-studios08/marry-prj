import { MEDIA, type MediaAsset } from './media';

export interface ExperienceItem {
  id: string;
  number: string;
  category: 'Dining' | 'Spa & Wellness' | 'Pool & Leisure' | 'Heritage';
  title: string;
  subtitle: string;
  description: string;
  timing: string;
  locationNote: string;
  bookingNote: string;
  image: MediaAsset;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'darbar-courtyard-dining',
    number: '01',
    category: 'Dining',
    title: 'Darbar Courtyard Dining',
    subtitle: 'Slow-cooked Mewari recipes served by brass lantern light.',
    description:
      'Around our candlelit water court, Chef Raghavendra’s kitchen honours royal Rajasthani culinary archives—smoked ker sangri, heirloom saffron pulao, and charcoal-roasted breads paired with single-estate wines and botanical infusions.',
    timing: 'Dinner 7:00 PM – 11:00 PM · Lunch 12:30 PM – 3:00 PM',
    locationNote: 'Main Water Courtyard',
    bookingNote: 'Prior table reservation recommended for lakeside colonnade seating.',
    image: MEDIA.expFineDining,
  },
  {
    id: 'soma-ayurveda-sanctuary',
    number: '02',
    category: 'Spa & Wellness',
    title: 'Soma Ayurvedic Sanctuary',
    subtitle: 'Classical Abhyanga therapies, herbal steam, and marigold floral baths.',
    description:
      'Guided by our resident Vaidya, four stone-vaulted treatment suites offer warm sesame and vetiver oil abhyanga, marma point renewal, and carved marble soaking rituals steeped in fresh marigold and rosewater.',
    timing: 'Daily 8:00 AM – 8:30 PM',
    locationNote: 'West Garden Cloister',
    bookingNote: 'Individual and couples rituals tailored following a brief dosha consultation.',
    image: MEDIA.expAyurvedaSpa,
  },
  {
    id: 'heated-stepwell-pool',
    number: '03',
    category: 'Pool & Leisure',
    title: 'Heated Stepwell Infinity Pool',
    subtitle: 'Temperature-controlled swim overlooking the sandstone arches.',
    description:
      'Modelled after traditional Mewari baoris, our 28-metre slate infinity pool remains heated through winter mornings. Poolside cabanas serve cold-pressed pomegranate tonics, artisanal gelato, and light veranda fare.',
    timing: 'Daily 6:30 AM – 9:30 PM',
    locationNote: 'Central Courtyard',
    bookingNote: 'Private evening lantern-lit cabana dining available on request.',
    image: MEDIA.heroCourtyard,
  },
  {
    id: 'sunrise-veranda-tea',
    number: '04',
    category: 'Dining',
    title: 'Veranda High Tea & Lake Walks',
    subtitle: 'First-flush Darjeeling, cardamom scones, and guided promenade strolls.',
    description:
      'Each afternoon as the Aravalli shadows lengthen, guests gather under the lotus veranda for brass-tray high tea followed by a private historian-led walk along the Fateh Sagar embankment.',
    timing: 'Afternoon Tea 4:00 PM – 6:00 PM',
    locationNote: 'Lotus Veranda',
    bookingNote: 'Complimentary for resident guests; private boat charters arranged with 24h notice.',
    image: MEDIA.introVeranda,
  },
  {
    id: 'royal-architecture-trail',
    number: '05',
    category: 'Heritage',
    title: 'Artisan Stone & Fresco Atelier',
    subtitle: 'Meet Udaipur’s third-generation sandstone carvers and miniature painters.',
    description:
      'Step behind the scenes of our restoration work with morning sessions alongside local silawat stone artisans and Pichwai brush masters, discovering mineral pigments and traditional lime-plaster araish craft.',
    timing: 'Tuesday, Thursday & Saturday · 10:30 AM',
    locationNote: 'East Atelier Pavilion',
    bookingNote: 'Limited to 8 guests per session through the concierge.',
    image: MEDIA.roomGardenPavilion,
  },
];
