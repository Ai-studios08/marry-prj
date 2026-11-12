import { Check } from 'lucide-react';
import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { EnquirySection } from '../components/EnquirySection';
import { MediaImage } from '../components/MediaImage';
import { SITE } from '../data/site';
import { VENUES } from '../data/venues';
import { usePageMeta } from '../lib/seo';

export default function VenuesPage() {
  usePageMeta({
    title: `Venues & Banquets — ${SITE.hotelName}, ${SITE.city}`,
    description:
      'Grand indoor banquet halls, lakeside wedding lawns, sunset terraces, and executive salons in Udaipur for 30 to 850 guests.',
  });

  return (
    <div className="page-fade pt-16 md:pt-[72px]">
      <section className="py-14 md:py-20 border-b border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="space-y-5 max-w-[70ch]">
            <SectionEyebrow>Banquets &amp; Celebrations</SectionEyebrow>
            <h1 className="type-h1 text-[#0F2A43]">Venues for Weddings, Galas &amp; Summits</h1>
            <p className="text-base text-[#5B6470] leading-relaxed">
              Four interconnected indoor halls, open lawns, and rooftop terraces engineered for
              effortless ceremony flow, royal hospitality, and full-estate buyouts in Udaipur.
            </p>
          </div>
        </div>
      </section>

      {/* Venue Showcase Cards */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-16">
          {VENUES.map((venue, idx) => (
            <article
              key={venue.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              <div
                className={`lg:col-span-6 overflow-hidden rounded-[16px] shadow-md ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <MediaImage
                  asset={venue.image}
                  sizes="(max-width: 1024px) 100vw, 580px"
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>

              <div className={`lg:col-span-6 space-y-5 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8C6421]">
                  {venue.type} · {venue.dimensions}
                </p>
                <h2 className="type-h2 text-[#0F2A43]">{venue.name}</h2>
                <p className="text-base text-[#5B6470] leading-relaxed">{venue.description}</p>

                <ul className="space-y-2 text-sm text-[#1B1F24]">
                  {venue.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-[#2E7D5B] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <ActionButton
                    variant="primary"
                    label="Request Banquet Proposal"
                    showArrow
                    to={`/contact?eventType=${encodeURIComponent(
                      'Private Banquet'
                    )}&venue=${encodeURIComponent(venue.name)}#contact-enquiry`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Capacity & Dimensions Matrix */}
      <section className="py-14 md:py-20 bg-white border-t border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-6">
          <SectionEyebrow>Technical Specifications</SectionEyebrow>
          <h2 className="type-h2 text-[#0F2A43]">Venue Capacity Comparison</h2>

          <div className="overflow-x-auto rounded-[16px] border border-[#E7E2D9]">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#FAF7F2] text-[#0F2A43] border-b border-[#E7E2D9]">
                <tr>
                  <th className="py-4 px-5 font-semibold">Venue</th>
                  <th className="py-4 px-5 font-semibold">Area</th>
                  <th className="py-4 px-5 font-semibold">Ceiling</th>
                  <th className="py-4 px-5 font-semibold">Seated Banquet</th>
                  <th className="py-4 px-5 font-semibold">Reception</th>
                  <th className="py-4 px-5 font-semibold">Theatre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D9] tabular-nums text-[#1B1F24]">
                {VENUES.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="py-4 px-5 font-medium text-[#0F2A43]">{v.name}</td>
                    <td className="py-4 px-5">{v.areaSqFt.toLocaleString('en-IN')} sq ft</td>
                    <td className="py-4 px-5 text-[#5B6470]">{v.ceilingHeight}</td>
                    <td className="py-4 px-5">{v.capacities.seatedBanquet} guests</td>
                    <td className="py-4 px-5">{v.capacities.cocktailReception} guests</td>
                    <td className="py-4 px-5">{v.capacities.theatre} guests</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <EnquirySection
        id="venues-enquiry"
        initialEventType="Wedding Celebration"
        heading="Request a bespoke venue walkthrough & floor plan."
      />
    </div>
  );
}
