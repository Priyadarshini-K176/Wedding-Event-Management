const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");

const budgetRoutes = require("./routes/budget.routes");

const eventRoutes=require("./routes/event.routes.js");

const guestRoutes = require("./routes/guest.routes");





const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});



app.use("/api/auth", authRoutes);

app.use("/api/budget", budgetRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/guests", guestRoutes);


module.exports = app;
