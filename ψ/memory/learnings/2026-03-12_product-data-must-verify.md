# Lesson: ข้อมูลสินค้าต้อง verify ก่อนใส่สไลด์

**Date**: 2026-03-12
**Source**: rrr: wendys-oracle
**Context**: DewS จับได้ว่า AIS M30T + ZTE MF935 หาไม่เจอใน Shopee

## Pattern

เมื่อต้องใส่ข้อมูลสินค้า (รุ่น/ราคา/สต็อก) ลงในสไลด์หรือเอกสาร:
1. **ห้าม** ใช้ข้อมูลจาก AI knowledge cutoff
2. **ต้อง** research จาก web search ทุกครั้ง
3. **ต้อง** double-check ผลจาก research agent — บางทีบอกว่า "available" แต่จริงๆ ไม่มีขาย
4. เขียน source + วันที่อัปเดตในสไลด์เสมอ

## Anti-Pattern

- ใส่ชื่อรุ่นจากความจำ → รุ่นเลิกผลิต/หมดสต็อก → DewS เสียเวลาหา → เสียความน่าเชื่อถือ

## Applied

- อัปเดตสไลด์หน้า 9: ZTE MF935 (ไม่มีในไทย) → Tenda MF6, AIS M30T (เลิกขาย) → TP-Link M7000
- Redmi A3 (เคลียร์สต็อก) → Redmi A5, Galaxy A06 → A07
- AIS Gadget SIM (ห้าม hotspot!) → GOMO M

## Tags

`product-research`, `data-accuracy`, `slides`, `ecostove`
