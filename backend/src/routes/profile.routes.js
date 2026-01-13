const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

router.use(auth);

router.get("/", getProfile);
router.put("/", updateProfile);

module.exports = router;