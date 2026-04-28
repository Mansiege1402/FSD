const Opportunity = require("../models/Opportunity");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const pickOpportunityFields = (payload) => ({
  title: payload.title,
  description: payload.description,
  date: payload.date,
  location: payload.location,
  category: payload.category,
  capacity: payload.capacity,
  status: payload.status,
  skillsRequired: payload.skillsRequired
});

const getAllOpportunities = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const search = req.query.search?.trim();
  const status = req.query.status;
  const shouldPaginate =
    req.query.includeMeta === "true" || req.query.page !== undefined || req.query.limit !== undefined;

  const filter = {};
  if (search) {
    filter.$text = { $search: search };
  }
  if (status) {
    filter.status = status;
  }

  const [items, total] = await Promise.all([
    Opportunity.find(filter)
      .populate("createdBy", "name email organizationName")
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Opportunity.countDocuments(filter)
  ]);

  if (!shouldPaginate) {
    return res.json(items);
  }

  return res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const createOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.create({
    ...pickOpportunityFields(req.body),
    createdBy: req.user._id
  });

  res.status(201).json(opportunity);
});

const getMyOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json(opportunities);
});

const updateOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) {
    throw new ApiError(404, "Opportunity not found");
  }

  if (opportunity.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can update only your own opportunities");
  }

  Object.assign(opportunity, pickOpportunityFields(req.body));
  await opportunity.save();
  res.json(opportunity);
});

const deleteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) {
    throw new ApiError(404, "Opportunity not found");
  }

  if (opportunity.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can delete only your own opportunities");
  }

  await opportunity.deleteOne();
  res.json({ message: "Opportunity deleted" });
});

module.exports = {
  createOpportunity,
  getAllOpportunities,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity
};
