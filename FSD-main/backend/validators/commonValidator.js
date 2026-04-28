const { body, param } = require("express-validator");

const campaignValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("summary").trim().notEmpty().withMessage("Summary is required"),
  body("goalAmount").isFloat({ min: 1 }).withMessage("Goal amount must be greater than 0"),
  body("startDate").isISO8601().withMessage("Valid start date is required"),
  body("endDate").isISO8601().withMessage("Valid end date is required")
];

const idParamValidator = [param("id").isMongoId().withMessage("Valid id is required")];

module.exports = { campaignValidator, idParamValidator };
