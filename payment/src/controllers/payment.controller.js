const paymentModel = require("../models/payment.models");
const axios = require("axios");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
async function createPayment(req, res) {
  const token = req.cookies?.token || req.header?.authorization?.split(" ")[1];
  try {
    const orderId = req.params.orderId;
    const response = await axios.get(
      "http://localhost:3003/api/orders/" + orderId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.order.totalPrice);
    const price = response.data.order.totalPrice;

    const order = await razorpay.orders.create(price);

    const payment = await paymentModel.create({
      order: orderId,
      orderId: order.id,
      user: req.user.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
    });

    res.status(201).json({
      message: "Payment Initiated",
      payment: payment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function verifyPayment(req, res) {
  const { razorpayOrderId, paymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  try {
    const {
      validatePaymentVerification,
    } = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const result = validatePaymentVerification(
      { order_id: razorpayOrderId,
         payment_id: razorpayPaymentId },
      signature,secret
    );
    if (result) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId, status: "PENDING" });
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "COMPLETED";
      await payment.save();
      res.json({ status: "success" });
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error verifying payment");
  }
}

module.exports = { createPayment, verifyPayment };
