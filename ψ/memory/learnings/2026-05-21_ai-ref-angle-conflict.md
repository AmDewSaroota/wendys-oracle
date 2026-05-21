# AI Image Gen — Ref Angle Conflict

**Date**: 2026-05-21
**Project**: NDF Promo / Engenius

## Pattern
เมื่อแนบ reference images ที่มี camera angle ต่างกันใน prompt เดียว — AI จะ blend ทั้งสองออกมาพร้อมกัน ได้ภาพที่ไม่สมเหตุสมผล (over-shoulder + front-facing ในเฟรมเดียว)

## Rule
- แนบ ref เฉพาะรูปที่ camera angle เดียวกันเท่านั้น
- ถ้าต้องการ environment จาก ref ที่ angle ต่าง → บรรยายใน text แทน อย่าแนบ ref นั้น
- ใช้ "Use the first image ONLY as environment reference — do NOT copy its camera angle" ถ้าจำเป็นต้องแนบ

## Context
NDF Promo Engenius — พยายาม gen over-shoulder shot โดยแนบทั้ง ShotC (front-facing) และ Angle (over-shoulder) → ได้ composite ที่ไม่ make sense
