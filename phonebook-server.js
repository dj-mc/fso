const fs = require("fs");
const express = require("express");

let phonebook_data = {};
fs.readFile("./phonebook.json", "utf8", (err, data) => {
  if (err) throw err;
  phonebook_data = JSON.parse(data).phonebook;
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Phonebook Homepage</h1>`);
});

app.get("/api", (req, res) => {
  res.json(phonebook_data);
});

const port = 9001;

function listen() {
  app.listen(port);
  console.log(`Now listening to ${port}`);
}

// listen();

module.exports = { app };
