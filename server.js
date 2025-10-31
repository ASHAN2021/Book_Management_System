const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers.js");
const connectDB = require("./db.js");

const app = express();

// Connect to DB
connectDB();

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    rootValue: resolvers,
    graphiql: true, // Enable GraphiQL for testing
    context: { req },
  }))
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
