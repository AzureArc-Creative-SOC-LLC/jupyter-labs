import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Premium default ease used across the experience.
export const LUX = 'power3.out'
export const EXPO = 'expo.out'

export { gsap, ScrollTrigger }
