import express from "express";
import cors from "cors";
import { Crypto } from "../client/src/shared/crypto";

const PORT = 8080;
const app = express();
const crypto = new Crypto();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  const data = crypto.encrypt(database.data);
  console.info(`Data sent:  $data}`);
  res.json({ data });
});

app.post("/", (req, res) => {
  const { data } = req.body;

  console.info(`Data received: ${data}`);

  try {
    const decrypted = crypto.decrypt(data);

    console.info(`Data decrypted: ${decrypted}`);

    database.data = decrypted;
    res.sendStatus(200);
  } catch (error) {
    console.error("Error: "+ error);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
