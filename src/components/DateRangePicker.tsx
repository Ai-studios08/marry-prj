import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  diffNights,
  formatDisplayDate,
  formatLocalDate,
  getTodayLocalDateStr,
  MAX_STAY_NIGHTS,
  parseLocalDate,
} from '../lib/booking';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  soldOutDates?: Set<string>;
  onChange: (nextCheckIn: string, nextCheckOut: string) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getMonthDays(year: number, monthIndex: number): (Date | null)[] {
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay();
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(year, monthIndex, d));
  }
  return cells;
}

export function DateRangePicker({
  checkIn,
  checkOut,
  soldOutDates,
  onChange,
}: DateRangePickerProps) {
  const todayStr = getTodayLocalDateStr();
  const initialBase = parseLocalDate(checkIn) ?? new Date();
  const [viewYear, setViewYear] = useState(initialBase.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialBase.getMonth());
  const [selectingStep, setSelectingStep] = useState<'checkIn' | 'checkOut'>('checkIn');

  const todayDate = parseLocalDate(todayStr)!;
  const canGoPrev =
    viewYear > todayDate.getFullYear() ||
    (viewYear === todayDate.getFullYear() && viewMonth > todayDate.getMonth());

  const months = useMemo(() => {
    const secondMonth = (viewMonth + 1) % 12;
    const secondYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    return [
      { year: viewYear, month: viewMonth },
      { year: secondYear, month: secondMonth },
    ];
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (dateStr: string) => {
    if (dateStr < todayStr) return;

    if (selectingStep === 'checkIn') {
      if (soldOutDates?.has(dateStr)) return;
      const nights = diffNights(dateStr, checkOut);
      if (nights >= 1 && nights <= MAX_STAY_NIGHTS) {
        onChange(dateStr, checkOut);
      } else {
        const nextDt = parseLocalDate(dateStr)!;
        nextDt.setDate(nextDt.getDate() + 1);
        onChange(dateStr, formatLocalDate(nextDt));
      }
      setSelectingStep('checkOut');
      return;
    }

    // Selecting checkOut
    if (dateStr <= checkIn) {
      if (soldOutDates?.has(dateStr)) return;
      const nextDt = parseLocalDate(dateStr)!;
      nextDt.setDate(nextDt.getDate() + 1);
      onChange(dateStr, formatLocalDate(nextDt));
      setSelectingStep('checkOut');
      return;
    }

    const nights = diffNights(checkIn, dateStr);
    if (nights > MAX_STAY_NIGHTS) {
      return;
    }
    onChange(checkIn, dateStr);
    setSelectingStep('checkIn');
  };

  return (
    <div className="rounded-[16px] bg-white border border-[#E7E2D9] p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E7E2D9]">
        <div className="text-sm text-[#5B6470]">
          <span className="font-medium text-[#1B1F24]">
            {selectingStep === 'checkIn' ? 'Select check-in date' : 'Select check-out date'}
          </span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>
            {formatDisplayDate(checkIn)} → {formatDisplayDate(checkOut)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#E7E2D9] text-[#0F2A43] hover:bg-[#FAF7F2] disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#E7E2D9] text-[#0F2A43] hover:bg-[#FAF7F2] cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-8">
        {months.map(({ year, month }, idx) => {
          const monthLabel = new Date(year, month, 1).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
          });
          const cells = getMonthDays(year, month);

          return (
            <div key={`${year}-${month}`} className={idx === 1 ? 'hidden md:block' : ''}>
              <h3 className="font-serif text-lg font-medium text-[#0F2A43] text-center mb-3">
                {monthLabel}
              </h3>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#5B6470] mb-1">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((dt, cIdx) => {
                  if (!dt) {
                    return <div key={`empty-${cIdx}`} className="h-10" />;
                  }
                  const dateStr = formatLocalDate(dt);
                  const isPast = dateStr < todayStr;
                  const isSoldOut = Boolean(soldOutDates?.has(dateStr));
                  const isCheckIn = dateStr === checkIn;
                  const isCheckOut = dateStr === checkOut;
                  const isInRange = dateStr > checkIn && dateStr < checkOut;
                  const exceedsMaxStay =
                    selectingStep === 'checkOut' &&
                    dateStr > checkIn &&
                    diffNights(checkIn, dateStr) > MAX_STAY_NIGHTS;

                  const disabled =
                    isPast ||
                    exceedsMaxStay ||
                    (selectingStep === 'checkIn' && isSoldOut);

                  let cellClass =
                    'h-10 w-full rounded-[10px] text-sm font-medium tabular-nums transition-colors flex items-center justify-center ';
                  if (isCheckIn || isCheckOut) {
                    cellClass += 'bg-[#0F2A43] text-white font-semibold ';
                  } else if (isInRange) {
                    cellClass += 'bg-[#C8963E]/20 text-[#0F2A43] ';
                  } else if (isSoldOut) {
                    cellClass += 'bg-[#FAF7F2] text-[#C0392B]/70 line-through ';
                  } else if (disabled) {
                    cellClass += 'text-[#5B6470]/35 ';
                  } else {
                    cellClass += 'text-[#1B1F24] hover:bg-[#FAF7F2] cursor-pointer ';
                  }

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleDayClick(dateStr)}
                      aria-label={`${formatDisplayDate(dateStr)}${isSoldOut ? ' (Sold out)' : ''}`}
                      aria-pressed={isCheckIn || isCheckOut}
                      className={cellClass}
                    >
                      {dt.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-[#E7E2D9] flex flex-wrap items-center gap-5 text-xs text-[#5B6470]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded bg-[#0F2A43]" aria-hidden="true" />
          Selected check-in / check-out
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded bg-[#C8963E]/30" aria-hidden="true" />
          Stay nights
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="line-through text-[#C0392B]/80 font-medium">12</span>
          Sold out across all suites
        </span>
      </div>
    </div>
  );
}
