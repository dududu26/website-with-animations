import { NextRequest, NextResponse } from 'next/server'
import { checkIpAvailability, getClientIp } from '@/lib/ip-validator'

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getClientIp(request)
    const isAvailable = await checkIpAvailability(ipAddress)

    if (!isAvailable) {
      return NextResponse.json(
        { 
          error: 'IP address sudah terdaftar dengan akun lain. Satu IP hanya boleh memiliki satu akun forum.' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    console.error('Error checking IP:', error)
    return NextResponse.json(
      { error: 'Gagal memeriksa IP address' },
      { status: 500 }
    )
  }
}
