# Lesson: Projection Mapping Hardware Architecture

**Date**: 2026-06-11
**Source**: rrr: midwinter-calc-v2-economy-projector

## 1 PC vs 10 Mini PCs

สำหรับ 10 โต๊ะ — 1 PC multi-output แพงกว่าและเสี่ยงกว่า:
- 1 PC + multi-GPU: ฿215k–335k + single point of failure
- 10 mini PCs แยก: ฿150k + ถ้าพังโต๊ะเดียวดับ

ข้อสรุป: **1 mini PC per table = standard ของ industry**

## Central Control via WiFi

ไม่ต้องซื้อ server เพิ่ม — ใช้ mini PC ตัวใดตัวหนึ่งเป็น server ได้
Control ผ่าน web app บน LAN → มือถือ/tablet สั่งได้เลย
NDF build เองได้ใน 1-2 วัน → รวมใน Scope C → added value ฟรี

## Economy Projector Option

ViewSonic LS740HD: ฿45,900 retail → ฿56k selling (21% markup)
- 5,000lm (vs PT-VMZ51 5,200lm) — ใกล้เคียงมาก
- ต้องยืนยัน ceiling mount compatibility ก่อน site visit
- B section economy: ฿710k–800k (vs Standard ฿1.56M–1.70M)

## Mini PC Spec สำหรับ Projection Mapping

Minimum viable:
- CPU: Core i5 / Ryzen 5
- RAM: 8–16GB
- GPU: Dedicated 4GB VRAM (GTX 1650+)
- Storage: 256GB SSD
- ราคาตลาด: ฿8,000–15,000 (ก่อน NDF markup)
