const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  difficulty: { type: String, required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  timeTaken: { type: Number, required: false },
  activeRecall: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
