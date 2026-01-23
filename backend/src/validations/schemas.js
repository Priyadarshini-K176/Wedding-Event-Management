const Joi = require("joi");

// =====================
// AUTH SCHEMAS
// =====================
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  weddingName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Wedding name is required",
    "string.min": "Wedding name must be at least 2 characters",
    "string.max": "Wedding name cannot exceed 100 characters",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// =====================
// BUDGET SCHEMAS
// =====================
const addCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 100 characters",
  }),
});

const addItemSchema = Joi.object({
  categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid category ID format",
    "string.empty": "Category ID is required",
  }),
  title: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "Item title is required",
    "string.min": "Item title must be at least 2 characters",
    "string.max": "Item title cannot exceed 150 characters",
  }),
  plannedCost: Joi.number().min(0).default(0).messages({
    "number.min": "Planned cost cannot be negative",
  }),
});

const updateItemSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).messages({
    "string.min": "Item title must be at least 2 characters",
    "string.max": "Item title cannot exceed 150 characters",
  }),
  plannedCost: Joi.number().min(0).messages({
    "number.min": "Planned cost cannot be negative",
  }),
  actualCost: Joi.number().min(0).messages({
    "number.min": "Actual cost cannot be negative",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

const updateCategoryBudgetSchema = Joi.object({
  plannedBudget: Joi.number().min(0).required().messages({
    "number.min": "Planned budget cannot be negative",
    "number.empty": "Planned budget is required",
  }),
});

// =====================
// GUEST SCHEMAS
// =====================
const addGuestSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Guest name is required",
    "string.min": "Guest name must be at least 2 characters",
    "string.max": "Guest name cannot exceed 100 characters",
  }),
  phone: Joi.string().trim().min(10).max(20).required().messages({
    "string.empty": "Phone number is required",
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  side: Joi.string().valid("BRIDE", "GROOM").required().messages({
    "string.empty": "Side (BRIDE/GROOM) is required",
    "any.only": "Side must be either BRIDE or GROOM",
  }),
});

const updateGuestSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Guest name must be at least 2 characters",
    "string.max": "Guest name cannot exceed 100 characters",
  }),
  phone: Joi.string().trim().min(10).max(20).messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  side: Joi.string().valid("BRIDE", "GROOM").messages({
    "any.only": "Side must be either BRIDE or GROOM",
  }),
  rsvp: Joi.string().valid("PENDING", "ACCEPTED", "DECLINED").messages({
    "any.only": "RSVP must be PENDING, ACCEPTED, or DECLINED",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

// =====================
// EVENT SCHEMAS
// =====================
const addEventSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "Event title is required",
    "string.min": "Event title must be at least 2 characters",
    "string.max": "Event title cannot exceed 150 characters",
  }),
  startTime: Joi.date().required().messages({
    "date.base": "Start time must be a valid date",
  }),
  endTime: Joi.date().min(Joi.ref("startTime")).required().messages({
    "date.base": "End time must be a valid date",
    "date.min": "End time must be after start time",
  }),
  eventType: Joi.string().trim().max(50).default("general").messages({
    "string.max": "Event type cannot exceed 50 characters",
  }),
});

const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).messages({
    "string.min": "Event title must be at least 2 characters",
    "string.max": "Event title cannot exceed 150 characters",
  }),
  startTime: Joi.date().messages({
    "date.base": "Start time must be a valid date",
  }),
  endTime: Joi.date().messages({
    "date.base": "End time must be a valid date",
  }),
  eventType: Joi.string().trim().max(50).messages({
    "string.max": "Event type cannot exceed 50 characters",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

// =====================
// NOTE SCHEMAS
// =====================
const addNoteSchema = Joi.object({
  text: Joi.string().trim().min(1).max(5000).required().messages({
    "string.empty": "Note text is required",
    "string.max": "Note cannot exceed 5000 characters",
  }),
});

const updateNoteSchema = Joi.object({
  text: Joi.string().trim().min(1).max(5000).required().messages({
    "string.empty": "Note text is required",
    "string.max": "Note cannot exceed 5000 characters",
  }),
});

// =====================
// PROFILE SCHEMAS
// =====================
const updateProfileSchema = Joi.object({
  partnerName: Joi.string().trim().max(100).messages({
    "string.max": "Partner name cannot exceed 100 characters",
  }),
  weddingDate: Joi.date().messages({
    "date.base": "Wedding date must be a valid date",
  }),
  venue: Joi.string().trim().max(200).messages({
    "string.max": "Venue cannot exceed 200 characters",
  }),
  budget: Joi.number().min(0).messages({
    "number.min": "Budget cannot be negative",
  }),
  guestCount: Joi.number().min(0).integer().messages({
    "number.min": "Guest count cannot be negative",
    "number.integer": "Guest count must be a whole number",
  }),
  phone: Joi.string().trim().min(10).max(20).messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  address: Joi.string().trim().max(200).messages({
    "string.max": "Address cannot exceed 200 characters",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

module.exports = {
  // Auth
  registerSchema,
  loginSchema,
  // Budget
  addCategorySchema,
  addItemSchema,
  updateItemSchema,
  updateCategoryBudgetSchema,
  // Guest
  addGuestSchema,
  updateGuestSchema,
  // Event
  addEventSchema,
  updateEventSchema,
  // Note
  addNoteSchema,
  updateNoteSchema,
  // Profile
  updateProfileSchema,
};
