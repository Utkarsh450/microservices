const express = require("express");
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middlewares");
const { createProduct, getProductById, getProducts, updateProduct, deleteProduct, getProductsBySeller } = require("../controller/product.controller");
const { createProductValidations } = require('../middlewares/validator.middleware');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage()})

router.post(
	"/",
	upload.array("images", 5),
	createAuthMiddleware(["admin", "seller"]),
	createProductValidations,
	createProduct
);

router.get("/", getProducts);
router.patch("/:id", createAuthMiddleware(["seller"]), updateProduct);
router.delete("/:id", createAuthMiddleware(["seller"]), deleteProduct);
router.get("/seller")
router.get("/:id", getProductsBySeller);

module.exports = router;