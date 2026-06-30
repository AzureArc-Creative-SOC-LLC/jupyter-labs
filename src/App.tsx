import { useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { useSeo } from './lib/useSeo'

import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Botanicals from './components/Botanicals'

import Hero from './components/sections/Hero'
import Difference from './components/sections/Difference'
import Craft from './components/sections/Craft'
import Marquee from './components/sections/Marquee'
import Products from './components/sections/Products'
import Science from './components/sections/Science'
import Benefits from './components/sections/Benefits'
import Lifestyle from './components/sections/Lifestyle'
import Testimonials from './components/sections/Testimonials'
import WhyChoose from './components/sections/WhyChoose'
import About from './components/sections/About'
import CTA from './components/sections/CTA'
import Footer from './components/sections/Footer'

function App() {
  const [ready, setReady] = useState(false)

  useSeo({
    title: 'Jupyter Labs — HPLC-Verified Research-Grade Peptides',
    description:
      'Research-grade peptides — HPLC-verified for purity, traceable to the lot, and documented to the milligram. For laboratory R&D use only.',
    path: '/',
  })

  // Refresh ScrollTrigger once the preloader releases & layout settles.
  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => clearTimeout(id)
  }, [ready])

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Botanicals />
      <Navbar />

      <main id="main-content" className="relative z-10">
        <Hero />
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
      </main>

      <Footer />
    </>
  )
}

export default App
