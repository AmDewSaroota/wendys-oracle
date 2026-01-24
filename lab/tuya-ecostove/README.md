# EcoStove - Tuya Air Quality Integration

ดึงข้อมูลจากเครื่อง ZN-MT29 มาใส่เว็บ EcoStove

## วิธีใช้

### 1. ติดตั้ง dependencies

```bash
pip install requests python-dotenv
```

### 2. รันโปรแกรม

```bash
cd lab/tuya-ecostove
python fetch_air_quality.py
```

### 3. ผลลัพธ์

จะแสดงค่าคุณภาพอากาศ:
- PM 2.5, PM 10, PM 1.0
- CO2, CO
- Temperature, Humidity
- TVOC, AQI

## ไฟล์

| ไฟล์ | คำอธิบาย |
|------|----------|
| `.env` | Credentials (ห้าม commit!) |
| `fetch_air_quality.py` | โค้ดดึงข้อมูล |

## ขั้นตอนถัดไป

1. ✅ ดึงข้อมูลจาก Tuya ได้
2. ⏳ ส่งข้อมูลเข้า Supabase
3. ⏳ เว็บ EcoStove แสดงผลอัตโนมัติ
