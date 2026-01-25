# Lesson Learned: Tuya Singapore Region = "sg" not "ap"

**Date**: 2026-01-25
**Context**: Setting up tinytuya wizard for Tuya Local API
**Project**: EcoStove / Biomass Stove

---

## The Problem

Tuya wizard kept failing with error:
```
'your ip(xxx) cross-region access is not allowed'
```

Even though:
- IP was added to whitelist
- All Service APIs were authorized
- Device was in Singapore Data Center

---

## The Solution

**Singapore Data Center uses region code `sg`, NOT `ap`!**

```bash
# Wrong (common assumption)
Enter Your Region: ap    # Asia Pacific - DOESN'T WORK

# Correct
Enter Your Region: sg    # Singapore - WORKS!
```

---

## Available Region Codes

| Code | Data Center |
|------|-------------|
| `us` | America |
| `eu` | Europe |
| `cn` | China |
| `in` | India |
| `ap` | Asia Pacific (NOT Singapore!) |
| `sg` | Singapore |

---

## How to Check Your Region

1. Go to Tuya IoT Platform
2. Check "Data Center" in Project Overview
3. If it says "Singapore Data Center" → use `sg`

---

## Key Takeaway

> Don't assume "ap" (Asia Pacific) covers Singapore.
> Singapore has its own region code: `sg`

This is NOT documented clearly in Tuya's official docs!

---

*Discovered during: tinytuya wizard troubleshooting*
