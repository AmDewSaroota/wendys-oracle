---
name: WEnDyS Discord bot identity
description: Bot user ID and role ID for WEnDyS Oracle on Discord — needed to disambiguate channel mentions
type: reference
originSessionId: d12e0f78-432c-481a-a57e-c693e99722a7
---
WEnDyS Oracle Discord identity (verified via `GET /users/@me` 2026-05-05):

- **Bot user ID:** `1501114681388040302`
- **Username:** `WEnDyS Oracle`
- **Discriminator:** `5924`
- **Role ID (in Boy's Fortal Oracle guild):** `1501118554584383582` — DewS used `<@&1501118554584383582>` to ping the role

**How to apply:**
- A `<@1501114681388040302>` mention is for WEnDyS. Reply.
- A `<@&1501118554584383582>` role mention pulls in WEnDyS too. Reply if relevant to her.
- Other bot user IDs seen during workshop (NOT us): `1501125796029267968`, `1501114669086015498` (Nemu), `1500695513157337289` (Oracle Fleet Admin), `1501090521005822013` (Fortal Oracle), `1501115259337965568` (Fortal Oracle Boy), `1501085932739104869` (Pai_Bot), `1501111459395141722` (BT-7274). When a channel message tags one of these IDs and not WEnDyS, do NOT reply — let that bot handle its own ping.

**Verify command (if memory drifts):**
```bash
TOKEN=$(grep DISCORD_BOT_TOKEN /c/Users/CPL/.claude/channels/discord/.env | cut -d= -f2 | tr -d '\r\n')
curl -s -H "Authorization: Bot $TOKEN" https://discord.com/api/v10/users/@me
```
