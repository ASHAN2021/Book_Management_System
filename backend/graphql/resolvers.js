const bcrypt = require("bcryptjs");
const User = require("../model/User.js");
const Book = require("../model/Book.js");
const { generateToken, authMiddleware } = require("../utils/auth.js");

const resolvers = {
  books: async ({ page = 1, limit = 10 }) => {
    try {
      const currentPage = Math.max(1, parseInt(page));
      const pageSize = Math.min(Math.max(1, parseInt(limit)), 100);
      
      const skip = (currentPage - 1) * pageSize;
      const totalCount = await Book.countDocuments();
      
      const books = await Book.find()
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 });
      
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;
      
      return {
        books,
        totalCount,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
      };
    } catch (error) {
      console.error("Books query error:", error);
      throw new Error("Failed to fetch books: " + error.message);
    }
  },

  book: async ({ id }) => await Book.findById(id),

  searchBooks: async ({ search, page = 1, limit = 10 }) => {
    try {
      const currentPage = Math.max(1, parseInt(page));
      const pageSize = Math.min(Math.max(1, parseInt(limit)), 100);
      
      const skip = (currentPage - 1) * pageSize;
      
      const regex = new RegExp(search, "i");
      const searchQuery = {
        $or: [
          { title: regex },
          { author: regex },
          { genre: regex },
        ],
      };

      const totalCount = await Book.countDocuments(searchQuery);
      
      const books = await Book.find(searchQuery)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 });

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;
      
      return {
        books,
        totalCount,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
      };
    } catch (error) {
      console.error("Search books error:", error);
      throw new Error("Failed to search books: " + error.message);
    }
  },

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