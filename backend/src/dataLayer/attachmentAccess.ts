import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const dynamoDbClient = require("./dynamoDbClientInterface")

const attachmentTable = process.env.ATTACHMENTS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

class _AttachmentAccess{
  private readonly docClient: DocumentClient
  constructor(    
  ){
    this.docClient = dynamoDbClient.createDynamoDBClient()
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