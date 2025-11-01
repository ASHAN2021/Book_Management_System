const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int!
    genre: String!
  }

  input BookInput {
    title: String!
    author: String!
    publishedYear: Int!
    genre: String!
  }

  type PaginatedBooks {
    books: [Book!]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    books(page: Int, limit: Int): PaginatedBooks!
    book(id: ID!): Book
    searchBooks(search: String!, page: Int, limit: Int): PaginatedBooks!
  }

  type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    createBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookInput!): Book!
    deleteBook(id: ID!): String!
  }
`);

module.exports = schema;
