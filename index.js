const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygezfuj.mongodb.net/?retryWrites=true&w=majority`;

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

    const roomCollection = client.db('hotelRoom').collection('rooms');
    const bookingCollection = client.db('hotelRoom').collection('bookings')

    // Move the route handling for '/rooms' inside the try block
    app.get('/rooms', async (req, res) => {
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/rooms/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await roomCollection.findOne(query);
        res.send(result);
    })

    // bookings

    app.post('/bookings', async (req, res) =>{
        const bookings = req.body;
        console.log(bookings);
        const result = await bookingCollection.insertOne(bookings);
        res.send(result)
    })

    app.get('/bookings', async (req, res) => {
        const cursor = bookingCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.delete('/bookings/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await bookingCollection.deleteOne(query);
        res.send(result);
      })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('hotel room booking is running');
});

app.listen(port, () => {
  console.log(`hotel room booking is running on port ${port}`);
});
