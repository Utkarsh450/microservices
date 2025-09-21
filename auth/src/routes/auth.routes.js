const express = require("express");
const {registerUserValidations, loginUserValidations, addUserAddressValidations} = require("../middlewares/validator.middleware");
const { registerController, loginController, getCurrentUser, logoutUserController, getUserAddress, addUserAddress, deleteUserAddress } = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middlewares");
const router = express.Router();

router.post("/register",registerUserValidations, registerUserValidations, registerController);
router.post('/login',loginUserValidations, loginController);
router.get("/me",authUser,getCurrentUser);
router.get("/logout", logoutUserController);
router.get("/users/me/addresses", authUser, getUserAddress);
router.post("/users/me/addresses",addUserAddressValidations, authUser, addUserAddress);
router.post("/users/me/addresses",addUserAddressValidations, authUser, addUserAddress);
router.delete("/users/me/addresses/:addressesId", authUser, deleteUserAddress);

module.exports = router