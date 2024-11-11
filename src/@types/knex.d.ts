// eslint-disable-next-line
import { knex } from 'knex';

declare module 'kenx/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id?: string
      name: string
      email: string
      avatar?: string
      created_at: string
      updated_at: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      is_diet: boolean
      created_at: string
      updated_at: string
    }
  }
}

