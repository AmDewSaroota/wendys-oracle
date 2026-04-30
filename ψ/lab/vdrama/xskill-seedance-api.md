# xSkill.ai — Seedance 2.0 API Reference

> Learned: 2026-04-30
> API Key: sk-1257e4d578eb1d4925c5a25dbed772c137cfe10797b797e9

## Overview

xSkill.ai (NEX AI) เป็น **API aggregator** ที่รวมโมเดล AI หลายตัว รวมถึง **Seedance 2.0** ของ ByteDance
ให้เราใช้ API key เดียวเรียกได้หลายโมเดล

## Endpoints

| Action | Method | URL |
|--------|--------|-----|
| สร้าง Task | POST | `https://api.xskill.ai/api/v3/tasks/create` |
| ดูผล Task | POST | `https://api.xskill.ai/api/v3/tasks/query` |
| MCP endpoint | — | `https://api.xskill.ai/api/v3/mcp-http` |

## Models ที่ใช้ได้

| Model ID | ใช้ทำอะไร |
|----------|----------|
| `st-ai/super-seed2` | Video generation (Seedance 2.0) |
| `fal-ai/bytedance/seedream/v4.5/text-to-image` | Image generation |
| `fal-ai/bytedance/seedream/v4.5/edit` | Image editing |

## Seedance 2.0 Parameters

| Parameter | Type | Values |
|-----------|------|--------|
| `model` | string | `seedance_2.0` (quality) หรือ `seedance_2.0_fast` (เร็ว) |
| `prompt` | string | คำอธิบาย + อ้างอิงไฟล์ด้วย @image_file_N, @video_file_N, @audio_file_N |
| `functionMode` | string | `omni_reference` (default) หรือ `first_last_frames` |
| `ratio` | string | `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16` |
| `duration` | int | 4–15 วินาที |
| `image_files` | array | ไฟล์ภาพ (สูงสุด 9 ไฟล์) |
| `video_files` | array | ไฟล์วิดีโอ (สูงสุด 3, รวม ≤15 วินาที) |
| `audio_files` | array | ไฟล์เสียง (สูงสุด 3, รวม ≤15 วินาที) |

### Function Modes

1. **`omni_reference`** (default) — ใส่ reference ได้หลายแบบ (ภาพ + วิดีโอ + เสียง)
2. **`first_last_frames`** — ใส่ภาพเฟรมแรก + เฟรมสุดท้าย แล้วให้ AI สร้างวิดีโอระหว่างกลาง

### Input Limits

| Type | Max Count | Max Size | Formats |
|------|-----------|----------|---------|
| Images | 9 | 30 MB/file | jpeg, png, webp, bmp, tiff, gif |
| Videos | 3 (≤15s total) | 50 MB/file | mp4, mov |
| Audio | 3 (≤15s total) | 15 MB/file | mp3, wav |
| Total files | 12 | — | — |

## Code Examples

### 1. cURL — สร้าง Task (Text-to-Video)

```bash
curl -X POST "https://api.xskill.ai/api/v3/tasks/create" \
  -H "Authorization: Bearer sk-1257e4d578eb1d4925c5a25dbed772c137cfe10797b797e9" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "st-ai/super-seed2",
    "params": {
      "prompt": "A majestic dragon flying over misty mountains at dawn, cinematic lighting, epic scale",
      "model": "seedance_2.0",
      "functionMode": "omni_reference",
      "ratio": "16:9",
      "duration": 8
    }
  }'
```

### 2. cURL — Query Task

```bash
curl -X POST "https://api.xskill.ai/api/v3/tasks/query" \
  -H "Authorization: Bearer sk-1257e4d578eb1d4925c5a25dbed772c137cfe10797b797e9" \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "TASK_ID_FROM_CREATE"
  }'
```

### 3. Python — Full Flow

```python
import requests
import time

API_KEY = "sk-1257e4d578eb1d4925c5a25dbed772c137cfe10797b797e9"
BASE_URL = "https://api.xskill.ai/api/v3"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def create_video(prompt, ratio="16:9", duration=8, model="seedance_2.0"):
    """สร้างวิดีโอจาก text prompt"""
    payload = {
        "model": "st-ai/super-seed2",
        "params": {
            "prompt": prompt,
            "model": model,
            "functionMode": "omni_reference",
            "ratio": ratio,
            "duration": duration
        }
    }
    resp = requests.post(f"{BASE_URL}/tasks/create", json=payload, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()

def query_task(task_id):
    """เช็คสถานะ task"""
    payload = {"task_id": task_id}
    resp = requests.post(f"{BASE_URL}/tasks/query", json=payload, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()

def poll_until_done(task_id, interval=15, timeout=600):
    """Poll จนกว่าจะเสร็จ"""
    elapsed = 0
    while elapsed < timeout:
        result = query_task(task_id)
        status = result.get("status") or result.get("data", {}).get("status")
        print(f"[{elapsed}s] Status: {status}")

        if status in ("succeeded", "completed", "done"):
            return result
        elif status in ("failed", "error"):
            raise Exception(f"Task failed: {result}")

        time.sleep(interval)
        elapsed += interval

    raise TimeoutError(f"Task {task_id} timed out after {timeout}s")

# --- Usage ---
if __name__ == "__main__":
    # สร้างวิดีโอ
    result = create_video(
        prompt="A golden dragon soaring through clouds, dramatic lighting, cinematic camera movement",
        ratio="16:9",
        duration=8
    )
    print("Created:", result)

    task_id = result.get("task_id") or result.get("data", {}).get("task_id")

    # รอจนเสร็จ
    final = poll_until_done(task_id)
    print("Done:", final)
```

