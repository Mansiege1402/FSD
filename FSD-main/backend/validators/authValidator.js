const { body } = require("express-validator");
const { ROLES } = require("../utils/roles");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Role must be Admin, NGO, Volunteer, or User")
];

const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

const refreshValidator = [body("refreshToken").notEmpty().withMessage("Refresh token is required")];

module.exports = { registerValidator, loginValidator, refreshValidator };
