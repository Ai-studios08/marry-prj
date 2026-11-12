export interface GuestReview {
  id: string;
  quote: string;
  guestName: string;
  occasion: string;
  source: string;
  rating: 5 | 4;
  stayDate: string;
}

export const REVIEWS: GuestReview[] = [
  {
    id: 'rev-1',
    quote:
      'We hosted our daughter’s three-day wedding across Chandra Bagh Lawns and the Grand Durbar Hall. Every transition—from welcome high tea on the veranda to the midnight reception—felt unhurried, warm, and impeccably choreographed.',
    guestName: 'Meera & Vikramaditya Singhania',
    occasion: 'Destination Wedding · 340 Guests',
    source: 'Verified Celebration Host · Mumbai',
    rating: 5,
    stayDate: 'February 2026',
  },
  {
    id: 'rev-2',
    quote:
      'Waking up in the Garden Plunge Pavilion to jasmine scent and quiet courtyard water is rare luxury. No blaring music, extraordinary attention to stone craft, and the finest dal baati thali we tasted in Rajasthan.',
    guestName: 'Ananya Deshmukh',
    occasion: '4-Night Leisure Stay',
    source: 'Verified Guest · Bengaluru',
    rating: 5,
    stayDate: 'January 2026',
  },
  {
    id: 'rev-3',
    quote:
      'Our partners’ retreat in the Diwan Salon combined seamless audiovisual setup with genuine heritage hospitality. Staying in the Maharana Suites gave our leadership team complete privacy.',
    guestName: 'Rohan Malhotra',
    occasion: 'Executive Offsite · 24 Delegates',
    source: 'Verified Corporate Client · New Delhi',
    rating: 5,
    stayDate: 'March 2026',
  },
  {
    id: 'rev-4',
    quote:
      'From the carved marble tub ritual at Soma Spa to our sunrise walk along Fateh Sagar, every detail feels grounded in Udaipur rather than generic hotel luxury.',
    guestName: 'Clara & Thomas Lindholm',
    occasion: 'Anniversary Escape',
    source: 'Verified Guest · London',
    rating: 5,
    stayDate: 'December 2025',
  },
];
