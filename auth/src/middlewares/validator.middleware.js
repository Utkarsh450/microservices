const { body, validationResult } = require("express-validator");
const responseWithValidations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

const registerUserValidations = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName.firstName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First Name is required"),
  body("fullName.lastName")
    .isString()
    .withMessage("last name must be a string")
    .notEmpty()
    .withMessage("last Name is required"),
    body("role").optional().isIn([ 'user', 'seller']).withMessage("ROle mst be rither user or seller"),
  responseWithValidations,
];

const loginUserValidations = [
  body("email").optional().isEmail().withMessage("INvalid email address"),
  body("username")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Username must be 3 characters"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  responseWithValidations,
];

const addUserAddressValidations = [
  body("street")
    .isString()
    .withMessage("Street must be a string")
    .isLength({ min: 3 })
    .withMessage("Street must be at least 3 characters long"),

  body("city")
    .isString()
    .withMessage("City must be a string")
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .isString()
    .withMessage("State must be a string")
    .notEmpty()
    .withMessage("State is required"),

  body("pincode")
    .isString()
    .withMessage("Zip must be a string")
    .matches(/^\d{5,6}$/)
    .withMessage("Zip must be 5 or 6 digits"),

  body("country")
    .isString()
    .withMessage("Country must be a string")
    .notEmpty()
    .withMessage("Country is required"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),

  responseWithValidations,
]

module.exports = { registerUserValidations, loginUserValidations, addUserAddressValidations };
