const express = require("express");
const app = express();
const port = 3001;
const ip = "10.211.138.1";

app.use(express.json({ limit: "10mb" }));

let consumption = {
  httpRequestsMade: 0,
  requestsToWebpages: 0,
  requestsToLLMs: 0,
  consumptionOfWebpages: 0,
  consumptionOfLLMs: 0,
};

app.post("/api/requests", (req, res) => {
  console.log("Received data:", req.body);
  consumption = req.body;
  res.status(200).json({ message: "Data received", consumption });
});

app.get("/api/streams", (req, res) => {
  res.status(200).json(consumption);
});

app.listen(port, () => {
  console.log(`Mockup server running at http://${ip}:${port}`);
});
