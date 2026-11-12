import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { SITE } from '../data/site';
import { usePageMeta } from '../lib/seo';

export default function NotFoundPage() {
  usePageMeta({
    title: `Page Not Found — ${SITE.hotelName}`,
    description: `Return to ${SITE.hotelName} home, suites, venues, or online booking.`,
  });

  return (
    <div className="page-fade pt-24 pb-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 text-center py-20 space-y-6">
        <SectionEyebrow>404 · Page Not Found</SectionEyebrow>
        <h1 className="type-h1 text-[#0F2A43]">This courtyard path leads nowhere.</h1>
        <p className="text-base text-[#5B6470] max-w-[48ch] mx-auto">
          The page you are looking for may have moved. Explore our suites, banquet venues, or
          return to the main courtyard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <ActionButton variant="primary" label="Return Home" showArrow to="/" />
          <ActionButton variant="ghost" label="Browse Suites" to="/rooms" />
        </div>
      </div>
    </div>
  );
}
