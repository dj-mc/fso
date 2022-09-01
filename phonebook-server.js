const express = require('express');
const { Contact } = require('./models');
const {
  request_logger,
  unknown_route,
  error_handler
} = require('./middleware');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(request_logger);
app.use(cors());

app.get('/', (req, res) => {
  res.send(`<h1>Phonebook Homepage</h1>`);
});

app.get('/api', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.get('/info', (req, res) => {
  res.send(
    `You have ${Contact.find({}).length} contacts
    </br>
    </br>
    ${new Date().toUTCString()}`
  );
});

app.get('/api/:id', (req, res, next) => {
  const target_id = req.params.id;
  Contact.findById(target_id)
    .then((found_contact) => {
      if (found_contact) {
        res.json(found_contact);
      } else {
        res.status(400).send(`Couldn't find contact with id: ${target_id}`);
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/:id', (req, res) => {
  // const target_contact_id = Number(req.params.id);
  // const target_contact = get_contact(target_contact_id);
  // if (target_contact) {
  //   phonebook_data = phonebook_data.filter(
  //     (contact) => contact.id !== target_contact_id
  //   );
  //   overwrite_json_file(phonebook_file_path, { phonebook: phonebook_data });
  //   console.log(`Deletion of ${target_contact} successful`);
  //   res.status(200).end();
  // } else {
  //   res.statusMessage = `Couldn't find note with id: ${target_contact_id}`;
  //   res.status(404).end();
  // }
});

app.post('/api', (req, res) => {
  const req_body = req.body;
  if (!req_body.name || !req_body.phone_number) {
    return res.status(400).json({ error: 'Not enough information' });
  }

  // TODO:
  // - handle posting duplicate name or phone number
  // - update their old number if their name already exists
  // - add multiple numbers per contact
  // - only one name per contact

  const new_contact = new Contact({
    name: req_body.name,
    phone_number: req_body.phone_number,
    id: Math.random() * 10e16
  });

  new_contact.save().then((saved_contact) => {
    res.json(saved_contact);
  });
});

app.use(unknown_route);
app.use(error_handler);

module.exports = { app };
