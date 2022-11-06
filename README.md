# fso

<https://fullstackopen.com/en/about/>  
FullStackOpen is a web development course organized by University of Helsinki.

Parts 0, 1, and 2 focused on the frontend, which I keep [here](https://github.com/dj-mc/esb-r).

This repo (currently) contains the exercises I completed from parts 3 and 4.
Part 5 is (mostly) frontend material, which further builds on previous parts.

## Authorization with jwt tokens

Crashed the server: TokenExpiredError: jwt expired

- user logs in via frontend form.
- form sends username/password to /login/api via HTTP POST request.
- if auth is correct: server generates token identifying logged in user.
- token is digitally signed.
- server responds with successful status code and returns token.
- browser saves token.
- user creates new note.
- browser sends token to server with request.
- server uses token to identify user.

## Using the api with curl

### Create a user

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "dan", "username": "dj-mc", "password": "password123"}' \
  http://127.0.0.1:9001/users/api
```

### Login with password

Returns a jwt token which the `Authorization: Bearer` header will need.

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username": "dj-mc", "password": "password123"}' \
  http://127.0.0.1:9001/login/api
```

The above command should return a `<token>` to be used below:

### Post a new note with jwt token

```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"content": "Buy beef, eggs, cheese, and milk", "username": "dj-mc"}' \
  http://127.0.0.1:9001/notes/api
```

## Using beforeEach/beforeAll

```javascript
// If using forEach:
// Every iteration creates its own async function, so
// beforeEach cannot wait on forEach to finish executing.

// Use map instead:
const new_notes_mapped = init_notes_data.map((note) => new Note(note));
const new_notes_promises = new_notes_mapped.map((note) => note.save());
await Promise.all(new_notes_promises); // Fulfill promises (in parallel)

// Or use a regular for loop
// if order matters (not parallel):
for (const note of init_notes_data) {
  const new_note = new Note(note);
  await new_note.save();
}

// For your convenience:
await Note.deleteMany({});
await Note.insertMany(init_notes_data);
```

## Other things

`heroku login`  
`heroku config:set MONGODB_URI=<uri>`  
`git push heroku HEAD:master`

`dotenv` is installed as a normal dependency because heroku was not installing
dev deps last I tried. I would like to remove this package if possible.

FullStackOpen wants me to install `cross-env` and `express-async-errors`, but
this project omits their usage due to a lack of maintenance/interest.
