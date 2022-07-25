const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`<h1>Home</h1>`);
});

app
  .use("/notes", require("./notes-server").app)
  .use("/phonebook", require("./phonebook-server").app)
  .listen(9001);

console.log("Listener is serving to localhost:9001");
