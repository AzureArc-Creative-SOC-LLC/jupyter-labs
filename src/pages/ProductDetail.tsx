import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/sections/Footer'
import { PRODUCTS } from '../lib/content'
import { useCart, formatPrice } from '../lib/CartContext'
import { useSeo, SITE_URL } from '../lib/useSeo'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { add } = useCart()

  const product = useMemo(() => PRODUCTS.find((p) => p.slug === slug), [slug])
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
    setActive(0)
    setQty(1)
  }, [slug])

  useSeo(
    product
      ? {
          title: `${product.name} — ${product.category} | Jupyter Labs`,
          description: product.longDesc,
          path: `/products/${product.slug}`,
          image: SITE_URL + product.image,
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              image: SITE_URL + product.image,
              description: product.longDesc,
              category: product.category,
              brand: { '@type': 'Brand', name: 'Jupyter Labs' },
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: product.currency,
                availability: 'https://schema.org/InStock',
                url: `${SITE_URL}/products/${product.slug}`,
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
                { '@type': 'ListItem', position: 2, name: 'Shop', item: SITE_URL + '/#products' },
                { '@type': 'ListItem', position: 3, name: product.name },
              ],
            },
          ],
        }
      : { title: 'Product not found — Jupyter Labs', path: '/products', noindex: true },
  )

  if (!product) {
    return (
      <>
        <Navbar />
        <main id="main-content" className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.32em] text-muted">404</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Product not found</h1>
          <Link to="/#products" className="mt-8 rounded-full bg-accent-dark px-6 py-3 text-sm text-bg">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3)

  function addToCart() {
    add(product!.id, qty)
    navigate('/cart')
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-10 bg-bg pt-28 lg:pt-32">
        <div className="container-x">
          <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/#products" className="hover:text-ink">Shop</Link>
            <span>/</span>
            <span className="text-ink">{product.name}</span>
          </nav>

          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* Gallery */}
            <div className="flex flex-col gap-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl2)]">
                <img
                  src={product.gallery[active]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
                />
                <span className="absolute left-4 top-4 rounded-full bg-bg/95 px-3 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-ink backdrop-blur-md">
                  {product.category}
                </span>
              </div>
              <div className="-mt-10 flex flex-wrap justify-center gap-2 sm:-mt-20 sm:gap-3">
                {product.gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all sm:h-24 sm:w-24 lg:h-28 lg:w-28 ${
                      active === i ? 'ring-2 ring-accent-dark ring-offset-2 ring-offset-bg' : 'opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt="" className="absolute inset-0 h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky info */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-dark">{product.tagline}</p>
              <h1 className="mt-3 font-display text-4xl tracking-[-0.02em] text-ink lg:text-5xl">{product.name}</h1>
              <p className="mt-4 font-display text-3xl text-ink">{formatPrice(product.price, product.currency)}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {['99%+ Purity', 'Janoshik Tested', 'Cold Chain', 'R&D Only'].map((b) => (
                  <span key={b} className="rounded-full border border-line bg-section px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                    {b}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted">{product.longDesc}</p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-6">
                {product.specs.map((s) => (
                  <div key={s.k}>
                    <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">{s.k}</dt>
                    <dd className="mt-1 text-sm text-ink">{s.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap items-stretch gap-3">
                <div className="flex shrink-0 items-center rounded-full border border-line">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-12 w-12 place-items-center text-ink hover:text-accent-dark"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-12 w-12 place-items-center text-ink hover:text-accent-dark"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  className="min-h-12 flex-1 whitespace-nowrap rounded-full bg-accent-dark px-6 py-3 text-sm font-medium text-bg transition-all hover:bg-accent hover:shadow-[0_20px_40px_-20px_rgba(15,118,110,0.6)]"
                >
                  Add to Cart · {formatPrice(product.price * qty, product.currency)}
                </button>
              </div>

              <Link to="/cart" className="mt-4 inline-flex items-center gap-2 text-sm text-accent-dark hover:text-accent">
                View Cart →
              </Link>
            </div>
          </div>

          {/* Related */}
          <section className="mt-24 border-t border-line pt-16 lg:mt-32">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl tracking-[-0.02em] text-ink lg:text-3xl">Related research</h2>
              <Link to="/#products" className="text-sm text-accent-dark hover:text-accent">View all →</Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl2)] border border-line bg-card transition-all hover:-translate-y-1 hover:border-accent-dark/30"
                >
                  <div className="relative aspect-[5/4] overflow-hidden bg-section">
                    <img src={p.image} alt={p.name} className="absolute inset-0 h-full w-full scale-[0.95] object-contain transition-transform duration-700 group-hover:scale-100" />
                  </div>
                  <div className="p-5">
                    <p className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">{p.category}</p>
                    <h3 className="mt-2 font-display text-lg text-ink">{p.name}</h3>
                    <p className="mt-2 text-sm text-accent-dark">{formatPrice(p.price, p.currency)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
