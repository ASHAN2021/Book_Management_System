const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers.js");
const connectDB = require("./db.js");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());


connectDB();


// ...existing code...
app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
  // pass the raw express request object as the context so resolvers can read headers
  context: {req},
  customFormatErrorFn: (error) => {
    console.error('GraphQL Error:', error.message);
    return error;
  }
})));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
