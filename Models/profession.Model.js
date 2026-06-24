const mongoose = require("mongoose");

const ProfessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    direction: { type: String, required: true },
    educationLevel: { type: String, required: true },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    demand: { type: String, default: "Растущий" },
    description: { type: String, required: true },
    perspectives: { type: String, required: true },
    image: { type: String, required: true },
    entranceExams: {
      subject1: String,
      subject2: String,
      subject3: String,
      passingScore: String,
    },
    skills: [String],
    softSkills: [String],
    careerPath: [String],
    universities: [{ name: String, faculty: String, specialty: String }],
    colleges: [{ name: String, specialty: String }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profession", ProfessionSchema);
