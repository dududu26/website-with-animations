import { db } from './db'
import { userIps } from './schema'
import { eq } from 'drizzle-orm'

export function getClientIp(request: Request): string {
  // Check various headers for IP address
  const headers = request.headers
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    headers.get('x-appengine-user-ip') ||
    '0.0.0.0'

  return ip.trim()
}

export async function checkIpAvailability(ipAddress: string): Promise<boolean> {
  try {
    const existingIp = await db
      .select()
      .from(userIps)
      .where(eq(userIps.ipAddress, ipAddress))
      .limit(1)

    return existingIp.length === 0
  } catch (error) {
    console.error('Error checking IP availability:', error)
    return false
  }
}

export async function registerUserIp(userId: string, ipAddress: string, userAgent?: string): Promise<void> {
  try {
    await db.insert(userIps).values({
      userId,
      ipAddress,
      userAgent,
    })
  } catch (error) {
    console.error('Error registering user IP:', error)
    throw error
  }
}

export async function getUsersByIp(ipAddress: string) {
  try {
    return await db
      .select()
      .from(userIps)
      .where(eq(userIps.ipAddress, ipAddress))
  } catch (error) {
    console.error('Error getting users by IP:', error)
    return []
  }
}
