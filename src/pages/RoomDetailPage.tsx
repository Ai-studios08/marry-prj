import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { MediaImage } from '../components/MediaImage';
import { getRoomBySlug } from '../data/rooms';
import { SITE } from '../data/site';
import { formatINR, getGstRateForNightlyTariff } from '../lib/booking';
import { usePageMeta } from '../lib/seo';

export default function RoomDetailPage() {
  const { slug = '' } = useParams();
  const room = getRoomBySlug(slug);

  usePageMeta({
    title: room
      ? `${room.name} — ${SITE.hotelName}`
      : `Suite Not Found — ${SITE.hotelName}`,
    description: room
      ? room.tagline
      : `Explore suites and rooms at ${SITE.hotelName} in ${SITE.city}.`,
  });

  if (!room) {
    return (
      <div className="page-fade pt-24 pb-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 text-center space-y-5 py-16">
          <SectionEyebrow>Suite Not Found</SectionEyebrow>
          <h1 className="type-h1 text-[#0F2A43]">We couldn’t find that suite.</h1>
          <p className="text-base text-[#5B6470] max-w-[48ch] mx-auto">
            It may have been renamed or moved. Browse all five accommodation categories below.
          </p>
          <div className="pt-2">
            <ActionButton variant="primary" label="Browse All Rooms" to="/rooms" />
          </div>
        </div>
      </div>
    );
  }

  const gstPercent = Math.round(getGstRateForNightlyTariff(room.startingPriceInr) * 100);

  return (
    <div className="page-fade pt-16 md:pt-[72px]">
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-8">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5B6470] hover:text-[#0F2A43]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Rooms &amp; Suites</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="overflow-hidden rounded-[16px] shadow-md">
                <MediaImage
                  asset={room.image}
                  priority
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {room.gallery.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-[12px] border border-[#E7E2D9]">
                    <MediaImage
                      asset={img}
                      sizes="220px"
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 rounded-[16px] bg-white border border-[#E7E2D9] p-6 md:p-8 shadow-sm">
              <div className="space-y-2">
                <SectionEyebrow>{room.categoryLabel}</SectionEyebrow>
                <h1 className="type-h2 text-[#0F2A43]">{room.name}</h1>
                <p className="text-base text-[#5B6470] leading-relaxed">{room.description}</p>
              </div>

              <dl className="grid grid-cols-2 gap-4 py-4 border-y border-[#E7E2D9] text-sm tabular-nums">
                <div>
                  <dt className="text-xs text-[#5B6470]">Interior Footprint</dt>
                  <dd className="font-medium text-[#0F2A43] mt-0.5">
                    {room.sizeSqFt} sq ft ({room.sizeSqM} sq m)
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5B6470]">Bedding</dt>
                  <dd className="font-medium text-[#0F2A43] mt-0.5">{room.bedType}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5B6470]">Outlook</dt>
                  <dd className="font-medium text-[#0F2A43] mt-0.5">{room.view}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5B6470]">Occupancy</dt>
                  <dd className="font-medium text-[#0F2A43] mt-0.5">
                    {room.maxAdults} Adults, {room.maxChildren} Child
                  </dd>
                </div>
              </dl>

              <div className="space-y-2.5">
                <h2 className="font-serif text-lg text-[#0F2A43]">Suite Amenities</h2>
                <ul className="space-y-2 text-sm text-[#1B1F24]">
                  {room.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-[#2E7D5B] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E7E2D9] space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-[#5B6470]">Starting flexible rate</span>
                  <div className="text-right tabular-nums">
                    <span className="font-serif text-2xl font-medium text-[#0F2A43]">
                      {formatINR(room.startingPriceInr)}
                    </span>
                    <span className="text-xs text-[#5B6470] block">
                      per night + {gstPercent}% GST
                    </span>
                  </div>
                </div>

                <ActionButton
                  variant="gold"
                  label="Reserve This Suite"
                  showArrow
                  fullWidth
                  to={`/book?room=${encodeURIComponent(room.id)}`}
                />
                <p className="text-xs text-[#5B6470] text-center">
                  Check-in {SITE.checkInTime} · Check-out {SITE.checkOutTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
