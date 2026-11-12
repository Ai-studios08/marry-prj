import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SectionEyebrow } from '../components/ActionButton';
import { MediaImage } from '../components/MediaImage';
import {
  GALLERY_CATEGORIES,
  GALLERY_PHOTOS,
  type GalleryCategory,
} from '../data/gallery';
import { SITE } from '../data/site';
import { usePageMeta } from '../lib/seo';

export default function GalleryPage() {
  usePageMeta({
    title: `Gallery — ${SITE.hotelName}, ${SITE.city}`,
    description:
      'Photographs of our Udaipur sandstone courtyards, lakeside suites, banquet halls, and dining terraces.',
  });

  const [category, setCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const visiblePhotos =
    category === 'All'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((photo) => photo.category === category);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visiblePhotos.length
        );
        return;
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visiblePhotos.length) % visiblePhotos.length
        );
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, visiblePhotos.length]);

  const activePhoto = lightboxIndex !== null ? visiblePhotos[lightboxIndex] : null;

  return (
    <div className="page-fade pt-16 md:pt-[72px]">
      <section className="py-14 md:py-20 border-b border-[#E7E2D9]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 space-y-6">
          <SectionEyebrow>Visual Archive</SectionEyebrow>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-[60ch]">
              <h1 className="type-h1 text-[#0F2A43]">Courtyards, Suites &amp; Celebrations</h1>
              <p className="text-base text-[#5B6470]">
                Filter by setting or open any photograph for a closer view. Use arrow keys or
                Escape inside the gallery viewer.
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter gallery by category"
              className="flex flex-wrap items-center gap-2"
            >
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setLightboxIndex(null);
                  }}
                  aria-pressed={category === cat}
                  className={`h-11 px-4 rounded-[12px] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border ${
                    category === cat
                      ? 'bg-[#0F2A43] text-white border-[#0F2A43]'
                      : 'bg-white text-[#5B6470] border-[#E7E2D9] hover:border-[#0F2A43] hover:text-[#0F2A43]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePhotos.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setLightboxIndex(idx);
                }}
                aria-label={`Open ${photo.title} in lightbox`}
                className="group text-left rounded-[16px] bg-white border border-[#E7E2D9] overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="overflow-hidden aspect-[4/3]">
                  <MediaImage
                    asset={photo.asset}
                    sizes="(max-width: 640px) 100vw, 380px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs text-[#8C6421]">{photo.category}</p>
                  <h2 className="font-serif text-lg text-[#0F2A43]">{photo.title}</h2>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Keyboard-Accessible Lightbox */}
      {activePhoto && lightboxIndex !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0F2A43]/95 text-white p-4 md:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium tabular-nums text-[#FAF7F2]/80">
              {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
              {String(visiblePhotos.length).padStart(2, '0')} · {activePhoto.category}
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => {
                setLightboxIndex(null);
                triggerRef.current?.focus();
              }}
              aria-label="Close lightbox"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/25 text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center gap-4 my-4 min-h-0">
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + visiblePhotos.length) % visiblePhotos.length
                )
              }
              aria-label="Previous image"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border border-white/25 text-white hover:bg-white/10 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="max-h-[72vh] max-w-[960px] overflow-hidden rounded-[16px] shadow-2xl">
              <MediaImage
                asset={activePhoto.asset}
                priority
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % visiblePhotos.length)}
              aria-label="Next image"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border border-white/25 text-white hover:bg-white/10 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="text-center space-y-1">
            <p className="font-serif text-xl">{activePhoto.title}</p>
            <p className="text-sm text-[#FAF7F2]/80">{activePhoto.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
