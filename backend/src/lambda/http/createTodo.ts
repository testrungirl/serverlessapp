import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import {parseUserId } from '../../auth/utils'
//import * as AWSXRay from 'aws-xray-sdk'
import {_TodoAccess as todoAccessCrud} from '../../dataLayer/todosAccess'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const itemId = uuid.v4()

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newItem = {
    todoId: itemId,
    userId: parseUserId(jwtToken),
    ...newTodo
  }

  const res = await todoAccessCrud.createTodo(newItem);
    console.log("Created todoItem res", JSON.stringify(res))
    console.log("Created todoItem", JSON.stringify(newItem))
  
  
    // await docClient.put({
    //   TableName: todosTable,
    //   Item: newItem
    // }).promise()
  
  
    // TODO: Implement creating a new TODO item
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }