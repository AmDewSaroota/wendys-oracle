"""
EcoStove - Tuya Air Quality Fetcher
ดึงข้อมูลจากเครื่อง ZN-MT29 ผ่าน Tuya API

วิธีใช้:
1. pip install requests python-dotenv
2. python fetch_air_quality.py
"""

import os
import time
import hmac
import hashlib
import requests
from dotenv import load_dotenv

# โหลด credentials จาก .env
load_dotenv()

ACCESS_ID = os.getenv('TUYA_ACCESS_ID')
ACCESS_SECRET = os.getenv('TUYA_ACCESS_SECRET')
DEVICE_ID = os.getenv('TUYA_DEVICE_ID')
BASE_URL = os.getenv('TUYA_REGION', 'https://openapi.tuyaus.com')


def get_sign(access_id, access_secret, timestamp, token=''):
    """สร้าง signature สำหรับ Tuya API"""
    str_to_sign = access_id + token + timestamp
    sign = hmac.new(
        access_secret.encode('utf-8'),
        str_to_sign.encode('utf-8'),
        hashlib.sha256
    ).hexdigest().upper()
    return sign


def get_token():
    """ขอ access token จาก Tuya"""
    timestamp = str(int(time.time() * 1000))
    sign = get_sign(ACCESS_ID, ACCESS_SECRET, timestamp)

    headers = {
        'client_id': ACCESS_ID,
        'sign': sign,
        't': timestamp,
        'sign_method': 'HMAC-SHA256',
    }

    response = requests.get(f'{BASE_URL}/v1.0/token?grant_type=1', headers=headers)
    data = response.json()

    if data.get('success'):
        return data['result']['access_token']
    else:
        print(f"Error getting token: {data.get('msg')}")
        return None


def get_device_status(token):
    """ดึงข้อมูลจากเครื่องวัด"""
    timestamp = str(int(time.time() * 1000))
    sign = get_sign(ACCESS_ID, ACCESS_SECRET, timestamp, token)

    headers = {
        'client_id': ACCESS_ID,
        'access_token': token,
        'sign': sign,
        't': timestamp,
        'sign_method': 'HMAC-SHA256',
    }

    response = requests.get(f'{BASE_URL}/v1.0/devices/{DEVICE_ID}/status', headers=headers)
    return response.json()


def parse_air_quality(data):
    """แปลงข้อมูลให้อ่านง่าย"""
    if not data.get('success'):
        print(f"Error: {data.get('msg')}")
        return None

    readings = {}
    for item in data.get('result', []):
        code = item['code']
        value = item['value']
        readings[code] = value

    return readings


def main():
    print("🌬️ EcoStove Air Quality Monitor")
    print("=" * 40)
    print(f"Device ID: {DEVICE_ID}")
    print()

    # ขอ token
    print("กำลังเชื่อมต่อ Tuya...")
    token = get_token()

    if not token:
        print("❌ เชื่อมต่อไม่สำเร็จ")
        return

    print("✅ เชื่อมต่อสำเร็จ!")
    print()

    # ดึงข้อมูล
    print("กำลังดึงข้อมูลคุณภาพอากาศ...")
    raw_data = get_device_status(token)
    readings = parse_air_quality(raw_data)

    if not readings:
        print("❌ ดึงข้อมูลไม่สำเร็จ")
        return

    # แสดงผล
    print()
    print("📊 ค่าที่วัดได้:")
    print("-" * 40)

    # แปลงชื่อให้อ่านง่าย
    labels = {
        'pm25': 'PM 2.5',
        'pm10': 'PM 10',
        'pm1': 'PM 1.0',
        'co2': 'CO2',
        'co': 'CO',
        'ch2o': 'Formaldehyde (HCHO)',
        'tvoc': 'TVOC',
        'temp': 'Temperature',
        'humidity': 'Humidity',
        'aqi': 'AQI',
    }

    for code, value in readings.items():
        label = labels.get(code, code)
        print(f"  {label}: {value}")

    print()
    print("✅ เสร็จสิ้น!")

    return readings


if __name__ == '__main__':
    main()
