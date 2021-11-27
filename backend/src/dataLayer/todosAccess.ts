import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
// import {parseUserId } from '../auth/utils'
//import { DynamoDbClientHandler } from "./dynamoDbClientInterface"


const dynamoDbClient = require("./dynamoDbClientInterface")

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = dynamoDbClient.createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todos')
    //
    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()

    // const authorization = this.event.headers.Authorization
    // const split = authorization.split(' ')
    // const jwtToken = split[1]
    //
    // var params = {
    //   TableName: this.todosTable,
    //   ExpressionAttributeValues:{
    //     ":userId": parseUserId(jwtToken)
    //   }
    // };

    // const result = await this.docClient.scan(params).promise()
    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }
}

