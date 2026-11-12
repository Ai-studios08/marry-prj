/**
 * Central site configuration.
 * Replace placeholder defaults (hotel name, city, phone, WhatsApp, email, address)
 * here without modifying any React components.
 */

export interface LandmarkDistance {
  name: string;
  travelTime: string;
  distance: string;
}

export interface SiteConfig {
  hotelName: string;
  shortName: string;
  city: string;
  state: string;
  country: string;
  tagline: string;
  heroHeadingLines: [string, string];
  heroSubtext: string;
  phone: string;
  phoneHref: string;
  whatsappNumber: string; // Digits only with country code, e.g., 912942428800
  whatsappPrefill: string;
  email: string;
  eventsEmail: string;
  addressLine1: string;
  addressLine2: string;
  fullAddress: string;
  mapsUrl: string;
  checkInTime: string;
  checkOutTime: string;
  deskHours: string;
  tickerWords: string[];
  landmarks: LandmarkDistance[];
  socialLinks: {
    label: string;
    href: string;
  }[];
}

export const SITE: SiteConfig = {
  hotelName: 'The Rajvansh Courtyard',
  shortName: 'Rajvansh Courtyard',
  city: 'Udaipur',
  state: 'Rajasthan',
  country: 'India',
  tagline: 'Heritage Sanctuary & Grand Banquets',
  heroHeadingLines: ['Stillness carved in stone,', 'celebrations under open skies.'],
  heroSubtext:
    'Twenty-eight lakeside suites, an Ayurvedic courtyard sanctuary, and Udaipur’s most storied banquet halls on Fateh Sagar Promenade.',
  phone: '+91 294 242 8800',
  phoneHref: 'tel:+912942428800',
  whatsappNumber: '912942428800',
  whatsappPrefill:
    'Namaste, I would like to enquire about a stay or celebration at The Rajvansh Courtyard, Udaipur.',
  email: 'reservations@rajvanshcourtyard.example',
  eventsEmail: 'celebrations@rajvanshcourtyard.example',
  addressLine1: '14 Fateh Sagar Promenade, Dewali',
  addressLine2: 'Udaipur, Rajasthan 313001, India',
  fullAddress: '14 Fateh Sagar Promenade, Dewali, Udaipur, Rajasthan 313001, India',
  mapsUrl: 'https://maps.google.com/?q=Fateh+Sagar+Lake+Udaipur+Rajasthan',
  checkInTime: '2:00 PM',
  checkOutTime: '12:00 PM',
  deskHours: 'Reservations & Events Concierge · Daily 8:00 AM – 10:00 PM IST',
  tickerWords: [
    'Sandstone Courtyards',
    'Lakeside Suites',
    'Grand Durbar Banquets',
    'Soma Ayurveda',
    'Mewari Royal Kitchens',
    'Udaipur Heritage',
  ],
  landmarks: [
    { name: 'Fateh Sagar Promenade', travelTime: '4 min walk', distance: '350 m' },
    { name: 'City Palace & Lake Pichola', travelTime: '12 min drive', distance: '4.6 km' },
    { name: 'Udaipur City Railway Station', travelTime: '18 min drive', distance: '6.8 km' },
    { name: 'Maharana Pratap Airport (UDR)', travelTime: '35 min drive', distance: '24 km' },
  ],
  socialLinks: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
};
