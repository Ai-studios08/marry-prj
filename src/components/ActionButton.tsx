import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'gold' | 'ghost' | 'ghost-light';

interface BaseProps {
  variant?: Variant;
  label: string;
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'btn-primary-sweep bg-[#0F2A43] text-white hover:text-[#0F2A43] border border-[#0F2A43]',
  gold:
    'btn-gold-shimmer bg-[#C8963E] text-[#0F2A43] font-semibold border border-[#C8963E] hover:bg-[#d4a34d]',
  ghost:
    'bg-transparent text-[#0F2A43] border border-[#E7E2D9] hover:border-[#0F2A43] hover:bg-white/70',
  'ghost-light':
    'bg-transparent text-white border border-white/45 hover:border-white hover:bg-white/10',
};

function ButtonContent({ label, showArrow }: { label: string; showArrow?: boolean }) {
  return (
    <span className="relative z-10 inline-flex items-center justify-center gap-2.5 whitespace-nowrap">
      <span>{label}</span>
      {showArrow && <ArrowRight className="btn-arrow h-4 w-4 shrink-0" aria-hidden="true" />}
    </span>
  );
}

const BASE_CLASS =
  'btn-motion relative overflow-hidden inline-flex items-center justify-center h-12 px-6 rounded-[12px] text-[15px] font-medium tracking-[0.01em] whitespace-nowrap shrink-0 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none';

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    to?: undefined;
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<LinkProps, 'children'> & {
    to: string;
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    href: string;
    to?: undefined;
  };

export type ActionButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export function ActionButton(props: ActionButtonProps) {
  const {
    variant = 'primary',
    label,
    showArrow = false,
    className = '',
    fullWidth = false,
    ...rest
  } = props;

  const classes = `${BASE_CLASS} ${VARIANT_CLASSES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`.trim();

  if ('to' in props && props.to !== undefined) {
    const { to, ...linkRest } = rest as Omit<LinkProps, 'children'>;
    return (
      <Link to={to} className={classes} {...linkRest}>
        <ButtonContent label={label} showArrow={showArrow} />
      </Link>
    );
  }

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        <ButtonContent label={label} showArrow={showArrow} />
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest}>
      <ButtonContent label={label} showArrow={showArrow} />
    </button>
  );
}

export function SectionEyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`text-[13px] font-medium tracking-[0.14em] uppercase ${
        light ? 'text-[#C8963E]' : 'text-[#8C6421]'
      }`}
    >
      {children}
    </p>
  );
}
