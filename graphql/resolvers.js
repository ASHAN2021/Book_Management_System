const bcrypt = require("bcryptjs");
const User = require("../model/User.js");
const Book = require("../model/Book.js");
const { generateToken, authMiddleware } = require("../utils/auth.js");

const resolvers = {
  // === Queries ===
  books: async () => await Book.find(),

  book: async ({ id }) => await Book.findById(id),

  searchBooks: async ({ search }) => {
    const regex = new RegExp(search, "i");
    return await Book.find({
      $or: [{ title: regex }, { author: regex }, { genre: regex }],
    });
  },

  // === Mutations ===
  register: async ({ username, password }) => {
    console.log("Register mutation started");

    const existing = await User.findOne({ username });
    if (existing) {
      throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashed });
    await user.save();
    console.log("User saved:", user);

    const token = generateToken(user);
    console.log("Token generated in register:", token);

    return {
      token,
      user: { id: user._id.toString(), username: user.username },
    };
  },

  login: async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user);
    return { token, user };
  },

  createBook: async ({ input }, context) => {
    authMiddleware(context);
    const book = new Book(input);
    await book.save();
    return book;
  },

  updateBook: async ({ id, input }, context) => {
    authMiddleware(context);
    const book = await Book.findByIdAndUpdate(id, input, { new: true });
    if (!book) throw new Error("Book not found");
    return book;
  },

  deleteBook: async ({ id }, context) => {
    authMiddleware(context);
    const book = await Book.findByIdAndDelete(id);
    if (!book) throw new Error("Book not found");
    return "Book deleted";
  },
};

module.exports = resolvers;