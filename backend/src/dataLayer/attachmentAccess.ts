import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

//const dynamoDbClient = require("./dynamoDbClientInterface")

const attachmentTable = process.env.ATTACHMENTS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

class _AttachmentAccess{
  constructor(   
    private readonly docClient: DocumentClient = createDynamoDBClient()
  ){
    
   }


  public async createAttachment(newAttachment: any){
    await this.docClient
    .put({
      TableName: attachmentTable,
      Item: newAttachment
    })
    .promise()

    return newAttachment

  }

  public async getUploadUrl(attachmentId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: attachmentId,
      Expires: 300
    })
  }

}

export const AttachmentAccess = new _AttachmentAccess()


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