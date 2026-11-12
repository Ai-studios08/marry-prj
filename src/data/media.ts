import heroPalaceImg from '../assets/images/hero_palace_courtyard_1794510848324.jpg';
import introVerandaImg from '../assets/images/intro_heritage_veranda_1794510846255.jpg';
import roomRoyalSuiteImg from '../assets/images/room_suite_royal_1794510849032.jpg';
import roomGardenPavilionImg from '../assets/images/room_pavilion_garden_1794510848314.jpg';
import venueGrandDurbarImg from '../assets/images/venue_grand_durbar_1794510850586.jpg';
import venueChandraLawnImg from '../assets/images/venue_chandra_lawn_1794510851170.jpg';
import expFineDiningImg from '../assets/images/exp_fine_dining_1794510851738.jpg';
import expAyurvedaSpaImg from '../assets/images/exp_ayurveda_spa_1794510850878.jpg';

export interface MediaAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const MEDIA = {
  heroCourtyard: {
    src: heroPalaceImg,
    width: 1408,
    height: 792,
    alt: 'Illuminated sandstone arches and reflective courtyard pool at The Rajvansh Courtyard in Udaipur at dusk',
  },
  introVeranda: {
    src: introVerandaImg,
    width: 1200,
    height: 900,
    alt: 'Sunlit carved sandstone veranda with teak seating and jali latticework overlooking lotus gardens',
  },
  roomRoyalSuite: {
    src: roomRoyalSuiteImg,
    width: 1200,
    height: 900,
    alt: 'Maharana Heritage Suite with hand-carved four-poster teak bed and arched window facing the lake',
  },
  roomGardenPavilion: {
    src: roomGardenPavilionImg,
    width: 1200,
    height: 900,
    alt: 'Garden Plunge Pavilion featuring timber-beamed ceiling, navy daybed, and private stone plunge terrace',
  },
  venueGrandDurbar: {
    src: venueGrandDurbarImg,
    width: 1408,
    height: 792,
    alt: 'The Grand Durbar Hall dressed with ivory linen tables, floral centerpieces, and crystal chandeliers',
  },
  venueChandraLawn: {
    src: venueChandraLawnImg,
    width: 1408,
    height: 792,
    alt: 'Chandra Bagh Lawns illuminated with brass torches and lanterns overlooking the sandstone palace facade',
  },
  expFineDining: {
    src: expFineDiningImg,
    width: 1200,
    height: 900,
    alt: 'Candlelit evening courtyard dining at Darbar Courtyard with handcrafted brass tableware',
  },
  expAyurvedaSpa: {
    src: expAyurvedaSpaImg,
    width: 1200,
    height: 900,
    alt: 'Soma Ayurvedic Sanctuary featuring a carved marble floral bath and cedarwood spa deck',
  },
} as const satisfies Record<string, MediaAsset>;
