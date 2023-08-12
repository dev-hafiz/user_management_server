const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware & parser
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME_SECRET}:${process.env.PASSWORD_SECRET}@cluster0.luy9u.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Ping to confirm a Database
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged to connected successfully");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// root route
app.get("/", (req, res) => {
  res.send("Live User Management Server is running...");
});

// listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
