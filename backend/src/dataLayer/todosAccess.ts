import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
<<<<<<< HEAD
// import {parseUserId } from '../auth/utils'
//import { DynamoDbClientHandler } from "./dynamoDbClientInterface"
=======
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
//import { DynamoDbClientHandler } from "./dynamoDbClientInterface"

>>>>>>> b3b013d9ae79be29aa94246fbd4d0c1e82ad53c1

const todosTable = process.env.TODOS_TABLE
const userIdIndex = process.env.USERID_INDEX
const bucketName = process.env.ATTACHMENT_S3_BUCKET;

<<<<<<< HEAD
const dynamoDbClient = require("./dynamoDbClientInterface")
=======
const XAWS = AWSXRay.captureAWS(AWS)
>>>>>>> b3b013d9ae79be29aa94246fbd4d0c1e82ad53c1

class TodoAccess {

  constructor(
<<<<<<< HEAD
    private readonly docClient: DocumentClient = dynamoDbClient.createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }
=======
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE

    ){}
>>>>>>> b3b013d9ae79be29aa94246fbd4d0c1e82ad53c1

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

  public async updateTodoV2(todoId: string, userId: string, todo: TodoItem) {
    const result = await this.docClient
      .update({
        TableName: todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done= :done',
        ExpressionAttributeValues: {
          ':name': todo.name,
          ':dueDate': todo.dueDate,
          ':done': todo.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
    console.log('Updated todo', result)

    return result.Attributes as TodoItem
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

  public async deleteTodo(userId: string, todoId: string) {
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

    // KeyConditionExpression=
    //         Key('title').eq('This is a Good Book') & Key('author').eq('Jon Doe')


  }

  public async getTodo(userId: string, todoId: string) {
    console.log('Retrieving a todo, data=' + JSON.stringify({ userId, todoId }))
    const existingTodo = await this.docClient
      .get({
        TableName: todosTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()

    return existingTodo.Item
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

<<<<<<< HEAD
=======
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
>>>>>>> b3b013d9ae79be29aa94246fbd4d0c1e82ad53c1
