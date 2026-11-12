import { ExternalLink, MapPin } from 'lucide-react';
import { SectionEyebrow } from '../components/ActionButton';
import { EnquirySection } from '../components/EnquirySection';
import { SITE } from '../data/site';
import { usePageMeta } from '../lib/seo';

export default function ContactPage() {
  usePageMeta({
    title: `Contact & Directions — ${SITE.hotelName}, ${SITE.city}`,
    description: `Reach ${SITE.hotelName} reservations, wedding concierge, and airport transfers at Fateh Sagar Promenade, ${SITE.city}.`,
  });

  return (
    <div className="page-fade pt-16 md:pt-[72px]">
      <section className="py-14 md:py-20 border-b border-[#E7E2D9] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-5">
          <SectionEyebrow>Reach Us</SectionEyebrow>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-[60ch]">
              <h1 className="type-h1 text-[#0F2A43]">Contact &amp; Arrivals</h1>
              <p className="text-base text-[#5B6470]">
                Whether arranging an intimate courtyard stay, private chauffeur pickup from
                Maharana Pratap Airport, or a full-palace wedding buyout, our desk is at your
                service.
              </p>
            </div>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#0F2A43] px-5 text-sm font-medium text-[#0F2A43] hover:bg-[#0F2A43] hover:text-white transition-colors whitespace-nowrap shrink-0 self-start"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Directions on Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SITE.landmarks.map((lm) => (
              <div
                key={lm.name}
                className="rounded-[12px] bg-[#FAF7F2] border border-[#E7E2D9] p-4 space-y-1"
              >
                <p className="text-sm font-medium text-[#0F2A43]">{lm.name}</p>
                <p className="text-xs text-[#5B6470] tabular-nums">
                  {lm.travelTime} · {lm.distance}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EnquirySection
        id="contact-enquiry"
        initialEventType="Suite & Group Stay"
        heading="Write to our Udaipur concierge."
      />
    </div>
  );
}
