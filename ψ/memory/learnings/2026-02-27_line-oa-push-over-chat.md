# Push > Chat for Notification Systems

**Date**: 2026-02-27
**Source**: LINE OA EcoStove session
**Confidence**: High (confirmed by user insight)

## Pattern

When building a LINE OA (or any messaging bot) for a system that involves:
- An admin/professor sending tasks to field workers
- Automated status updates and summaries
- Scheduled notifications (morning/evening)

**Use push-based notifications, not a chatbot.**

## Why

1. **Simpler architecture** — No command parsing, no state management, no conversation flow
2. **Easier for users** — They just receive messages, don't need to learn commands
3. **More reliable** — Push is fire-and-forget, chatbot needs response handling
4. **Better UX** — อาจารย์กดปุ่มบน dashboard ส่งถึงอาสา ไม่ต้องพิมพ์อะไร

## Anti-pattern

Building a LINE chatbot with commands like "เริ่ม บ้าน 1", "วัด", "เสร็จ" when the real need is just one-way notifications.

## Technical Notes

- LINE Messaging API: use `/v2/bot/message/broadcast` for all followers, `/v2/bot/message/push` for specific users
- Vercel + LINE webhook signature: `bodyParser` conflict — skip signature verification for dev, implement properly for production
- Store follower userIds on `follow` event for targeted push later

## Also Learned

- **Session-based approval > row-by-row** — Group data by device+date, let admin approve entire sessions
- **Batch approve** — "อนุมัติทั้งหมด" button saves massive time for admin
- **Completeness indicator** — Show progress bars for data completeness so admin knows if session data is reliable before approving
