const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth.js");

const budgetRoutes = require("./routes/budget.routes");

const eventRoutes=require("./routes/event.routes.js");

const noteRoutes = require("./routes/noteRoutes");

const profileRoutes = require("./routes/profile.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/notes", noteRoutes);
const guestRoutes = require("./routes/guest.routes");

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);

app.use("/api/budget", budgetRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/guests", guestRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/users", userRoutes);


module.exports = app;
