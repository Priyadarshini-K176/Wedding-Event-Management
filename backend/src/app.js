const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth.js");

const budgetRoutes = require("./routes/budget.routes");

const eventRoutes=require("./routes/event.routes.js");

const noteRoutes = require("./routes/noteRoutes");

app.use("/api/notes", noteRoutes);



app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});



app.use("/api/auth", authRoutes);

app.use("/api/budget", budgetRoutes);

app.use("/api/events", eventRoutes);



module.exports = app;
