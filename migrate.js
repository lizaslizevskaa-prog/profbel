require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Profession = require("./Models/profession.Model");
const Story = require("./Models/story.Model");

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const content = fs
    .readFileSync("./public/js/data.js", "utf8")
    .replace(/const /g, "")
    .replace(/let /g, "")
    .replace(/export /g, "");
  global.professions = [];
  global.storiesData = [];
  eval(content);
  await Profession.deleteMany({});
  await Story.deleteMany({});
  const cleanProfs = global.professions.map(({ id, ...rest }) => ({
    ...rest,
    salaryMin: Number(rest.salaryMin) || 0,
    salaryMax: Number(rest.salaryMax) || 0,
  }));
  await Profession.insertMany(cleanProfs);
  const cleanStories = global.storiesData.map(({ id, ...rest }) => ({
    ...rest,
    status: "approved",
    education: rest.education || "Не указано",
  }));
  await Story.insertMany(cleanStories);
  console.log("✅ База данных успешно наполнена!");
  process.exit();
}
migrate();
