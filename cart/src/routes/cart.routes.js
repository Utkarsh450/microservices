const express = require("express");
const router = express.Router();
const createAuthMiddleware = require("../middlewares/auth.middlewares");
const { addItemtoCart, updateItemQuantity, getCart } = require("../controller/cart.controller");
const {
  validateAddItemToCart,
  validateUpdateItemToCart,
} = require("../middlewares/validator.middleware");

router.post(
  "/items",
  validateAddItemToCart,
  createAuthMiddleware(["user"]),
  addItemtoCart
);
router.get("/", createAuthMiddleware(["user"]), getCart);
router.patch(
    '/items/:productId',
    validateUpdateItemToCart,
    createAuthMiddleware([ 'user' ]),
    updateItemQuantity
);

module.exports = router;
