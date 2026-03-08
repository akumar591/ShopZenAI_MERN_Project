import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= TOKEN (FULLY REACTIVE FIX) ================= */
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  // 🔥 handles login/logout in SAME TAB also
  const syncToken = () => {
    setToken(localStorage.getItem("token"));
  };

  useEffect(() => {
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/cart/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const cartData = res.data.cartData || {};
        const items = [];

        Object.keys(cartData).forEach((productId) => {
          Object.keys(cartData[productId]).forEach((size) => {
            items.push({
              productId,
              size,
              qty: cartData[productId][size],
            });
          });
        });

        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Fetch cart failed", err.response?.data);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEAR CART (NEW ✅) ================= */
  const clearCart = () => {
    setCartItems([]);
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (productId, size, qty = 1) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          itemId: productId,
          size,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Add to cart failed", err.response?.data);
    }
  };

  /* ================= UPDATE CART ================= */
  const updateCart = async (productId, size, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.post(
        "http://localhost:5000/api/cart/update",
        { itemId: productId, size, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Update cart failed", err.response?.data);
    }
  };

  /* ================= REMOVE FROM CART ================= */
  const removeFromCart = async (productId, size) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/update",
        { itemId: productId, size, quantity: 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Remove failed", err.response?.data);
    }
  };

  /* ================= AUTO FETCH ================= */
  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateCart,
        removeFromCart,
        fetchCart,  // ✅ exported
        clearCart,  // ✅ NEW
        syncToken,  // optional
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
