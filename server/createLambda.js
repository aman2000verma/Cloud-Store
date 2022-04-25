require("dotenv").config();
const fs = require("fs");
const AWS = require("aws-sdk");
const role = require("./arn.json");

AWS.config.apiVersions = {
  lambda: "2015-03-31"
};

AWS.config.update({ region: process.env.REGION });

const lambda = new AWS.Lambda();

let lambdaFnParams = {
  Runtime: process.env.LAMBDA_RUNTIME,
  PackageType: "Zip",
  Environment: {
    Variables: {
      BUCKET_NAME: process.env.BUCKET
    }
  },
  Role: role.Role
  // Code: {ZipFile: <Buffer>}
};

const lambdaFunctions = [
  { name: "listS3", handler: "listS3.handler", zip: "listS3.zip" },
  { name: "getS3", handler: "getS3.handler", zip: "getS3.zip" },
  { name: "uploadS3", handler: "uploadS3.handler", zip: "uploadS3.zip" },
  { name: "deleteS3", handler: "deleteS3.handler", zip: "deleteS3.zip" }
];

/*
Creates Lambda Function on AWS from zip file and then creates the function URL
*/
createLambdaFunctions = async () => {
  lambdaFunctions.forEach((fn) => {
    console.log(`Creating ${fn.name} Lambda Function`);
    createFn(fn);
  });
};

const createFn = async (fnParams) => {
  //Read zip
  zip = fs.readFileSync(fnParams.zip);
  lambdaFnParams = {
    ...lambdaFnParams,
    Code: { ZipFile: zip },
    Handler: fnParams.handler,
    FunctionName: fnParams.name
  };

  await lambda
    .createFunction(lambdaFnParams)
    .promise()
    .catch((err) => {
      if (err) {
        if (err.statusCode === 409) {
          console.log("Function already exist");
        } else {
          console.error(err);
        }
      }
    })
    .then((res) => {
      if (res) {
        console.log(res);
      }
    });
};

createLambdaFunctions();
