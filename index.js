const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware & Parser
app.use(cors());
app.use(express.json());

//MongoDB URI Connection
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

    //Database and Collection
    const userCollection = client.db("userManagement").collection("users");

    //!post--> Create : (CRUD)
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //!get--> Read : (CRUD) (Default all get)
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //!get-> Read : (specific id)
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const reselt = await userCollection.findOne(query);
      res.send(reselt);
    });

    //!put--> Update : (CRUD)
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateInfo = {
        $set: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
          gender: user.gender,
          isActive: user.isActive,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updateInfo,
        options
      );
      res.send(result);
    });

    //!delete-- Delete : (CRUD)
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

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
