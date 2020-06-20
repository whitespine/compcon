import '../src/classes/Interfaces'
import { IUserProfile } from '../src/io/User'

export interface IUser {
  id: string
  email: string
  profile: IUserProfile
  unowned_pilots: string[] // Saved pilots not owned by the user
  gm_data: {
    
  }
}

declare type IPilot = IPilotData