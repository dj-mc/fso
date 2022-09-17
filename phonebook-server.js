const express = require('express');
const Contact = require('./models/Contact');
// const { Contact, new_contact } = require('./models/Contact');
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

app.delete('/api/:id', (req, res, next) => {
  const target_id = Number(req.params.id);
  Contact.findByIdAndDelete(target_id)
    .then((result) => {
      console.log(`Deleted: ${result}`);
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
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
    phone_number: req_body.phone_number
  });
  new_contact.save().then((saved_contact) => {
    res.json(saved_contact);
  });

  // new_contact(req_body)
  //   .save()
  //   .then((saved_contact) => {
  //     res.json(saved_contact);
  //   });
});

app.put('/api/:id', (req, res, next) => {
  const req_body = req.body;
  const target_id = req.params.id;
  const updated_contact = {
    name: req_body.name,
    phone_number: req_body.phone_number
  };
  Contact.findByIdAndUpdate(target_id, updated_contact, { new: true })
    .then((updated_contact_result) => {
      res.json(updated_contact_result);
    })
    .catch((error) => next(error));
});

app.use(unknown_route);
app.use(error_handler);

module.exports = { app };
