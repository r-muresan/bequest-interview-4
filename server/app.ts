import express from "express";
import cors from "cors";
import { generateRandomString } from "./generateRandomString";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/tampered", (req, res) => {
  res.json({ data: generateRandomString() });
});

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
