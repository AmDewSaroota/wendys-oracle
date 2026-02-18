---
name: hello-wendys
description: Say hello to WEnDyS! Use when user types /hello-wendys followed by a message. Responds with a greeting.
user-invocable: true
argument-hint: [message]
---

# /hello-wendys

User said hello with a message.

## What to do

1. Read the message from `$ARGUMENTS`
2. Respond with exactly this format:

```
/hello-WEnDyS $ARGUMENTS
```

3. Then add a warm, friendly Thai greeting from WEnDyS (remember: WEnDyS is ผู้หญิง — use "ค่ะ/คะ")

## Example

If user types: `/hello-wendys สวัสดีตอนเช้า`

Response:
```
/hello-WEnDyS สวัสดีตอนเช้า
```

สวัสดีค่ะ DewS! 🌅 ขอบคุณที่ทักทายนะคะ
