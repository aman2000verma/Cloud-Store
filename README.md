
# Cloud Store

Application to create and configure AWS S3 bucket and create S3 CRUD lambda functions with appropriate IAM role.

### Prerequisites
    1. Node.js
    2. AWS Credentials

### How to?
```
npm install
```
Store the credentials in .env file
```
AWS_ACCESS_KEY_ID=<Id>
AWS_SECRET_ACCESS_KEY=<Secret Key>
REGION=<Region>
BUCKET=<Bucket Name>
ROLE=<New Role>
LAMBDA_RUNTIME=nodejs14.x
```

Start the configuration by 
```
node index.js
```

The Lambda functions can be invoked using
```
node invoke.js
```
(Note: The function calls care commented, uncomment them before execution)