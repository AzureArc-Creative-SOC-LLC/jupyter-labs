import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './lib/CartContext.tsx'
import { AuthProvider } from './lib/AuthContext.tsx'

// Code-split secondary routes so the landing page ships the smallest possible
// initial bundle. The homepage (App) stays eager to protect its LCP.
const ProductDetail = lazy(() => import('./pages/ProductDetail.tsx'))
const Cart = lazy(() => import('./pages/Cart.tsx'))
const Checkout = lazy(() => import('./pages/Checkout.tsx'))
const OrderTracking = lazy(() => import('./pages/OrderTracking.tsx'))
const SignIn = lazy(() => import('./pages/SignIn.tsx'))
const Register = lazy(() => import('./pages/Register.tsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.tsx'))

function RouteFallback() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-bg"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent-dark" />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <a
            href="#main-content"
            className="sr-only z-[100] rounded-full bg-accent-dark px-5 py-3 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track" element={<OrderTracking />} />
              <Route path="/track/:orderNumber" element={<OrderTracking />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
