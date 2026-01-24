# Lesson Learned: Always Backup Before Reset

**Date**: 2026-01-24
**Context**: Wrong repo recovery session
**Category**: Git Safety

---

## The Situation

DewS ต้อง reset repo กลับไป commit เก่าเพราะ commit ล่าสุดผิด แต่ repo มีสถานะยุ่ง (revert ค้าง + diverged)

## The Lesson

**ก่อน `git reset --hard` ทุกครั้ง ให้สร้าง backup branch ก่อน**

```bash
# สร้าง backup ก่อน reset
git branch backup-<commit-hash> <current-commit>

# แล้วค่อย reset
git reset --hard <target-commit>
```

## Why This Matters

1. **Recovery**: ถ้า reset ผิด สามารถ checkout กลับไป backup ได้
2. **Reference**: ยังดู code เก่าได้ถ้าต้องการ
3. **Safety Net**: ไม่มีอะไรหายถาวร

## Related Pattern

สำหรับ 200 เครื่อง - คิด scale ตั้งแต่ต้น:
- ถ้ารู้ว่ามี N items มาก → ออกแบบ bulk operation
- อย่าทำ manual ทีละอัน
- Workflow: Bulk Import + QR Verification

---

*Discovered during: wrong-repo-recovery session*
