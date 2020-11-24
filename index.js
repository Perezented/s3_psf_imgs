require("dotenv/config");
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const uuid = require("uuid/v4");

const app = express();
const port = 3030;

// set up of aws s3 account
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  }
});
// stores as a buffer object, no settings
const upload = multer({ storage }).single("image");

app.get("/upload", (req, res) => {
  res.send({
    message:
      "Hello World! This is a posting link. You may want to post image to this endpoint instead."
  });
});

app.post("/upload", upload, (req, res) => {
  // the file gets split up by file name and file type using the original file name and extension
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  // IMG we are sending and to what bucket and key
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: "imgs",
    Key: `${uuid()}.${fileType}`,
    Body: req.file.buffer
  };
  //   upload to s3, if error display it back, else return data
  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    console.log(`File uploaded successfully. ${data.Location}`);
    res.status(200).send(data);
  });
});

app.get("/", (req, res) => {
  (async function () {
    try {
      AWS.config.update({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
        region: "us-east-2"
      });
      const s3 = new AWS.S3();
      const response = await s3
        .listObjectsV2({
          Bucket: "proselectflooringimages",
          Prefix: "imgs"
        })
        .promise();

      console.log(response);
      res.status(200).send(response);
    } catch (e) {
      console.log("Erroring out man! : ", e, e.message);
    }
  })();
});

app.listen(port, () => {
  console.log(`server is up at http://localhost:${port}
  `);
});
