# clearInterval ไม่หยุด execution ของ callback ปัจจุบัน

**Date**: 2026-05-21
**Source**: rrr: ecostove biomass session

## Pattern

```js
// ❌ ผิด — คิดว่า clearInterval จะหยุด code หลัง showAutoSessionSummary()
if (activeSession && !sessionEndSummaryShown) {
  sessionEndSummaryShown = true;
  showAutoSessionSummary(); // ภายใน function นี้มี clearInterval(pollTimer)
}
// code นี้ยังรันต่อ! clearInterval แค่หยุด future fires ไม่ใช่ current call stack

// ✅ ถูก — ต้อง return ในสายที่เรียกเอง
if (activeSession && !sessionEndSummaryShown) {
  sessionEndSummaryShown = true;
  showAutoSessionSummary();
  return;
}
```

## Context

EcoStove volunteer.html — เมื่อ session จบ poll ตรวจพบ → เรียก showAutoSessionSummary() (แสดง TVOC/CO) แต่ code รันต่อ → เรียก showReturnSummary() เขียนทับ TVOC/CO ออกทั้งหมด

## Rule

`clearInterval` / `clearTimeout` หยุดแค่ **future firings** ของ timer — ไม่หยุด execution ที่กำลังรันอยู่ใน call stack ปัจจุบัน ต้องการ `return` เสมอถ้าไม่อยากให้ code หลังรันต่อ
