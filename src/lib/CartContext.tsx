import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { PRODUCTS } from './content'

type Product = (typeof PRODUCTS)[number]
export type CartItem = { id: Product['id']; qty: number }

type State = { items: CartItem[] }
type Action =
  | { type: 'add'; id: Product['id']; qty?: number }
  | { type: 'remove'; id: Product['id'] }
  | { type: 'setQty'; id: Product['id']; qty: number }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] }

const STORAGE_KEY = 'jupyterlabs.cart.v1'

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const qty = action.qty ?? 1
      const existing = state.items.find((i) => i.id === action.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.id ? { ...i, qty: i.qty + qty } : i,
          ),
        }
      }
      return { items: [...state.items, { id: action.id, qty }] }
    }
    case 'remove':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'setQty':
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: action.qty } : i,
        ),
      }
    case 'clear':
      return { items: [] }
    case 'hydrate':
      return { items: action.items }
  }
}

type CartCtx = {
  items: CartItem[]
  count: number
  subtotal: number
  add: (id: Product['id'], qty?: number) => void
  remove: (id: Product['id']) => void
  setQty: (id: Product['id'], qty: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CartItem[]
      const valid = parsed.filter((i) => PRODUCTS.some((p) => p.id === i.id))
      if (valid.length) dispatch({ type: 'hydrate', items: valid })
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const value = useMemo<CartCtx>(() => {
    const count = state.items.reduce((s, i) => s + i.qty, 0)
    const subtotal = state.items.reduce((s, i) => {
      const p = PRODUCTS.find((p) => p.id === i.id)
      return s + (p ? p.price * i.qty : 0)
    }, 0)
    return {
      items: state.items,
      count,
      subtotal,
      add: (id, qty) => dispatch({ type: 'add', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state.items])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useCart must be used inside CartProvider')
  return v
}

export function formatPrice(amount: number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}
