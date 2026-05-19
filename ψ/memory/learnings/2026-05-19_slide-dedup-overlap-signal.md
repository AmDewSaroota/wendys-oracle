# Lesson: Overlap signal จากผู้สอน + Table vs Card

**Date**: 2026-05-19
**Source**: ai-video-prompt-slides refactoring session

## ถ้าผู้สอนข้ามทั้ง section — นั่นคือ redundant signal ที่ชัดสุด

เมื่อ DewS บอกว่า "ตอนสอนน้องแทบข้ามทั้ง Part 3 เลย" นั่นคือ feedback ที่แม่นยำกว่าการ audit เนื้อหาเอง — ผู้สอนรู้สึกถึง redundancy ก่อน audit จะเจอ

## Table เหมาะสำหรับ N>2 แต่ 2-item comparison ใช้ card ดีกว่า

| Situation | Use |
|-----------|-----|
| เปรียบ 3+ รายการ | Table |
| เปรียบ 2 ของ | Card เคียงกัน |

card เคียงกันให้ visual cue ทันทีว่า "สองอย่างนี้ต่างกัน" โดยไม่ต้องอ่าน header

## ไฟล์ teaching assets ต้องอยู่ใน repo

ถ้า teaching asset อยู่แค่ใน working directory ไม่ได้ commit → เสี่ยง drift ระหว่างเครื่อง
