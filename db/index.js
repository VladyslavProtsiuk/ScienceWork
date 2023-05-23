const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
	"mongodb+srv://vladprotsiuk22:Vladvol159632@cluster.nlq38ha.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, *");
	res.setHeader("Content-Type", "application/json");
	next();
});

app.post("/getUser/", async (req, res) => {
	await client.connect();
	let db = await client.db("plast-app");
	let coll = await db.collection("users");
	let response = await coll.find({ login: req.body.log }).toArray();
	console.log(await response);
	if ((await response)[0] == undefined) {
		return;
	}
	if ((await response[0].password) === req.body.pass) {
		await res.send(true);
	} else {
		await res.send(false);
	}
});

app.post("/getEvents/", async (req, res) => {
	await client.connect();
	let db = await client.db("plast-app");
	let coll = await db.collection("events");
	let response = await coll.find({ date: new Date(req.body.date) }).toArray();
	await res.send(await response);
});

app.post("/addEvent/", async (req, res) => {
	let tosend = req.body.sending;
	tosend.date = new Date(tosend.date);
	await client.connect();
	let db = await client.db("plast-app");
	let coll = await db.collection("events");
	coll.insertOne(tosend, function (err, res) {
		if (err) {
			res.send(err);
			throw err;
		}
	});
	await res.sendStatus(200);
});

app.listen(3001, () => {});
