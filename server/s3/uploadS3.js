const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.BUCKET_NAME;

module.exports.handler = async (event) => {
  console.log(event);
  const response = {
    isBase64Encoded: false,
    statusCode: 200
  };

  const params = {
    Bucket: BUCKET_NAME,
    Key: decodeURIComponent(event.fileName),
    Body: Buffer.from(event.file)
  };
  await s3
    .upload(params)
    .promise()
    .catch((err) => {
      if (err) {
        console.error("Failed to upload file: ", err);
        response.body = {
          message: "File failed to upload.",
          errorMessage: err
        };
        response.statusCode = 500;
      }
    })
    .then((res) => {
      if (res) {
        response.body = { message: "Successfully uploaded file to S3" };
      }
    });
  return response;
};
