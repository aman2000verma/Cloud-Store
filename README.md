# S3 CRUD

- Create S3 bucket
- Configure IAM role for Lambda Functions and S3 Access
- Create Lambda Functions for performing CRUD operations on S3 bucket
- Invoke Lambda Functions from React application

## Installation (Server - GitHub)

Clone this reporsitory

```bash
git clone https://github.com/aman2000verma/Cloud-Store.git
```

Go to server folder and create .env file with following key=value pairs

```bash
AWS_ACCESS_KEY_ID=<YOUR AWS KEY ID>
AWS_SECRET_ACCESS_KEY=<YOUR AWS SECRET KEY>
REGION=<AWS REGION>
BUCKET=<BUCKET NAME>
ROLE=<IAM ROLE NAME>
LAMBDA_RUNTIME=nodejs14.x
SERVER_PORT=<PORT | IF NOT DEFINED THEN SERVER TAKES 5000 AUTOMATICALLY>
```

Install Dependencies

```bash
npm install
```

Start configuration and server

```bash
npm start
```

## Installation (Server - Docker)

Pull Docker Image

```bash
docker pull aman2000verma/s3-server
```

Create credentials file (For example: .env) just like in above example

Then create and run the container with the credentials file attached and exposing the defined port

```bash
docker run --env-file .env -d -p 5000:5000 --name server aman2000verma/server
```

## Installation Frontend (locally)

Go to client folder after cloning the repository

```bash
cd client
```

Install Dependencies

```bash
npm install
```

Run the frontend

```bash
npm start
```

## Installation Frontend (Docker + Nginx)

To deploy it frontend on Docker we need Nginx and to communicate with backend we need to create a bridge network, so on the server (docker should be installed) run the following command

```bash
docker network create crud
```

Now pull the image

```bash
docker pull aman2000verma/s3-client
```

This time we need to provide network name while creating the containers (for both backend and frontend)

```bash
docker run -d -p 8080:80 --name client --net crud aman2000verma/s3-client
docker run --env-file .env -d -p 5000:5000 --name server --net aman2000verma/s3-server
```

Open the link from the browser (use localhost in case of local docker container and use public ip of server in case of remote server)
