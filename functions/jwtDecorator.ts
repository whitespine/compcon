import { APIFunction, APIError } from './api'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'

import { Client as DBClient } from 'faunadb'
import { Context, APIGatewayEvent } from 'aws-lambda'


let kid = ''
let pubKey = null

interface JWTPayload {
  jwt: string
}

export interface JWTClaims {
  email: string
  email_verified: boolean
  name: string
  picture: string
}

export type SecureAPIFunction<T = object, BodyT = object> = (dbClient: DBClient, event: APIGatewayEvent, context: Context, params: { [key: string]: any }, body: BodyT & JWTPayload, claims: JWTClaims) => Promise<{
  statusCode: number,
  body?: T | APIError
}>


export default function NeedsJWT<T, BodyT>(func: SecureAPIFunction<T, BodyT>): APIFunction<T, BodyT> {

  return async function (dbClient, event, context, params, body: BodyT & JWTPayload) {

    let claims: JWTClaims;
    try {
      const newKid = jwt.decode().header.kid ?? ''
      if (newKid !== kid || pubKey === '') {
        console.log('KID changed, getting new pubkey...');
        const response = await fetch('https://compcon.us.auth0.com/pem')
        pubKey = await response.text()
        console.log('New pubkey:\n', pubKey);
        kid = newKid
      }
      claims = jwt.verify(body.jwt, pubKey)
    } catch (error) {
      return {
        statusCode: 403,
        body: {
          error: 'JWT is invalid'
        }
      }
    }

    return func(dbClient, event, context, params, body, claims)

  }

}