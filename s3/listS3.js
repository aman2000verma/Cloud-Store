const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.BUCKET_NAME;

module.exports.handler = async (event) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200
  };
  await s3
    .listObjects({ Bucket: BUCKET_NAME })
    .promise()
    .catch((err) => {
      if (err) {
        console.error(err);
        response.body = { message: "Failed to get list.", errorMessage: err };
        response.statusCode = 500;
      }
    })
    .then((res) => {
      if (res) {
        console.log(res);
        response.body = res;
      }
    });
  return response;
};
