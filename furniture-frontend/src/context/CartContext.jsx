import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  mergeCart as apiMergeCart,
} from '../services/api';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart';

function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function CartProvider({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate total from items
  const calcTotal = (items) => items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);

  // Fetch cart — from API if authenticated, from localStorage if guest
  const fetchCart = useCallback(async () => {
    if (isAdmin) return;
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await apiGetCart();
        const items = res.data.items || [];
        setCartItems(items);
        setTotalAmount(res.data.totalAmount || 0);
      } else {
        const items = getGuestCart();
        setCartItems(items);
        setTotalAmount(calcTotal(items));
      }
    } catch {
      // If API fails for authenticated user, fall back silently
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      // Authenticated: use API
      await apiAddToCart({ productId: product.id, quantity });
      await fetchCart();
    } else {
      // Guest: use localStorage
      const items = getGuestCart();
      const existing = items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.imagePath || null,
          quantity,
        });
      }
      saveGuestCart(items);
      setCartItems([...items]);
      setTotalAmount(calcTotal(items));
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, productId, newQuantity) => {
    if (newQuantity <= 0) return;
    if (isAuthenticated) {
      await apiUpdateCartItem(itemId, newQuantity);
      await fetchCart();
    } else {
      const items = getGuestCart();
      const item = items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = newQuantity;
        saveGuestCart(items);
        setCartItems([...items]);
        setTotalAmount(calcTotal(items));
      }
    }
  };

  // Remove item
  const removeItem = async (itemId, productId) => {
    if (isAuthenticated) {
      await apiRemoveCartItem(itemId);
      await fetchCart();
    } else {
      let items = getGuestCart();
      items = items.filter((i) => i.productId !== productId);
      saveGuestCart(items);
      setCartItems([...items]);
      setTotalAmount(calcTotal(items));
    }
  };

  // Clear cart
  const clearCartAll = async () => {
    if (isAuthenticated) {
      await apiClearCart();
      await fetchCart();
    } else {
      clearGuestCart();
      setCartItems([]);
      setTotalAmount(0);
    }
  };

  // Sync guest cart → backend after login
  const syncCartAfterLogin = async () => {
    const guestItems = getGuestCart();
    if (guestItems.length > 0) {
      try {
        const mergePayload = guestItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));
        await apiMergeCart(mergePayload);
      } catch {
        // Merge failed, items will still be in backend if user had some
      }
      clearGuestCart();
    }
    // Refresh cart from backend
    const res = await apiGetCart();
    const items = res.data.items || [];
    setCartItems(items);
    setTotalAmount(res.data.totalAmount || 0);
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalAmount,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clearCartAll,
        syncCartAfterLogin,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
