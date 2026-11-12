import { useEffect, useRef } from 'react';

type ObserverCallback = (entry: IntersectionObserverEntry) => void;

const listeners = new WeakMap<Element, ObserverCallback>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = listeners.get(entry.target);
            if (cb) {
              cb(entry);
              listeners.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      }
    );
  }
  return sharedObserver;
}

/**
 * Shared IntersectionObserver reveal hook.
 * Animates once (adds 'is-revealed' class) and immediately unobserves the target.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delayMs: number = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delayMs > 0) {
      el.style.setProperty('--reveal-delay', `${delayMs}ms`);
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = getSharedObserver();
    if (prefersReduced || !observer) {
      el.classList.add('is-revealed');
      return;
    }

    listeners.set(el, () => {
      el.classList.add('is-revealed');
    });
    observer.observe(el);

    return () => {
      listeners.delete(el);
      observer.unobserve(el);
    };
  }, [delayMs]);

  return ref;
}
