import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  /** brand gradient shown while loading / on error */
  fallback?: string
  sizes?: string
  eager?: boolean
}

/**
 * Image with blur-up load-in and a graceful on-brand gradient fallback so the
 * UI never shows a broken asset. Lazy + async by default.
 */
export default function Img({
  src,
  alt,
  className = '',
  fallback = 'linear-gradient(135deg,#e7ede9,#cfc8b6)',
  eager = false,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <span className={`relative block overflow-hidden ${className}`} style={{ background: fallback }}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-[opacity,transform,filter] duration-[1200ms] ease-out ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-105'
          }`}
        />
      )}
      {failed && (
        <span className="absolute inset-0 grid place-items-center text-accent-dark/40">
          <span className="inline-flex items-center gap-2 font-display">
            <span className="text-2xl font-semibold lowercase tracking-[-0.05em]" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
              <span className="italic text-accent-dark">j</span>upyter
            </span>
            <span className="h-5 w-px bg-accent-dark/40" />
            <span className="text-[0.65rem] uppercase tracking-[0.32em]">Labs</span>
          </span>
        </span>
      )}
    </span>
  )
}
