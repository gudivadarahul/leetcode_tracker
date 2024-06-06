const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package
const authRoutes = require("./routes/auth");
const problemRoutes = require("./routes/problems");
const PORT = process.env.PORT || 8000;

const app = express();

// Use CORS middleware
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

mongoose
  .connect("mongodb://localhost:27018/leetcode-tracker")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
