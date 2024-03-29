const express = require('express');
const { Contact, new_contact } = require('../models/Contact');

const PhonebookRouter = express.Router();

PhonebookRouter.get('/', (req, res) => {
  res.send(`<h1>Phonebook Homepage</h1>`);
});

PhonebookRouter.get('/api', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

PhonebookRouter.get('/info', (req, res) => {
  res.send(
    `You have ${Contact.find({}).length} contacts
    </br>
    </br>
    ${new Date().toUTCString()}`
  );
});

PhonebookRouter.get('/api/:id', (req, res, next) => {
  const target_id = req.params.id;
  Contact.findById(target_id)
    .then((found_contact) => {
      if (found_contact) {
        res.json(found_contact);
      } else {
        res.status(400).send(`Couldn't find contact with id: ${target_id}`);
      }
    })
    .catch((error) => next(error));
});

PhonebookRouter.delete('/api/:id', (req, res, next) => {
  const target_id = req.params.id;
  Contact.findByIdAndDelete(target_id)
    .then((result) => {
      console.log(`Deleted: ${result}`);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

PhonebookRouter.post('/api', (req, res, next) => {
  const req_body = req.body;
  if (!req_body.name || !req_body.phone_number) {
    return res
      .status(400)
      .json({ error: 'Please provide a valid name and number' });
  }

  // TODO:
  // - add multiple numbers per contact

  new_contact(req_body)
    .save()
    .then((saved_contact) => {
      res.json(saved_contact);
    })
    .catch((error) => next(error));
});

PhonebookRouter.put('/api/:id', (req, res, next) => {
  const req_body = req.body;
  const target_id = req.params.id;
  const updated_contact = {
    name: req_body.name,
    phone_number: req_body.phone_number
  };
  Contact.findByIdAndUpdate(target_id, updated_contact, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((updated_contact_result) => {
      res.json(updated_contact_result);
    })
    .catch((error) => next(error));
});

module.exports = { app: PhonebookRouter };
