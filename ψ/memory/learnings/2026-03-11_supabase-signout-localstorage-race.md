# Supabase signOut + localStorage Race Condition

**Date**: 2026-03-11
**Context**: EcoStove Dashboard logout ค้าง
**Source**: rrr: wendys-oracle

## Pattern

เมื่อใช้ `supabaseClient.auth.signOut()` ร่วมกับ manual `clearSupabaseSession()` ที่ลบ localStorage keys ทั้งหมดที่ขึ้นต้นด้วย `sb-`:

```javascript
// BAD — onAuthStateChange อาจไม่ fire
try { await supabaseClient.auth.signOut(); } catch (_) {}
clearSupabaseSession(); // ลบ localStorage → Supabase client สับสน
// onAuthStateChange ไม่ fire SIGNED_OUT → UI ค้าง
```

## Fix

Force clear application state manually หลังจาก signOut + clear:

```javascript
// GOOD — guarantee UI switches regardless
try { await supabaseClient.auth.signOut(); } catch (_) {}
clearSupabaseSession();
// Force clear state
isAdmin = false;
authUser = null;
currentAdmin = '';
switchView('basic');
```

## Lesson

อย่าพึ่ง event-driven flow อย่างเดียวสำหรับ critical UX actions (เช่น logout) — ใส่ fallback ที่ทำงานตรงๆ เสมอ

## Tags

`supabase`, `auth`, `signout`, `localStorage`, `race-condition`, `ui-state`
