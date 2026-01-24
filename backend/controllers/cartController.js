import userModel from "../models/userModel.js";

/* =========================
   ADD PRODUCT TO CART
========================= */
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // 🔥 from auth middleware
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "itemId and size are required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🛒 ensure cartData exists
    if (!user.cartData) {
      user.cartData = {};
    }

    // 🧱 ensure product exists
    if (!user.cartData[itemId]) {
      user.cartData[itemId] = {};
    }

    // ➕ increase quantity
    user.cartData[itemId][size] =
      (user.cartData[itemId][size] || 0) + 1;

    // 🔥 CRITICAL FOR MONGOOSE
    user.markModified("cartData");

    await user.save();

    res.json({
      success: true,
      message: "Product added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE CART ITEM QTY
========================= */
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size, quantity } = req.body;

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "itemId, size and quantity required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user || !user.cartData) {
      return res.status(404).json({
        success: false,
        message: "User or cart not found",
      });
    }

    // ❌ item not exists
    if (
      !user.cartData[itemId] ||
      user.cartData[itemId][size] === undefined
    ) {
      return res.json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // 🗑️ remove item if qty <= 0
    if (quantity <= 0) {
      delete user.cartData[itemId][size];

      // remove product if no sizes left
      if (Object.keys(user.cartData[itemId]).length === 0) {
        delete user.cartData[itemId];
      }
    } else {
      user.cartData[itemId][size] = quantity;
    }

    // 🔥 MUST
    user.markModified("cartData");

    await user.save();

    res.json({
      success: true,
      message: "Cart updated",
      cartData: user.cartData,
    });
  } catch (error) {
    console.log("UPDATE CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET USER CART
========================= */
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addToCart, updateCart, getUserCart };
