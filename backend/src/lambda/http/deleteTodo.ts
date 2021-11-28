import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {parseUserId } from '../../auth/utils'
import {_TodoAccess as todoAccessCrud} from '../../dataLayer/todosAccess'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log("todoId ", todoId)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const validTodoId = await todoAccessCrud.todoExists(todoId)
  console.log("def")
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

  console.log("abc")
  const userId = parseUserId(jwtToken)
  const res = await todoAccessCrud.deleteTodo(userId, todoId)
  console.log("Deleted todoItem res", JSON.stringify(res))


  // docClient.delete(params, function(err, data) {
  //   if (err) {
  //       console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2))
  //   } else {
  //       console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2))
  //   }
  // })
  // TODO: Remove a TODO item by id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body:'Item deleted'
  }
}