import type { ReactNode } from 'react'
import Magnetic from './Magnetic'

interface Props {
  children: ReactNode
  href?: string
  variant?: 'solid' | 'outline' | 'ghost'
  className?: string
  onClick?: () => void
}

/** Premium magnetic CTA with a sliding fill on hover. */
export default function Button({
  children,
  href = '#',
  variant = 'solid',
  className = '',
  onClick,
}: Props) {
  const base =
    'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-5 py-2 text-sm font-medium leading-none tracking-[-0.02em] transition-colors duration-500'
  const styles =
    variant === 'solid'
      ? 'bg-accent-dark text-bg'
      : variant === 'outline'
        ? 'border border-ink/25 text-ink hover:text-bg'
        : 'text-ink hover:text-accent-dark'

  const fill =
    variant === 'solid'
      ? 'bg-accent'
      : variant === 'outline'
        ? 'bg-accent-dark'
        : ''

  return (
    <Magnetic strength={0.35}>
      <a href={href} onClick={onClick} className={`${base} ${styles} ${className}`}>
        {variant !== 'ghost' && (
          <span
            className={`absolute inset-0 -z-0 translate-y-[101%] rounded-full ${fill} transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0`}
          />
        )}
        <span className="relative z-10 flex items-center gap-3">
          {children}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 group-hover:translate-x-1">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </Magnetic>
  )
}
