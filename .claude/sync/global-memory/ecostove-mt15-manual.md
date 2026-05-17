# MT15 Sensor Manual Summary

**Source**: DewS's photos from `E:\01_Work\_NDF\Test_WebAPP\EcoStove\MT15\` (9 pages)
**Date**: 2026-04-07

## Button Operations (Power Button)

| Presses | Fig 1 (Air Quality) | Fig 2 (Clock/Timer) |
|---------|--------------------|--------------------|
| Hold 3s | Power ON (60s countdown then display) | — |
| 1x | Switch °C / °F | Start/stop timer |
| 2x | Buzzer on/off | Clear timer / mute alarm |
| 3x | Switch display mode (Fig1 ↔ Fig2) | Back to Fig1 |
| 4x | **Calibrate** (120s countdown) | — |
| 5x | WiFi pairing mode (icon blinks ~5s) | — |

**Screen wake**: Press button once = wake only, does NOT trigger C/F switch (confirmed by DewS)

## Key Differences from MT13W

| Feature | MT13W | MT15 |
|---------|-------|------|
| Calibrate | 3 presses | **4 presses** |
| WiFi pair | (not documented) | **5 presses** |
| Display switch | N/A | **3 presses** |
| Warm-up | 5-10 min | **30 min** (first use: 24h USB) |
| Calibrate time | instant? | **120 seconds** countdown |
| Sensor tech | IR (slow PM) | **Laser Scattering** (fast PM) |
| TVOC Cloud | ❌ manual only | ✅ auto upload |
| CO Cloud | ✅ auto | ✅ auto |

## Sleep Setting
- Set via Tuya Smart App → Settings (gear) → Sleep
- Range: 0-100 minutes
- **0 = Always On** (screen never turns off) ← confirmed by DewS
- Recommended: **0 min** for data collection sessions

## Product Specs
- Battery: 2000mAh lithium polymer, 6-7 hours runtime, 3-4 hours charge
- Charging: DC5V/1A, Type-C USB
- Display: 2.8-inch TFT
- CO2: 400-5000 PPM (±50 ±5%)
- CO: 0-999 PPM (±10 PPM)
- TVOC: 0-9.99 mg/m³ (±0.05)
- HCHO: 0-1.99 mg/m³ (±0.05)
- PM2.5: 0-999 µg/m³ (±10)
- PM10: 0-999 µg/m³ (±10)
- Temp: -10~50°C (±2°C)
- Humidity: 0~99% RH (±5%)

## Calibration (Zero Operation)
- Place device at window with good air ventilation
- Restart → display counts 10-18 seconds → shut down → restart again
- Data will clear to zero and return to normal
- OR: Press button 4 times → 120s auto calibration

## Important Notes
- First time out of box: USB power for **24 hours** for accurate data
- First boot: wait **30 minutes** for accurate display
- TVOC affected by smoke, alcohol, perfume — returns normal after a period
- NOT for professional/laboratory testing (household detector)
- Alarm defaults: CO2>1600, CO>161, PM2.5>116, HCHO>0.31

## Pre-Distribution Checklist (DewS reminder)
- ⚠️ **ตั้ง Sleep = 0 ทุกเครื่องก่อนส่งให้อาสา** (Tuya Smart App → Settings → Sleep)
