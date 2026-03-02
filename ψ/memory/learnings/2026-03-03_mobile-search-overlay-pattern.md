# Lesson: Full-Screen Search Overlay > Bottom Sheet for Mobile

**Date**: 2026-03-03
**Source**: GeoThai project — mobile UX iteration
**Confidence**: High (verified with real user testing)

## Pattern

เมื่อสร้าง search UI บน mobile ที่มี dropdown results:
- **อย่าใช้ bottom sheet + dropdown** → dropdown ตกขอบจอ กดไม่ได้
- **ใช้ full-screen overlay แทน** → `position: fixed; inset: 0; z-index: 2000`
- Input อยู่บนสุด, results เป็น scrollable list ด้านล่าง
- ปุ่ม close ชัดเจน (✕ มุมขวาบน)

## Anti-Pattern

```
Bottom sheet (60vh) → search input → dropdown results → ตกออกนอกจอ ❌
```

## Correct Pattern

```
Full-screen overlay (100vh) → search input (top) → scrollable results → always visible ✅
```

## Also Learned

1. CSS media queries + Chrome DevTools responsive mode ≠ real mobile testing
2. Legend/controls ที่ดูเล็กบน desktop อาจบังทั้งจอบน mobile → ซ่อน default + toggle button
3. Parallel subagent strategy (3 data files + 1 main file) ลดเวลา implementation ~3x

## Tags

`mobile-ux`, `search-pattern`, `leaflet`, `responsive-design`, `geothai`
