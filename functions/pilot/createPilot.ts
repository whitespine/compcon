import { query as q, Client as DBClient, } from 'faunadb'
import { APIFunction } from '../api'
import uuid from 'uuid/v4'
import NeedsJWT from '../jwtDecorator'

// just copied it for now, but should probably have a way to import this from the main source code...
interface IPilotData {
  id: string
  campaign: string
  group: string
  sort_index: number
  cloudID: string
  cloudOwnerID: string
  lastCloudUpdate: string
  level: number
  callsign: string
  name: string
  player_name: string
  status: string
  mounted: boolean
  factionID: string
  text_appearance: string
  notes: string
  history: string
  portrait: string
  cloud_portrait: string
  quirk: string
  current_hp: number
  background: string
  mechSkills: number[]
}

interface PilotPayload {
  pilot: IPilotData
}

interface PilotCreationResult {
  id: string,
  changedId: boolean
}



const handler: APIFunction<PilotCreationResult> = NeedsJWT(async function ( dbClient: DBClient, event, context, params, body: PilotPayload) {

  const { pilot: pilotData } = body


  const idExists = await dbClient.query<number>(
    q.Count(q.Match(q.Index("pilots_by_id"), pilotData.id))
  ) !== 0

  if (idExists) pilotData.id = uuid()

  await dbClient.query(
    q.Create(
      q.Collection('pilots'),
      { data: pilotData }
    )
  )

  return {
    statusCode: 200,
    body: {
      id: pilotData.id,
      changedId: idExists
    }
  }

})

export default handler;