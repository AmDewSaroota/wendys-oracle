// Supabase Edge Function: fetch-sensor
// ดึงข้อมูลจาก Tuya sensor แล้วบันทึกลง pollution_logs

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

// ===== Tuya Config (ซ่อนไว้ใน Environment Variables) =====
const TUYA_ACCESS_ID = Deno.env.get('TUYA_ACCESS_ID')!
const TUYA_ACCESS_SECRET = Deno.env.get('TUYA_ACCESS_SECRET')!
const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com'

// ===== Supabase Config =====
const SB_URL = Deno.env.get('SUPABASE_URL')!
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// ===== Tuya Functions =====
async function generateSign(method: string, path: string, timestamp: string, accessToken = '', body = '') {
  const encoder = new TextEncoder()

  // Content hash
  const contentHashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(body))
  const contentHash = Array.from(new Uint8Array(contentHashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('')

  // String to sign
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n')
  const signStr = TUYA_ACCESS_ID + accessToken + timestamp + stringToSign

  // HMAC-SHA256
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(TUYA_ACCESS_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signStr))
  return Array.from(new Uint8Array(signBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

async function getTuyaToken() {
  const timestamp = Date.now().toString()
  const path = '/v1.0/token?grant_type=1'
  const sign = await generateSign('GET', path, timestamp)

  const response = await fetch(`${TUYA_BASE_URL}${path}`, {
    headers: {
      'client_id': TUYA_ACCESS_ID,
      'sign': sign,
      't': timestamp,
      'sign_method': 'HMAC-SHA256',
    },
  })

  const data = await response.json()
  return data.success ? data.result.access_token : null
}

async function getDeviceStatus(token: string, deviceId: string) {
  const timestamp = Date.now().toString()
  const path = `/v1.0/devices/${deviceId}/status`
  const sign = await generateSign('GET', path, timestamp, token)

  const response = await fetch(`${TUYA_BASE_URL}${path}`, {
    headers: {
      'client_id': TUYA_ACCESS_ID,
      'access_token': token,
      'sign': sign,
      't': timestamp,
      'sign_method': 'HMAC-SHA256',
    },
  })

  return response.json()
}

function parseReadings(data: any) {
  if (!data.success) return null
  const readings: Record<string, any> = {}
  for (const item of data.result || []) {
    readings[item.code] = item.value
  }
  return readings
}

// คำนวณ AQI จาก PM2.5 ตามมาตรฐานจีน (HJ 633-2012)
function calculateAqiFromPm25(pm25: number | null): number | null {
  if (pm25 === null || pm25 === undefined) return null
  const breakpoints = [
    { cLo: 0,   cHi: 35,  aqiLo: 0,   aqiHi: 50 },
    { cLo: 35,  cHi: 75,  aqiLo: 50,  aqiHi: 100 },
    { cLo: 75,  cHi: 115, aqiLo: 100, aqiHi: 150 },
    { cLo: 115, cHi: 150, aqiLo: 150, aqiHi: 200 },
    { cLo: 150, cHi: 250, aqiLo: 200, aqiHi: 300 },
    { cLo: 250, cHi: 350, aqiLo: 300, aqiHi: 400 },
    { cLo: 350, cHi: 500, aqiLo: 400, aqiHi: 500 },
  ]
  for (const bp of breakpoints) {
    if (pm25 <= bp.cHi) {
      return Math.round(((bp.aqiHi - bp.aqiLo) / (bp.cHi - bp.cLo)) * (pm25 - bp.cLo) + bp.aqiLo)
    }
  }
  return 500 // เกิน 500 µg/m³
}

// ===== Main Handler =====
serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get device_id from request
    const { device_id, volunteer_id, house_id, stove_type, session_type } = await req.json()

    if (!device_id) {
      return new Response(
        JSON.stringify({ error: 'device_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 1: Get Tuya token
    const token = await getTuyaToken()
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Failed to connect to Tuya' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Get device readings
    const rawData = await getDeviceStatus(token, device_id)
    const readings = parseReadings(rawData)

    if (!readings) {
      return new Response(
        JSON.stringify({ error: 'Failed to get sensor readings', details: rawData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 3: Save to Supabase
    const supabase = createClient(SB_URL, SB_KEY)

    const record = {
      pm25_value: readings.pm25_value ?? null,
      pm1_value: readings.pm1 ?? null,
      pm10_value: readings.pm10 ?? null,
      co2_value: readings.co2_value ?? null,
      co_value: readings.co_value ?? null,
      temperature: readings.temp_current ?? null,
      humidity: readings.humidity_value ?? null,
      hcho_value: readings.ch2o_value ?? null,
      tvoc_value: readings.tvoc_value ?? null,
      aqi: calculateAqiFromPm25(readings.pm25_value ?? null),
      data_source: 'sensor',
      stove_type: stove_type || 'eco',
      volunteer_id: volunteer_id || null,
      house_id: house_id || null,
      tuya_device_id: device_id,
      session_type: session_type || null,
      status: 'approved',
      recorded_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('pollution_logs')
      .insert([record])
      .select()

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to save to database', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Success!
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sensor data saved!',
        readings: {
          pm25: readings.pm25_value,
          pm1: readings.pm1,
          pm10: readings.pm10,
          co2: readings.co2_value,
          temperature: readings.temp_current,
          humidity: readings.humidity_value,
        },
        record_id: data[0]?.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal error', details: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
