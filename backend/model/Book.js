const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  genre: { type: String, required: true },
}, {
  timestamps: true 
});


bookSchema.index({ title: 'text', author: 'text', genre: 'text' });
bookSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Book", bookSchema);
