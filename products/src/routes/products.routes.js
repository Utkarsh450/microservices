const express = require("express");
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middlewares");
const { createProduct } = require("../controller/product.controller");
const { createProductValidations } = require('../middlewares/validator.middleware');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage()})

router.post(
	"/",
	createProductValidations,
	createAuthMiddleware(["admin", "seller"]),
	upload.array("images", 5),
	createProduct
);

module.exports = router;