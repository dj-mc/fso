const fs = require("fs");
const express = require("express");

let phonebook_data = [];
fs.readFile("./phonebook.json", "utf8", (err, data) => {
  if (err) throw err;
  else phonebook_data = phonebook_data.concat(JSON.parse(data).phonebook);
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Phonebook Homepage</h1>`);
});

app.get("/api", (req, res) => {
  res.json(phonebook_data);
});

app.get("/info", (req, res) => {
  res.send(
    `You have ${phonebook_data.length} contacts
    </br>
    </br>
    ${new Date().toUTCString()}`
  );
});

app.get("/:id", (req, res) => {
  const target_contact_id = Number(req.params.id);
  const target_contact = phonebook_data.find(
    (contact) => contact.id === target_contact_id
  );

  if (target_contact) {
    res.json(target_contact);
  } else {
    res.statusMessage = `Couldn't find contact with id: ${target_contact_id}`;
    res.status(404).end();
  }
});

const port = 9001;

function listen() {
  app.listen(port);
  console.log(`Now listening to ${port}`);
}

// listen();

module.exports = { app };
