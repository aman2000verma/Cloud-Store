require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

AWS.config.apiVersions = {
  lambda: "2015-03-31"
};
AWS.config.update({ region: process.env.REGION });

const lambda = new AWS.Lambda();

const getList = async () => {
  const params = {
    FunctionName: "listS3",
    Payload: JSON.stringify({ String: "Hello World" })
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => {
      console.log(err);
    })
    .then((res) => {
      console.log(JSON.parse(res));
    });
};

const getFile = async (name) => {
  const params = {
    FunctionName: "getS3",
    Payload: JSON.stringify({ fileName: name })
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => console.log(err))
    .then((res) => {
      console.log(JSON.parse(res.Payload));
      const buffer = Buffer.from(JSON.parse(res.Payload).body.Body.data);
      console.log(buffer);
      fs.createWriteStream(name).write(buffer);
    });
};

const deleteFile = async (name) => {
  const params = {
    FunctionName: "deleteS3",
    Payload: JSON.stringify({ fileName: name })
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => console.log(err))
    .then((res) => {
      console.log(res);
    });
};

const uploadFile = async (file) => {
  const buffer = Buffer.from(fs.readFileSync(file));
  const params = {
    FunctionName: "uploadS3",
    Payload: JSON.stringify({
      fileName: path.basename(file),
      file: buffer
    })
  };
  await lambda
    .invoke(params)
    .promise()
    .catch((err) => {
      console.log(err);
    })
    .then((res) => console.log(res));
};

getList();
// getFile("trackers.txt");
// uploadFile("E:/trackers.txt");
// deleteFile("trackers.json");
