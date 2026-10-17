// Photo lookup (build time). Your own photo in assets/photos wins over the stand-in in assets/stock.
import manifest from '../data/images.generated.json';
import { fallbackPhotos } from '../data/site';
import { KENYA_W, KENYA_H } from '../data/kenya';

interface Entry { w: number; h: number; widths: number[] }
export interface Photo extends Entry { key: string; own: boolean }

const m = manifest as Record<string, Entry>;

export function resolvePhoto(name: string): Photo | undefined {
  const own = m[`own:${name}`];
  if (own) return { key: `own-${name}`, own: true, ...own };
  const stock = fallbackPhotos[name];
  const entry = stock ? m[`stock:${stock}`] : undefined;
  return entry ? { key: `stock-${stock}`, own: false, ...entry } : undefined;
}

export const imageUrl = (p: Photo, width: number) => `/img/${p.key}-${width}.webp`;
export const pickWidth = (p: Photo, want: number) => p.widths.find((w) => w >= want) ?? p.widths[p.widths.length - 1];
export const srcset = (p: Photo) => p.widths.map((w) => `${imageUrl(p, w)} ${w}w`).join(', ');

/** URL of one size, for CSS backgrounds and SVG images. */
export function photoUrl(name: string, want = 1600): string {
  const p = resolvePhoto(name);
  return p ? imageUrl(p, pickWidth(p, want)) : '';
}

export const hasOwnPhoto = (name: string) => Boolean(m[`own:${name}`]);

/** Slideshow photos: your own bg-*.jpg files if present, otherwise the stand-ins. */
export function bgSlides(max = 8, want = 1600): string[] {
  const own = Object.keys(m).filter((k) => k.startsWith('own:bg-')).sort().slice(0, max);
  return own.length
    ? own.map((k) => photoUrl(k.slice(4), want))
    : ['bg-1', 'bg-2', 'bg-3', 'bg-4'].map((n) => photoUrl(n, want));
}

export const galleryNames = (count: number) => Array.from({ length: count }, (_, i) => `gallery-${i + 1}`);

/** Where each stand-in portrait sits inside the 400 x 510 map box so that a face lands mid-country. */
const STAND_IN_PLACEMENT: Record<string, { x: number; y: number; w: number; h: number }> = {
  'kenya-portrait': { x: -222, y: -50, w: 704, h: 560 },
  'kenya-portrait-2': { x: 0, y: -250, w: 800, h: 1000 },
};

/**
 * Portraits that fill the outline of Kenya and take turns. Your own photos (kenya-portrait, kenya-portrait-2 ... -4 in
 * assets/photos) are scaled to cover the map, centred. Without any, two stand-ins are placed by hand.
 */
export function kenyaPortraits() {
  const own = ['kenya-portrait', 'kenya-portrait-2', 'kenya-portrait-3', 'kenya-portrait-4'].filter(hasOwnPhoto);
  if (own.length) {
    return own.map((n) => ({ src: photoUrl(n, 1200), img: { x: 0, y: 0, w: KENYA_W, h: KENYA_H, par: 'xMidYMid slice' } }));
  }
  return ['kenya-portrait', 'kenya-portrait-2'].map((n) => ({ src: photoUrl(n, 1200), img: { ...STAND_IN_PLACEMENT[n], par: 'xMidYMid slice' } }));
}
