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

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    searchBooks(search: String!): [Book!]!
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
