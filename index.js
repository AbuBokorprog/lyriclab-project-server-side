const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.SECRET_NM}:${process.env.SECRET_KEY}@cluster0.kq57d4a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("lyricLAB").collection("users");
    const classesCollection = client.db("lyricLAB").collection("classes");
    const SelectedCollection = client.db("lyricLAB").collection("Selected");

    //users collection
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get instructor
    app.get("/users/instructor", async (req, res) => {
      const result = await usersCollection
        .find({ role: "Instructor" })
        .toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    //users Admin
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.params.id);
      const filter = { _id: new ObjectId(id) };
      const updatedAdmin = {
        $set: {
          role: `admin`,
        },
      };
      const result = await usersCollection.updateOne(filter, updatedAdmin);
      res.send(result);
    });

    //users instructor
    app.patch("/users/instructor/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedInstructor = {
        $set: {
          role: `Instructor`,
        },
      };
      const result = await usersCollection.updateOne(query, updatedInstructor);
      res.send(result);
    });

    // Classes collection
    app.post("/classes", async (req, res) => {
      const classes = req.body;
      const result = await classesCollection.insertOne(classes);
      res.send(result);
    });
    app.get("/classes", async (req, res) => {
      const cursor = classesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/classes:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/classes/status", async (req, res) => {
      const result = await classesCollection
        .find({ status: "Accepted" })
        .toArray();
      res.send(result);
    });

    // Status Accepted
    app.patch("/classes/accepted/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedAccepted = {
        $set: {
          status: `Accepted`,
        },
      };
      const result = await classesCollection.updateOne(filter, updatedAccepted);
      res.send(result);
    });
    // Status denied
    app.patch("/classes/denied/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(req.params.id);
      const filter = { _id: new ObjectId(id) };
      const updatedAccepted = {
        $set: {
          status: `Denied`,
        },
      };
      const result = await classesCollection.updateOne(filter, updatedAccepted);
      res.send(result);
    });

    // selected Course

    app.post("/select", async (req, res) => {
      const select = req.body;
      const result = await SelectedCollection.insertOne(select);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
