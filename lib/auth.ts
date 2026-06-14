import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  appName: 'Anti Penyimpangan Forum',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET,
})

export type Session = {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    emailVerified: boolean
  }
  expiresAt: Date
}

export type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
  emailVerified: boolean
}
