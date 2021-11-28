import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const XAWS = AWSXRay.captureAWS(AWS)


function createDynamoDBClient(): DocumentClient {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
  
      // const AWSXRay = require('aws-xray-sdk');
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }


  export { createDynamoDBClient as DynamoDbClientHandler }
  