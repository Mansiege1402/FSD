const { body, param, query } = require("express-validator");

const opportunityValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be at least 1")
];

const opportunityUpdateValidator = [
  param("id").isMongoId().withMessage("Valid opportunity id is required"),
  body("title").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("date").optional().isISO8601().withMessage("Date must be valid"),
  body("location").optional().trim().notEmpty(),
  body("capacity").optional().isInt({ min: 1 })
];

const opportunityListValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
  query("search").optional().trim(),
  query("status").optional().isIn(["draft", "open", "closed", "completed"])
];

module.exports = {
  opportunityValidator,
  opportunityUpdateValidator,
  opportunityListValidator
};
