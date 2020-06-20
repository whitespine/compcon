import { query as q, Client as DBClient, RequestResult } from 'faunadb'
import { APIFunction } from '../api'
import NeedsJWT from '../jwtDecorator'
import { IUser } from '../types'
import jwt from 'jsonwebtoken'
import uuid from 'uuid/v4'


const handler: APIFunction<IUser> = NeedsJWT(async function (dbClient: DBClient, event, context, params, body, claims) {


  const { data: matching } = await dbClient.query<{data: { data: IUser}[] }>(q.Map(
      q.Paginate(
        q.Match(q.Index("users_by_email"), claims.email)
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )

  console.log(matching);

  if (matching[0]) {
    const user = matching[0].data
    console.log(user);
    return {
      statusCode: 200,
      body: user
    }
  } else {
    const newUserID = uuid()

    const userRef = await dbClient.query<{ data: IUser }>(
      q.Create(
        q.Collection('users'),
        { data: {
          id: newUserID,
          email: claims.email
        } }
      )
    )

    return {
      statusCode: 200,
      body: userRef.data
    }
  }

})

export default handler;