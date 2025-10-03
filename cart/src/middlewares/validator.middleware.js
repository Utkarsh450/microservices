const { body, validationResult } = require('express-validator');
const mongoose = require("mongoose")
// Generic validator error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
   next();
};

const validateAddItemToCart = [
  body('productId')
    .isString()
    .withMessage('productId must be a string')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .trim()
    .isLength({ min: 2 })
    .withMessage('productId must be at least 2 characters'),
  body('quantity')
  .isInt({ gt: 0 })
    .bail()
    .isNumeric()
    .withMessage('quantity must be a number'),
    validate
]

const validateUpdateItemToCart = [
  body('productId')
  .isString()
  .withMessage('productId is required')
    .withMessage('productId must be a string')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .trim()
    .isLength({ min: 2 }),
  body('quantity')
  .isInt({ gt: 0 })
    .withMessage('quantity is required')
    .bail()
    .isNumeric(),
    validate
]

module.exports = {
  validateAddItemToCart,
  validateUpdateItemToCart
};
