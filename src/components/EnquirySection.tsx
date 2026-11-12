import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { SITE } from '../data/site';
import {
  getTodayLocalDateStr,
  validateEnquiryForm,
  type EnquiryFormInput,
} from '../lib/booking';
import { bookingApi, type EnquiryResponse } from '../services/api';
import { ActionButton, SectionEyebrow } from './ActionButton';

interface EnquirySectionProps {
  id?: string;
  initialEventType?: string;
  initialMessage?: string;
  heading?: string;
}

export const ENQUIRY_EVENT_TYPES = [
  'Wedding Celebration',
  'Private Banquet',
  'Corporate Retreat',
  'Suite & Group Stay',
  'Dining & Spa Reservation',
];

export function EnquirySection({
  id = 'enquiry',
  initialEventType = 'Wedding Celebration',
  initialMessage = '',
  heading = 'Plan a celebration or bespoke stay.',
}: EnquirySectionProps) {
  const [form, setForm] = useState<EnquiryFormInput>({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: initialEventType,
    message: initialMessage,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<EnquiryResponse | null>(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      eventType: initialEventType,
      message: initialMessage || prev.message,
    }));
  }, [initialEventType, initialMessage]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateEnquiryForm(form, getTodayLocalDateStr());
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const response = await bookingApi.submitEnquiry(form);
      setSubmitted(response);
      setForm({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: initialEventType,
        message: '',
      });
    } catch {
      setSubmitError('Unable to send enquiry right now. Please call or WhatsApp our concierge desk.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id={id} className="py-14 md:py-24 border-t border-[#E7E2D9]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left column: Contact details */}
          <div className="lg:col-span-5 space-y-6">
            <SectionEyebrow>Concierge &amp; Events</SectionEyebrow>
            <h2 className="type-h2 text-[#0F2A43]">{heading}</h2>
            <p className="text-base leading-[1.65] text-[#5B6470] max-w-[48ch]">
              Share your preferred dates, guest count, or celebration vision. Our events and
              reservations directors respond personally with tailored floor plans and suite blocks.
            </p>

            <div className="pt-4 space-y-4 border-t border-[#E7E2D9] text-sm text-[#1B1F24]">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#C8963E] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#0F2A43]">Reservations &amp; Banquets Desk</p>
                  <a href={SITE.phoneHref} className="text-[#5B6470] hover:text-[#0F2A43]">
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#C8963E] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#0F2A43]">Direct Email</p>
                  <a
                    href={`mailto:${SITE.eventsEmail}`}
                    className="text-[#5B6470] hover:text-[#0F2A43] break-all"
                  >
                    {SITE.eventsEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C8963E] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#0F2A43]">{SITE.hotelName}</p>
                  <p className="text-[#5B6470]">{SITE.fullAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Enquiry form */}
          <div className="lg:col-span-7">
            <div className="rounded-[16px] bg-white border border-[#E7E2D9] p-6 md:p-8 shadow-sm">
              {submitted ? (
                <div className="py-6 space-y-4" role="status" aria-live="polite">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#2E7D5B]/15 text-[#2E7D5B]">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="type-h3 text-[#0F2A43]">Enquiry Received</h3>
                  <p className="text-base text-[#1B1F24] leading-relaxed">{submitted.message}</p>
                  <p className="text-sm text-[#5B6470] tabular-nums">
                    Reference ID: <strong className="text-[#0F2A43]">{submitted.reference}</strong>
                  </p>
                  <div className="pt-2">
                    <ActionButton
                      variant="ghost"
                      label="Send Another Enquiry"
                      onClick={() => setSubmitted(null)}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="enq-name"
                        className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="enq-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'enq-name-err' : undefined}
                        placeholder="e.g. Meera Singhania"
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-4 text-base text-[#1B1F24] focus:border-[#0F2A43] focus:bg-white"
                      />
                      {errors.name && (
                        <p id="enq-name-err" className="mt-1.5 text-xs text-[#C0392B]">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enq-email"
                        className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="enq-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'enq-email-err' : undefined}
                        placeholder="you@domain.com"
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-4 text-base text-[#1B1F24] focus:border-[#0F2A43] focus:bg-white"
                      />
                      {errors.email && (
                        <p id="enq-email-err" className="mt-1.5 text-xs text-[#C0392B]">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label
                        htmlFor="enq-phone"
                        className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="enq-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'enq-phone-err' : undefined}
                        placeholder="+91 98200 11223"
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-4 text-base text-[#1B1F24] focus:border-[#0F2A43] focus:bg-white"
                      />
                      {errors.phone && (
                        <p id="enq-phone-err" className="mt-1.5 text-xs text-[#C0392B]">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enq-date"
                        className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                      >
                        Preferred Date
                      </label>
                      <input
                        id="enq-date"
                        type="date"
                        min={getTodayLocalDateStr()}
                        value={form.eventDate}
                        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                        aria-invalid={Boolean(errors.eventDate)}
                        aria-describedby={errors.eventDate ? 'enq-date-err' : undefined}
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-4 text-base text-[#1B1F24] focus:border-[#0F2A43] focus:bg-white"
                      />
                      {errors.eventDate && (
                        <p id="enq-date-err" className="mt-1.5 text-xs text-[#C0392B]">
                          {errors.eventDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enq-type"
                        className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                      >
                        Enquiry Type *
                      </label>
                      <select
                        id="enq-type"
                        value={form.eventType}
                        onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                        aria-invalid={Boolean(errors.eventType)}
                        className="h-12 w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 px-3 text-base text-[#1B1F24] focus:border-[#0F2A43] focus:bg-white"
                      >
                        {ENQUIRY_EVENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enq-message"
                      className="block text-sm font-medium text-[#1B1F24] mb-1.5"
                    >
                      Celebration or Stay Details *
                    </label>
                    <textarea
                      id="enq-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'enq-msg-err' : undefined}
                      placeholder="Estimated guest count, preferred hall or lawn, or suite requirements..."
                      className="w-full rounded-[12px] border border-[#E7E2D9] bg-[#FAF7F2]/60 p-4 text-base text-[#1B1F24] focus:border-[#0F2A43] focus:bg-white"
                    />
                    {errors.message && (
                      <p id="enq-msg-err" className="mt-1.5 text-xs text-[#C0392B]">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p role="alert" className="text-sm text-[#C0392B]">
                      {submitError}
                    </p>
                  )}

                  <div className="pt-1">
                    <ActionButton
                      type="submit"
                      variant="primary"
                      label={submitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
                      showArrow={!submitting}
                      disabled={submitting}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
