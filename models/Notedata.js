const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
  date: { type: String },
  title: { type: String },
  description: { type: String },
});
const notemodel = mongoose.model("note_datas", noteSchema);
module.exports = notemodel;
