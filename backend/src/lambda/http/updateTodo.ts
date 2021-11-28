import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {parseUserId } from '../../auth/utils'
import {_TodoAccess as todoAccessCrud} from '../../dataLayer/todosAccess'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Caller event", event)
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

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const oldTodoId = await todoAccessCrud.retrieveOldTodo(todoId)
  console.log(oldTodoId.CreatedAt)

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  console.log("updatedtodo ", updatedTodo)

  const updatedItem = {
    todoId: todoId,
    userId: parseUserId(jwtToken),
    createdAt: oldTodoId.createdAt,
    attachmentUrl: oldTodoId.attachmentUrl,
    ...updatedTodo
  }

  console.log("updateditem is ", updatedItem)

  //const res = await todoAccessCrud.updateTodoV2(parseUserId(jwtToken), todoId, updatedItem)
  const res = await todoAccessCrud.updateTodo(updatedItem)

  console.log("Updated todoItem res", JSON.stringify(res))
  console.log("Updated todoItem", JSON.stringify(updatedItem))

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}