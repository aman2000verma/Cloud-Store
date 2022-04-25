const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);

const fileUpload = require("express-fileupload");
app.use(fileUpload());

require("dotenv").config();
const AWS = require("aws-sdk");
const PORT = process.env.SERVER_PORT || 5000;

AWS.config.apiVersions = {
  lambda: "2015-03-31"
};
AWS.config.update({ region: process.env.REGION });
const lambda = new AWS.Lambda();

// Get list of all objects from S3
app.get("/", async (request, response) => {
  let result;
  const params = {
    FunctionName: "listS3",
    Payload: JSON.stringify({})
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => {
      console.log(err);
      result = err;
    })
    .then((res) => {
      console.log(JSON.parse(res.Payload).body.Contents);
      result = JSON.parse(res.Payload).body.Contents;
    });
  response.send(result);
});

app.get("/get/:filename", async (request, response) => {
  const name = request.params.filename;
  let result;
  const params = {
    FunctionName: "getS3",
    Payload: JSON.stringify({ fileName: name })
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => {
      console.log(err);
      result = err;
    })
    .then((res) => {
      console.log(JSON.parse(res.Payload));
      result = JSON.parse(res.Payload).body;
    });
  response.send(result);
});

app.delete("/delete/:filename", async (request, response) => {
  const name = request.params.filename;
  let result;
  const params = {
    FunctionName: "deleteS3",
    Payload: JSON.stringify({ fileName: name })
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => {
      console.log(err);
      result = err;
    })
    .then((res) => {
      console.log(res);
      result = res;
    });
  response.send(result);
});

app.post("/upload", async (request, response) => {
  const buffer = Buffer.from(request.files.file.data);
  // const buffer = Buffer.from(request.body.file);
  let result;
  const params = {
    FunctionName: "uploadS3",
    Payload: JSON.stringify({
      fileName: request.body.fileName,
      file: buffer
    })
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => {
      console.log(err);
      result = err;
    })
    .then((res) => {
      console.log(res);
      result = res;
    });
  response.send(result);
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`App is listening on port ${PORT}`);
});
