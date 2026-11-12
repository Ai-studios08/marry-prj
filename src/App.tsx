import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import HomePage from './pages/HomePage';

const RoomsPage = lazy(() => import('./pages/RoomsPage'));
const RoomDetailPage = lazy(() => import('./pages/RoomDetailPage'));
const VenuesPage = lazy(() => import('./pages/VenuesPage'));
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const BookingConfirmedPage = lazy(() => import('./pages/BookingConfirmedPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function RouteFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-[60vh] pt-28 flex items-center justify-center text-sm text-[#5B6470]"
    >
      Loading courtyard view...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1B1F24]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-[#0F2A43] focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:slug" element={<RoomDetailPage />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/booking/confirmed" element={<BookingConfirmedPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
