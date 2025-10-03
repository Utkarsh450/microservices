const express = require("express");
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middlewares");
const { createProduct, getProductById, getProducts, updateProduct, deleteProduct, getProductsBySeller } = require("../controller/product.controller");
const { createProductValidations } = require('../middlewares/validator.middleware');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage()})

router.post(
    '/',
    createAuthMiddleware([ 'admin', 'seller' ]),
    upload.array('images', 5),
    createProductValidations,
    createProduct
);

// GET /api/products
router.get('/', getProducts)



router.patch("/:id", createAuthMiddleware([ "seller" ]), updateProduct);
router.delete("/:id", createAuthMiddleware([ "seller" ]), deleteProduct);


router.get("/seller", createAuthMiddleware([ "seller" ]), getProductsBySeller);


// GET /api/products/:id
router.get('/:id', getProductById);

module.exports = router;