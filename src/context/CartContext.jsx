/* oxlint-disable react(only-export-components) */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)) }, [cart])
  const value = useMemo(() => ({
    cart,
    count: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    add(product) { setCart((items) => { const found = items.find((item) => item.product_id === product.id); return found ? items.map((item) => item.product_id === product.id ? { ...item, quantity: Math.min(1000, item.quantity + 1) } : item) : [...items, { product_id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1 }] }) },
    update(productId, quantity) { setCart((items) => items.map((item) => item.product_id === productId ? { ...item, quantity: Math.max(1, Math.min(1000, Number(quantity) || 1)) } : item)) },
    remove(productId) { setCart((items) => items.filter((item) => item.product_id !== productId)) },
    clear() { setCart([]) },
  }), [cart])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
