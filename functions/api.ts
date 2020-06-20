import "core-js/stable";
import "regenerator-runtime/runtime";

import { Client as DBClient } from 'faunadb'
import createMatcher from 'feather-route-matcher'
import userLogin from './user/login'
import createPilot from './pilot/createPilot'

import { Context, Handler, APIGatewayEvent } from 'aws-lambda'



const client = new DBClient({
  secret: process.env.FAUNADB_SECRET
})

export interface APIEvent {
  httpMethod: string,
  path: string
}

interface APIResult {
  statusCode: number,
  body: string
}

export interface APIError {
  error: string
}

export type APIFunction<T = object, BodyT = object> = (dbClient: DBClient, event: APIGatewayEvent, context: Context, params: { [key: string]: any }, body: BodyT) => Promise<{
  statusCode: number,
  body?: T | APIError
}>


const matchers: { 
  [key: string]: (route: string) => {
    value: APIFunction,
    url: string,
    params: object
  }
} = {
  'GET': createMatcher({

  }),
  'POST': createMatcher({
    '/login': userLogin,
    '/pilot':  createPilot
  }),
}




const handler: Handler<APIGatewayEvent, APIResult> = async function (event, context) {
  const path = (event.path as string).replace(/^\/\.netlify\/functions\/api/, '')
  console.log(path);
  const route = matchers[event.httpMethod](path)

  let body = {}
  if (event.body) {
    try {
      body = JSON.parse(event.body)
    } catch (error) {
      
    }
  }

  const result = await route.value(client, event, context, route.params, body)
  return {
    statusCode: result.statusCode,
    body: result.body ? JSON.stringify(result.body) : ''
  }
}

export { handler };