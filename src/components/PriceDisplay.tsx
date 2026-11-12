import { formatINRNumber } from '../lib/booking';

interface PriceDisplayProps {
  amount: number;
  className?: string;
}

export function PriceDisplay({ amount, className = '' }: PriceDisplayProps) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap tabular-nums ${className}`}>
      <span className="font-sans font-normal mr-[0.16em]">₹</span>
      <span>{formatINRNumber(amount)}</span>
    </span>
  );
}
