import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, SectionEyebrow } from '../components/ActionButton';
import { MediaImage } from '../components/MediaImage';
import { PriceDisplay } from '../components/PriceDisplay';
import { ROOMS } from '../data/rooms';
import { SITE } from '../data/site';
import { usePageMeta } from '../lib/seo';

type FilterGroup = 'All' | 'Rooms' | 'Suites & Pavilions';

export default function RoomsPage() {
  usePageMeta({
    title: `Rooms & Suites — ${SITE.hotelName}, ${SITE.city}`,
    description:
      'Explore twenty-eight sandstone courtyard rooms, lakeview verandas, garden plunge pavilions, and royal residences in Udaipur.',
  });

  const [filter, setFilter] = useState<FilterGroup>('All');

  const filteredRooms = ROOMS.filter((room) => {
    if (filter === 'Rooms') return room.startingPriceInr < 15000;
    if (filter === 'Suites & Pavilions') return room.startingPriceInr >= 15000;
    return true;
  });

  return (
    <div className="page-fade pt-16 md:pt-[72px]">
      <section className="py-14 md:py-20 border-b border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-6">
          <SectionEyebrow>Accommodations</SectionEyebrow>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-[65ch]">
              <h1 className="type-h1 text-[#0F2A43]">Rooms, Pavilions &amp; Suites</h1>
              <p className="text-base text-[#5B6470] leading-relaxed">
                Five architectural room categories dressed in lime plaster, Burma teak, and
                hand-loomed cotton—each opening to either our lotus courts or Fateh Sagar Lake.
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter room categories"
              className="inline-flex items-center gap-1 p-1 rounded-[12px] bg-white border border-[#E7E2D9] self-start"
            >
              {(['All', 'Rooms', 'Suites & Pavilions'] as FilterGroup[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`h-10 px-4 rounded-[10px] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    filter === tab
                      ? 'bg-[#0F2A43] text-white'
                      : 'text-[#5B6470] hover:text-[#0F2A43]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-10">
          {filteredRooms.map((room) => (
            <article
              key={room.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-[16px] bg-white border border-[#E7E2D9] overflow-hidden shadow-sm p-4 md:p-6 items-center"
            >
              <div className="lg:col-span-5 overflow-hidden rounded-[12px]">
                <MediaImage
                  asset={room.image}
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-5 px-2">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#8C6421] uppercase tracking-[0.12em]">
                    {room.categoryLabel} · {room.view}
                  </p>
                  <h2 className="type-h2 text-[#0F2A43]">{room.name}</h2>
                  <p className="text-base text-[#5B6470] leading-relaxed max-w-[62ch]">
                    {room.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#1B1F24] py-3 border-y border-[#E7E2D9] tabular-nums">
                  <span>{room.sizeSqFt} sq ft ({room.sizeSqM} sq m)</span>
                  <span aria-hidden="true">·</span>
                  <span>{room.bedType}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Up to {room.maxAdults} Adults, {room.maxChildren} Child
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#5B6470] block">Starting tariff</span>
                    <span className="font-serif text-2xl font-medium text-[#0F2A43]">
                      <PriceDisplay amount={room.startingPriceInr} />
                    </span>
                    <span className="text-xs text-[#5B6470]"> / night + GST</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={`/rooms/${room.slug}`}
                      className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#E7E2D9] px-5 text-sm font-medium text-[#0F2A43] hover:border-[#0F2A43] transition-colors whitespace-nowrap"
                    >
                      View Details
                    </Link>
                    <ActionButton
                      variant="primary"
                      label="Book Suite"
                      showArrow
                      to={`/book?room=${encodeURIComponent(room.id)}`}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
