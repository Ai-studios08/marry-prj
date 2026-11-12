import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { EnquirySection } from '../components/EnquirySection';
import { MediaImage } from '../components/MediaImage';
import { EXPERIENCES } from '../data/experiences';
import { SITE } from '../data/site';
import { usePageMeta } from '../lib/seo';

export default function ExperiencesPage() {
  usePageMeta({
    title: `Dining, Spa & Experiences — ${SITE.hotelName}, ${SITE.city}`,
    description:
      'Mewari courtyard dining, Soma Ayurvedic therapies, heated stepwell infinity pool, and heritage stone walks in Udaipur.',
  });

  return (
    <div className="page-fade pt-16 md:pt-[72px]">
      <section className="py-14 md:py-20 border-b border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="space-y-5 max-w-[70ch]">
            <SectionEyebrow>Experiences</SectionEyebrow>
            <h1 className="type-h1 text-[#0F2A43]">Dining, Soma Ayurveda &amp; Courtyard Life</h1>
            <p className="text-base text-[#5B6470] leading-relaxed">
              Every stay unfolds at the unhurried rhythm of Udaipur—from slow-simmered royal
              kitchens to stone-vaulted wellness rituals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-16">
          {EXPERIENCES.map((exp, idx) => (
            <article
              id={exp.id}
              key={exp.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center scroll-mt-24"
            >
              <div
                className={`lg:col-span-6 overflow-hidden rounded-[16px] shadow-md ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <MediaImage
                  asset={exp.image}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#8C6421] tabular-nums">
                  {exp.number} · {exp.category}
                </p>
                <h2 className="type-h2 text-[#0F2A43]">{exp.title}</h2>
                <p className="text-base text-[#5B6470] leading-relaxed">{exp.description}</p>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-[#E7E2D9] text-sm">
                  <div>
                    <dt className="text-xs text-[#5B6470]">Hours</dt>
                    <dd className="font-medium text-[#0F2A43] mt-0.5">{exp.timing}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#5B6470]">Setting</dt>
                    <dd className="font-medium text-[#0F2A43] mt-0.5">{exp.locationNote}</dd>
                  </div>
                </dl>

                <p className="text-xs text-[#5B6470]">{exp.bookingNote}</p>

                <div className="pt-2">
                  <ActionButton
                    variant="ghost"
                    label="Reserve Table or Ritual"
                    showArrow
                    onClick={() =>
                      document
                        .getElementById('experience-enquiry')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <EnquirySection
        id="experience-enquiry"
        initialEventType="Dining & Spa Reservation"
        heading="Reserve a private courtyard dinner or Soma ritual."
      />
    </div>
  );
}
