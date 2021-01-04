////////////////////////////////////////////////////////////////////////////////
// server
////////////////////////////////////////////////////////////////////////////////
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request-promise");
const app = express();
const PORT = process.env.PORT || 3000;

// handle data in a nice way
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// static path
const publicPath = path.resolve(`${__dirname}/public`);

// set your static server
app.use(express.static(publicPath));

// views
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// api
app.post("/api/v1/words", (req, res) => {
  const options = {
    method: "POST",
    uri: "http://104.248.224.60:5000/api/v1/flask/data",
    // uri: "http://localhost:5000/api/v1/flask/data",
    body: { word:  req.body.word},
    json: true
  };
  request(options)
    .then(parsed => {
      words = parsed;
      res.json({
        words: words,
      });
    })
    .catch(err => {
      res.json({ error: JSON.stringify(err.code) });
    });
});

// start listening
app.listen(PORT, () => {
  console.log(`Server is running localhost on port: ${PORT}`)
});
