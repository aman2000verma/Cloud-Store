/*
This is a configuration script for setting up AWS Lambda functions and S3 bucket.
 */
require("dotenv").config();
/*
The SDK automatically detects AWS credentials 
set as variables in your environment and uses them for SDK requests
*/
const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.apiVersions = {
  s3: "2006-03-01",
  lambda: "2015-03-31",
  iam: "2010-05-08"
};
AWS.config.update({ region: process.env.REGION });

const s3 = new AWS.S3();
const iam = new AWS.IAM();

/*********************Config Parameters********************/
const s3CreateBucketParams = {
  Bucket: process.env.BUCKET
};

const iamParams = {
  AssumeRolePolicyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          Service: "lambda.amazonaws.com"
        },
        Action: "sts:AssumeRole"
      }
    ]
  }),
  RoleName: process.env.ROLE
};

const lambdaPolicyParams = {
  PolicyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
  RoleName: process.env.ROLE
};

/**********************************************************/

/*
Creates S3 bucket if it doesn't exist
*/
const createBucket = async () => {
  console.log("Creating new bucket...");
  await s3
    .createBucket(s3CreateBucketParams)
    .promise()
    .catch((err) => {
      if (err) {
        if (err.statusCode === 409) {
          console.log("Bucket already exist...");
        } else {
          console.error(err);
        }
      }
    })
    .then((res) => {
      if (res) {
        console.log("Bucket created ", res);
      }
    });
};

/*
Creates IAM role with Lambda policy
*/
const createRole = async () => {
  await iam
    .createRole(iamParams)
    .promise()
    .catch((err) => {
      if (err) {
        if (err.statusCode === 409) {
          console.log("Role already exist...");
          //Fetch ARN for existing role
          getExistingArn();
        } else {
          console.error(err);
        }
      }
    })
    .then((res) => {
      if (res) {
        console.log("Role created ", res.Role.Arn);
        storeArn(JSON.stringify({ Role: res.Role.Arn }));
        // lambdaFnParams = { ...lambdaFnParams, Role: res.Role.Arn };
        console.log("Attaching Lambda S3 execution policy with created role");
        attachPoliciesIAM();
      }
    });
};

const attachPoliciesIAM = async () => {
  await iam
    .attachRolePolicy(lambdaPolicyParams)
    .promise()
    .catch((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    })
    .then((res) => {
      console.log("Policy attached successfully...");
      createLambdaFunctions();
    });
};

const getExistingArn = async () => {
  await iam
    .getRole({ RoleName: process.env.ROLE })
    .promise()
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    })
    .then((res) => {
      if (res) {
        console.log("Arn:", res.Role.Arn);
        storeArn(JSON.stringify({ Role: res.Role.Arn }));
        // lambdaFnParams = { ...lambdaFnParams, Role: res.Role.Arn };
      }
    });
};

const storeArn = async (data) => {
  fs.writeFileSync("arn.json", data, (err) => {
    if (err) {
      console.err(err);
      process.exit(1);
    }
  });
};

createBucket();
createRole();
