const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.BUCKET_NAME;

module.exports.handler = async (event) => {
  console.log(event);
  const response = {
    isBase64Encoded: false,
    statusCode: 200
  };
  await s3
    .deleteObject({
      Bucket: BUCKET_NAME,
      Key: decodeURIComponent(event.fileName)
    })
    .promise()
    .catch((err) => {
      if (err) {
        console.error(err);
        response.body = {
          message: "Failed to delete file.",
          errorMessage: err
        };
        response.statusCode = 500;
      }
    })
    .then((res) => {
      if (res) {
        console.log(res);
        response.body = { message: "Successfully deleted file from S3." };
      }
    });
  return response;
};
