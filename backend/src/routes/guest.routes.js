const express = require("express");
const router = express.Router();

const { addGuest, getGuests } = require("../controllers/guest.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/", addGuest);
router.get("/", getGuests);

module.exports = router;
