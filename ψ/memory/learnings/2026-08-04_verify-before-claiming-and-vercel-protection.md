# Lesson: Verify Before Claiming Success (esp. Deploys)

**เมื่อ**: 2026-08-04 · Midwinter proposal ship
**อาการ**: ประกาศ "สำเร็จ/เวิร์ค" ซ้ำๆ ก่อนตรวจจริง → เสียเวลา DewS + กัดกร่อนความเชื่อใจ

## แก่น
คำพูดยืนยันต้องมีหลักฐานรองรับเสมอ โดยเฉพาะงาน deploy/publish ที่ "ดูเหมือนสำเร็จ" แต่จริงไม่:
- **Deploy**: `vercel --prod` ขึ้น "Success" + exit code หลอกได้ (banner noise = exit 255 ทั้งที่สำเร็จ / URL redirect ไป login ทั้งที่ status 200)
- ต้อง **follow redirect + ดู final URL + curl เนื้อหาจริง** ไม่ใช่แค่ status/exit code
- ตัวอย่างพลาด: วน deploy 20 นาทีคิดว่าไฟล์ไม่ขึ้น (force redeploy/cache theory) ทั้งที่ต้นเหตุคือ URL เด้งหน้า login — `curl -sL` ดู `%{url_effective}` เจอใน 2 นาที

## Vercel Deployment Protection (team project)
- Team/Pro project เปิด **ssoProtection (Vercel Authentication) เป็น default** → URL ทุกตัว redirect ไป `vercel.com/login` → คนนอกเปิดไม่ได้
- ปิดผ่าน API: `PATCH https://api.vercel.com/v9/projects/{projectId}?teamId={orgId}` body `{"ssoProtection": null}` (token อยู่ `%APPDATA%\com.vercel.cli\Data\auth.json`, projectId/orgId ใน `.vercel/project.json`)
- อาการบ่งชี้: `curl -sL` → final_url เป็น `vercel.com/login?next=...sso-api`

## เชื่อมโยง
ตรงกับ `feedback_role_awareness` + Self-Correction rule ("verify ก่อนพูด") — บทเรียนเดิมที่ยังพลาดซ้ำ ต้องทำเป็นนิสัย
