const express = require("express");
const { parse_json_file, overwrite_json_file } = require("./utilities");

let phonebook_data = [];
let phonebook_file_path = "./phonebook.json";
parse_json_file(phonebook_file_path).then((result) => {
  phonebook_data = phonebook_data.concat(result.phonebook);
});

setTimeout(() => {
  console.log("Got data (async):", phonebook_data);
}, 25);

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

const get_contact = (target_contact_id) => {
  const target_contact = phonebook_data.find(
    (contact) => contact.id === target_contact_id
  );
  return target_contact;
};

app.get("/:id", (req, res) => {
  const target_contact_id = Number(req.params.id);
  const target_contact = get_contact(target_contact_id);

  if (target_contact) {
    res.json(target_contact);
  } else {
    res.statusMessage = `Couldn't find contact with id: ${target_contact_id}`;
    res.status(404).end();
  }
});

app.delete("/api/:id", (req, res) => {
  const target_contact_id = Number(req.params.id);
  const target_contact = get_contact(target_contact_id);

  if (target_contact) {
    phonebook_data = phonebook_data.filter(
      (contact) => contact.id !== target_contact_id
    );
    overwrite_json_file(phonebook_file_path, { phonebook: phonebook_data });
    console.log(`Deletion of ${target_contact} successful`);
    res.status(200).end();
  } else {
    res.statusMessage = `Couldn't find note with id: ${target_contact_id}`;
    res.status(404).end();
  }
});

app.post("/api", (req, res) => {
  const req_body = req.body;
  if (!req_body.name || !req_body.phone_number) {
    return res.status(400).json({ error: "Not enough information" });
  } else {
    console.log(req_body.name, req_body.phone_number);
  }

  // Todo: Handle errors on posting to duplicate name or phone number

  const new_contact = {
    name: req_body.name,
    phone_number: req_body.phone_number,
    id: Math.random() * 10e16,
  };

  phonebook_data = phonebook_data.concat(new_contact);
  overwrite_json_file(phonebook_file_path, { phonebook: phonebook_data });
  res.json(new_contact);
});

module.exports = { app };
