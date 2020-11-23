require("dotenv/config");
const express = require("express");
const app = express();
const port = 3025;

app.listen(port, () => {
  console.log(`server is up at http://localhost:${port}
  `);
});
