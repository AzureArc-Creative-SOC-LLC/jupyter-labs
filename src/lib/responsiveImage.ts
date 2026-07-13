import { IMAGE_WIDTHS } from './imageManifest'

/** Widest variant we generate; also the width of the base file itself. */
export const BASE_WIDTH = 2048

/**
 * Builds a srcset for an image in public/images, using only the variants that
 * actually exist on disk (see imageManifest.ts). Returns undefined when the
 * image has no variants, so callers can spread the result and get a plain
 * <img> with no dangling srcset.
 *
 *   <img src={src} {...responsive(src, '(min-width: 1024px) 33vw, 100vw')} />
 */
export function responsive(src: string, sizes: string): { srcSet?: string; sizes?: string } {
  const widths = IMAGE_WIDTHS[src]
  if (!widths?.length) return {}

  const base = src.replace(/\.webp$/, '')
  const srcSet = widths
    .map((w) => `${base}-${w}.webp ${w}w`)
    .concat(`${src} ${BASE_WIDTH}w`)
    .join(', ')

  return { srcSet, sizes }
}
