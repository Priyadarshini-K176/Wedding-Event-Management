const express = require("express");
const validate = require("../middlewares/validation.middleware");
const { loginLimiter, signupLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireOwnerRole } = require("../middlewares/rbac.middleware");
const { registerSchema, loginSchema } = require("../validations/schemas");
const { register, login, joinWedding, generateInvitationCode, getInvitationCode } = require("../controllers/auth");

const router = express.Router();

router.post("/register", signupLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/join-wedding", signupLimiter, joinWedding);
router.post("/generate-code", authMiddleware, requireOwnerRole(), generateInvitationCode);
router.get("/get-invitation-code", authMiddleware, requireOwnerRole(), getInvitationCode);

module.exports = router;
