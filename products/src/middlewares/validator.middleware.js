const { body, validationResult } = require('express-validator');
// Generic validator error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
   next();
};

const allowedCurrencies = ['INR', 'USD', 'EUR'];

const createProductValidations = [
  body('title')
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({ min: 2 })
    .withMessage('title must be at least 2 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .isLength({ max: 1000 })
    .withMessage('description too long'),

  body('priceAmount')
    .bail()
    .isNumeric()
    .withMessage('priceAmount must be a number')
    .bail()
    .custom((value) => Number(value) > 0)
    .withMessage('priceAmount must be greater than 0'),

  body('priceCurrency')
    .optional()
    .isString()
    .withMessage('priceCurrency must be a string')
    .bail()
    .custom((val) => allowedCurrencies.includes(val))
    .withMessage(`priceCurrency must be one of: ${allowedCurrencies.join(', ')}`),

    validate
];

module.exports = {
  createProductValidations,
};
