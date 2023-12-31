const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1co4vf.mongodb.net/?retryWrites=true&w=majority`;

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
		// await client.connect();

		const reviewCollection = client.db("craftopiaDB").collection("reviews");

		const instructorCollection = client
			.db("craftopiaDB")
			.collection("instructor");

		const classesCollection = client.db("craftopiaDB").collection("classes");
		
		const selectedClassesCollection = client.db("craftopiaDB").collection("selectedClasses");

		app.get("/reviews", async (req, res) => {
			const result = await reviewCollection.find().toArray();
			res.send(result);
		});
		app.get("/instructors", async (req, res) => {
			const result = await instructorCollection.find().toArray();
			res.send(result);
		});
		app.get("/classes", async (req, res) => {
			const query = {};
			const options = {
				sort: { students: -1 },
			};
			const result = await classesCollection.find(query, options).toArray();
			res.send(result);
		});

		app.get('/selectedClasses',async(req, res) => {
			const result = await selectedClassesCollection.find().toArray();
			res.send(result);
		})

		app.post("/selectedClasses", async (req, res) => {
			const selectedClass = req.body;
			console.log(selectedClass);
			const result = await selectedClassesCollection.insertOne(selectedClass);
			res.send(result);
		})

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Craftopia is running");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
