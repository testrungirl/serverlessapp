import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import {parseUserId } from '../../auth/utils'

import {_TodoAccess as todoAccessCrud} from '../../dataLayer/todosAccess'
import {AttachmentAccess as attachmentCrud} from '../../dataLayer/attachmentAccess'

const bucketName = process.env.ATTACHMENTS_S3_BUCKET


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event: ', event)
  const todoId = event.pathParameters.todoId
  console.log("todoId ", todoId)
  const validTodoId = await todoAccessCrud.todoExists(todoId)

  if (!validTodoId){
    return{
      statusCode:404,
      headers:{
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }
  const oldTodoId = await todoAccessCrud.retrieveOldTodo(todoId)
  const attachmentId = uuid.v4()

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createAttachment(todoId, attachmentId, event, jwtToken, oldTodoId)


  const url = await attachmentCrud.getUploadUrl(attachmentId)
  console.log("Upload URL: ", url)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // body: ''
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}


async function createAttachment(todoId: string, attachmentId: string, event: any, jwtToken: string, oldTodoId:any) {
  const timestamp = new Date().toISOString()
  const newAttach = JSON.parse(event.body)

  const newItem = {
    todoId,
    timestamp,
    attachmentId,
    userId: parseUserId(jwtToken),
    ...newAttach,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${attachmentId}`

  }
  console.log('Storing new item: ', newItem)
  //this is backend where we can store the new url

  // await docClient
  //   .put({
  //     TableName: attachmentTable,
  //     Item: newItem
  //   })
  //   .promise()

  const updatedItem = {
    todoId: todoId,
    userId: parseUserId(jwtToken),
    createdAt: oldTodoId.createdAt,
    name: oldTodoId.name,
    dueDate:oldTodoId.dueDate,
    done: oldTodoId.done,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
  }

  console.log("updateditem is ", updatedItem)

  return newItem
}
