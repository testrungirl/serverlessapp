import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {_TodoAccess as todoAccessCrud} from '../../dataLayer/todosAccess'

import {parseUserId } from '../../auth/utils'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing event: ', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]


  const result = await todoAccessCrud.getTodos(parseUserId(jwtToken));

  const items = result

  return {
    statusCode:200,
    headers:{
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      items
    })
  }
}