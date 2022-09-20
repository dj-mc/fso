require('dotenv').config();
const mongoose = require('mongoose');
const mongodb_URI = process.env.MONGODB_URI;

mongoose
  .connect(mongodb_URI)
  .then((_) => {
    console.log(`Connected to ${mongodb_URI}`);
  })
  .catch((error) => {
    console.log(error.message);
  });

const contact_schema = new mongoose.Schema({
  name: { type: String },
  phone_number: { type: String },
  id: { type: Number }
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
