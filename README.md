# Serverless Development and Deployment (Udacity Homework)
Submission for Udacity Cloud Developer program homework #4.
This program achieves the following:
- In this project I developed an Instagram-like serverless services for uploading, listing, and filtering images. I began with building serverless REST APIs using API Gateway and AWS Lambda, a stack of serverless technologies on AWS. I then implement an API to interact with this application, store data in AWS DynamoDB, S3, and Elasticsearch, secure your application with authentication, and deploy to Amazon Web Services using Serverless framework. These are the hard skills one needs to develop serverless applications.

# Usage
### Installation
- Prerequisite: It is best to have Ubuntu 18.04 before starting this project
- Once the repository has been downloaded, you will need to first install all dependencies by running `npm i`. You will need to repeat this for all `Client`, `Backend` folders.
- Also, ensure all environment variables are set up in your `~/.profile`.
- Once this is set up, you can run the command to deploy to AWS Lambda using `sls deploy -v`. This will send the code to AWS to run and set up. 
- Once complete, you will be given the URL for testing with Postman. 

### SPECIAL NOTEs
- Use Node 14.X 14.2.0 particularly for both the client and backend apps. This is easier if you have nvm installed where you can use a specific node runtime version => nvm use 14.2.0 
- It may be absolutely necessary to delete your package-lock.json file and the install all dependencies again using *npm install
- So once again use Node 14.2.0 AND (npm v6.14.4)

### Kudos
Kudos to my fellow classmates and wallacewong who guided me on this project. And to the Course Instructor who was very graceful with it and Faith also.

### Author
Emike - @testrungirl
