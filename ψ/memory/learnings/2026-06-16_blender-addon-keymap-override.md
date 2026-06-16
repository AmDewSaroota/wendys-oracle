# Blender Addon Keymap Override Limitation

**Date**: 2026-06-16
**Context**: Maya Config Addon สำหรับ Blender

## Pattern
Blender addon keymaps ถูก append หลัง default keymap เสมอ — addon ไม่สามารถ override default binding ได้โดยตรง

## วิธีแก้ที่ถูกต้อง
ถ้าต้องการ force override key ที่ default ใช้อยู่ ต้องทำ 2 ขั้นตอนใน `register()`:
1. หา existing keymap item แล้ว disable/remove มัน
2. เพิ่ม addon keymap item ใหม่

```python
# ตัวอย่าง: force override Space bar
kc_user = bpy.context.window_manager.keyconfigs.user
km_user = kc_user.keymaps.get('3D View')
if km_user:
    for kmi in km_user.keymap_items:
        if kmi.type == 'SPACE' and not kmi.any:
            kmi.active = False  # disable แทน remove (safer)
```

## Industry Compatible Keyconfig
ต่างจาก Blender default อย่างมาก — addon ที่ออกแบบสำหรับ default อาจมี conflict ที่ไม่คาดคิด
ควร test กับ keyconfig ที่ user ใช้จริงด้วย

## Tags
blender, addon, keymap, override, industry-compatible
