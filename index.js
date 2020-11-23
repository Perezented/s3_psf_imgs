require("dotenv/config");
const express = require("express");
const app = express();
const port = 3025;

app.get("/upload", (req, res) => {
  res.send({
    message:
      "Hello World! This is a posting link. You may want to post image to this endpoint instead."
  });
});

app.listen(port, () => {
  console.log(`server is up at http://localhost:${port}
  `);
});
