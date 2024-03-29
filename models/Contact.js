const mongoose = require('mongoose');

const contact_schema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  phone_number: {
    type: String,
    minLength: 12,
    validate: {
      validator: (v) => {
        // 123-567-9112
        return /\d{3}-\d{3}-\d{4}/.test(v);
      }
    },
    required: true
  }
});

contact_schema.set('toJSON', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
  }
});

contact_schema.set('toObject', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
  }
});

const Contact = mongoose.model('Contact', contact_schema);

const new_contact = (req_body) => {
  return new Contact({
    name: req_body.name,
    phone_number: req_body.phone_number
  });
};

module.exports = { Contact, new_contact };
