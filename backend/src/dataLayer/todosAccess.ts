import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
//import { DynamoDbClientHandler } from "./dynamoDbClientInterface"


const todosTable = process.env.TODOS_TABLE
const userIdIndex = process.env.USERID_INDEX
const bucketName = process.env.ATTACHMENT_S3_BUCKET;

const XAWS = AWSXRay.captureAWS(AWS)

class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE

    ){}

  public async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todos')
    //
    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()
    const items = result.Items
    return items as TodoItem[]
  }

  public async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  public async retrieveOldTodo(todoId: string){
    const result = await this.docClient.get({
      TableName: todosTable,
      Key:{
        todoId: todoId
      }
    }).promise()
  
    return result.Item
  }

  public async updateTodo(updatedItem: TodoItem): Promise<TodoItem>{
    await this.docClient.put({
      TableName: todosTable,
      Item: updatedItem
    }).promise()

    return updatedItem
  }

  public async todoExists(todoId: string){
    const result = await this.docClient
      .get({
        TableName: todosTable,
        Key:{
          todoId: todoId
        }
      })
      .promise()
  
      console.log('Get todo: ', result)
      return !!result.Item
  }

  public async deleteTodo(userId, todoId) {
    const result = await this.docClient
      .delete({
        TableName: todosTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()
    console.log('Deleted Item successfully', result)
    return result
  }
  

  public async getTodos(userId: string): Promise<TodoItem[]>{
    const result = await this.docClient.query({
      TableName : todosTable,
      IndexName : userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      },
  
      ScanIndexForward: false
  }).promise()


  let todos = result.Items;
    todos = todos.map(todo=> ({
      ...todo,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todo.todoId}`
    }))

    return todos as TodoItem[]
  }



}

export const _TodoAccess = new TodoAccess()



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