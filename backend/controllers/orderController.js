import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// ================= GLOBAL =================
const currency = "inr";
const DeliveryCharge = 10;

// ================= PAYMENT INIT =================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= HELPERS =================
const isAddressValid = (address) => {
  const fields = [
    "name",
    "phone",
    "house",
    "area",
    "city",
    "state",
    "pincode",
  ];
  return fields.every((f) => address?.[f]);
};

// ================= PLACE ORDER (COD) =================
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items?.length || !amount) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    if (!isAddressValid(address)) {
      return res.json({
        success: false,
        message: "Complete address is required",
      });
    }

    const newOrder = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= STRIPE ORDER =================
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!isAddressValid(address)) {
      return res.json({ success: false, message: "Address required" });
    }

    const order = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      status: "Pending",
      date: Date.now(),
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name || "Product" },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: DeliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= VERIFY STRIPE =================
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed",
      });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= RAZORPAY =================
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!isAddressValid(address)) {
      return res.json({ success: false, message: "Address required" });
    }

    const order = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Pending",
      date: Date.now(),
    });

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: order._id.toString(),
    });

    res.json({ success: true, order: razorpayOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= VERIFY RAZORPAY =================
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, userId } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(
      razorpay_order_id
    );

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
        status: "Order Placed",
      });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true });
    }

    res.json({ success: false, message: "Payment failed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= USER ORDERS =================
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= CANCEL ORDER =================
const cancelOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (order.payment === true) {
      return res.json({
        success: false,
        message: "Paid orders cannot be cancelled",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= ADMIN =================
const allOrders = async (req, res) => {
  const orders = await orderModel.find({});
  res.json({ success: true, orders });
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  await orderModel.findByIdAndUpdate(orderId, { status });
  res.json({ success: true });
};

// ================= EXPORT =================
export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  userOrders,
  cancelOrder,
  allOrders,
  updateStatus,
};
