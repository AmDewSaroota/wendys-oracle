# Lesson: Listen Before Action + Sub-tab Pattern

**Date**: 2026-03-26
**Source**: EcoStove Dashboard session
**Tags**: #ux #communication #chartjs #admin

## Pattern: Clarify Before Destructive Action

DewS said "ลบ session ออกจากเชิงลึก" — I almost removed both Session Timeline table AND drill-down charts. But DewS corrected: "Session Timeline เอาไว้ๆ ไม่ลบ แต่ไม่เอากราฟที่แยกรายบ้าน"

**Rule**: When told to "remove X", always clarify which specific part of X — especially when X has multiple sub-components.

## Pattern: Sub-tab for Infrequent Features

Admin Sessions was first built as a standalone main tab. DewS immediately asked to move it into "ข้อมูล" as a sub-tab. Reasoning: it's a "look back" feature, not daily-use. Keeping main tabs clean = better UX.

**Rule**: Features used for review/audit → sub-tab. Features used daily → main tab.

## Pattern: Dynamic Chart.js pointRadius

```js
const ptR = dataPoints.length <= 7 ? 5 : 0;
```

When data is sparse (<=7 days), show visible dots. When dense (>7 days), hide them for clean lines. Solves the "invisible single dot" problem.

## Pattern: switchDataSubTab Generalization

```js
['sensor', 'tvoc', 'sessions'].forEach(k => {
    const btn = document.getElementById('data-sub-' + k);
    const content = document.getElementById('data-sub-' + k + '-content');
    if (btn) { btn.classList.remove('tab-active'); btn.classList.add('text-slate-500'); }
    if (content) content.classList.add('hidden');
});
```

Loop-based sub-tab switching scales better than individual toggles. Adding a 4th sub-tab = add one string to array.
