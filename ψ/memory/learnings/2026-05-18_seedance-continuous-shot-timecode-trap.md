# Seedance: Time Code = Cut Point Trap

**Date**: 2026-05-18
**Project**: NDF Promo

## Pattern

การแบ่ง timestamp ใน Seedance prompt (เช่น `0:00-0:03 :` แล้ว `0:03-0:06 :`) ทำให้ Seedance ตีความเป็น cut point แม้จะเขียน `一镜到底无剪切` ไว้ก็ตาม

## วิธีแก้

ถ้าต้องการ continuous shot ให้:
1. **รวม timestamp เป็น block เดียว** เช่น `0:00-0:06 :` ทั้งหมดในนั้นไม่มี section break
2. **ระบุ physical camera movement** — `摄像机物理移动crane运动` ไม่ใช่แค่ "กล้องเคลื่อน"
3. **Negative prompt ภาษาอังกฤษ** — `absolutely no cuts before 0:XX, camera is physically moving on a crane dolly — NOT editing`

## Visual Signature ของ Genre

บอกแค่ชื่อเกม/ประเภทไม่พอ ต้องบอก DNA:
- **Snake game**: สายยาวเลี้ยวไล่กัน, top-down view, มีการกิน/ชนกัน → ใช้ `发光光流蜿蜒穿行互相追逐`
- **Fighting game**: ตัวละครยืนสู้แบบ Tron — Seedance default ไปที่นี่ถ้าบอกแค่ "VR arena"

## Full Prompt Rule

Seedance workflow = copy-paste ทั้งหมด ห้ามให้แค่ diff — ต้องให้ full prompt เสมอ
