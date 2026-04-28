const { body, param } = require("express-validator");

const createApplicationValidator = [
  body("opportunityId").isMongoId().withMessage("Valid opportunityId is required"),
  body("note").optional().isString()
];

const updateApplicationStatusValidator = [
  param("id").isMongoId().withMessage("Valid application id is required"),
  body("status").isIn(["approved", "rejected", "withdrawn"]).withMessage("Invalid application status"),
  body("volunteerHours").optional().isFloat({ min: 0 })
];

module.exports = { createApplicationValidator, updateApplicationStatusValidator };