### 4. Python — Image-to-Video (ใช้รูปเป็น reference)

```python
import base64

def create_video_from_image(image_path, prompt, ratio="16:9", duration=8):
    """สร้างวิดีโอจากรูปภาพ"""
    # อ่านไฟล์เป็น base64
    with open(image_path, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode()

    payload = {
        "model": "st-ai/super-seed2",
        "params": {
            "prompt": f"@image_file_1 {prompt}",
            "model": "seedance_2.0",
            "functionMode": "omni_reference",
            "ratio": ratio,
            "duration": duration,
            "image_files": [image_b64]
        }
    }
    resp = requests.post(f"{BASE_URL}/tasks/create", json=payload, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()
```

### 5. JavaScript — Node.js

```javascript
const API_KEY = "sk-1257e4d578eb1d4925c5a25dbed772c137cfe10797b797e9";
const BASE_URL = "https://api.xskill.ai/api/v3";

async function createVideo(prompt, ratio = "16:9", duration = 8) {
  const resp = await fetch(`${BASE_URL}/tasks/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "st-ai/super-seed2",
      params: {
        prompt,
        model: "seedance_2.0",
        functionMode: "omni_reference",
        ratio,
        duration
      }
    })
  });
  return resp.json();
}

async function queryTask(taskId) {
  const resp = await fetch(`${BASE_URL}/tasks/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ task_id: taskId })
  });
  return resp.json();
}

async function pollUntilDone(taskId, interval = 15000, timeout = 600000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await queryTask(taskId);
    const status = result.status || result.data?.status;
    console.log(`Status: ${status}`);

    if (["succeeded", "completed", "done"].includes(status)) return result;
    if (["failed", "error"].includes(status)) throw new Error(`Failed: ${JSON.stringify(result)}`);

    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error("Timeout");
}

// Usage
const result = await createVideo("A dragon breathing fire in slow motion, epic cinematic shot");
const taskId = result.task_id || result.data?.task_id;
const final = await pollUntilDone(taskId);
console.log("Video URL:", final.data?.video_url);
```

## MCP Configuration

สำหรับใช้กับ Claude Code / Cursor:

```json
{
  "mcpServers": {
    "xskill-seedance": {
      "url": "https://api.xskill.ai/api/v3/mcp-http",
      "headers": {
        "Authorization": "Bearer sk-1257e4d578eb1d4925c5a25dbed772c137cfe10797b797e9"
      }
    }
  }
}
```

MCP tools ที่ได้:
- `submit_task` — สร้าง task
- `get_task` — ดูผล task
- `upload_image` — อัพโหลดรูป

## Task Status Values

| Status | ความหมาย | ทำอะไรต่อ |
|--------|----------|----------|
| `queued` | รอคิว | Poll ต่อ |
| `running` | กำลังสร้าง | Poll ต่อ |
| `succeeded` | เสร็จแล้ว | ดาวน์โหลดวิดีโอ |
| `failed` | ล้มเหลว | ดู error message |

## Tips

- ใช้ `seedance_2.0_fast` ถ้าต้องการเร็ว (~60 วินาที) / `seedance_2.0` ถ้าต้องการคุณภาพ
- Generation time ประมาณ 60 วินาที (fast) ถึงหลายนาที (quality)
- Video URL หมดอายุใน 24 ชั่วโมง — ต้องดาวน์โหลดมาเก็บ
- ห้ามใส่หน้าคนจริง (realistic human faces) — ไม่รองรับ
- Prompt ภาษาอังกฤษได้ผลดีที่สุด
- output สูงสุด 2K resolution

## Notes

- xskill.ai เป็น aggregator — ไม่ใช่ API ของ ByteDance โดยตรง
- Official ByteDance Ark API ใช้ endpoint อื่น: `https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks`
- xskill.ai ทำให้ง่ายกว่า เพราะไม่ต้องสมัคร Volcengine/Ark account
