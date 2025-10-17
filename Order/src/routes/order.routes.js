const express = require("express");
const router = express.Router();
const { CreateOrder, getMyOrder, cancelOrderById, updateOrderAddress, getOrderById } = require("../controllers/order.controller");
const createAuthMiddleware = require("../../../payment/src/middlewares/auth.middlewares");

router.post("/", createAuthMiddleware(["user"]), CreateOrder);
router.get("/me", createAuthMiddleware(["user"]), getMyOrder);
router.post("/:id/cancel", createAuthMiddleware([ "user" ]), cancelOrderById)

router.patch("/:id/address", createAuthMiddleware([ "user" ]), updateOrderAddress)

router.get("/:id", createAuthMiddleware([ "user", "admin" ]), getOrderById)


module.exports = router;