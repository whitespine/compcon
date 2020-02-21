import { query as q, Client as DBClient, } from 'faunadb'
// import { Handler } from 'aws-lambda'
import uuid from 'uuid/v4'

// interface NewUserResult {
//   statusCode: number
//   user_id?: string
// }

const client = new DBClient({
  secret: "fnADlBFL_1ACE573ys6BqebbaaUM2zFl0RUPrl4Y"
})

export async function handler (event, context) {

  const newUserID = uuid()

  await client.query(
    q.Create(
      q.Collection('users'),
      { data: { id: newUserID } }
    )
  )

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        user_id: newUserID
      }
    )
  }
}