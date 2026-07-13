import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'

import Difference from './sections/Difference'
import Craft from './sections/Craft'
import Marquee from './sections/Marquee'
import Products from './sections/Products'
import Science from './sections/Science'
import Benefits from './sections/Benefits'
import Lifestyle from './sections/Lifestyle'
import Testimonials from './sections/Testimonials'
import WhyChoose from './sections/WhyChoose'
import About from './sections/About'
import CTA from './sections/CTA'

/**
 * Every section below the hero, in one lazily-loaded chunk.
 *
 * None of this is on screen at first paint, but bundling it with the hero meant
 * the browser had to download, parse and execute all of it before React could
 * render anything — which is what LCP was actually waiting on. Splitting it out
 * lets the hero paint on a much smaller bundle; this chunk then streams in
 * behind it, well before a user can scroll to it.
 *
 * Order is unchanged from the original single-file App.
 */
export default function BelowFold() {
  // This chunk resolves asynchronously, so it can land after App's own refresh
  // has already run. Re-measure once the sections are actually in the DOM, or
  // every ScrollTrigger below the hero binds to stale offsets.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      <Difference />
      <Craft />
      <Marquee />
      <About />
      <Products />
      <Science />
      <Benefits />
      <Lifestyle />
      <Testimonials />
      <WhyChoose />
      <CTA />
    </>
  )
}
