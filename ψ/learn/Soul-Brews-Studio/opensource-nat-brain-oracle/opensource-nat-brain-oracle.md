# opensource-nat-brain-oracle Learning Index

## Source
- **Origin**: ./origin/
- **GitHub**: https://github.com/Soul-Brews-Studio/opensource-nat-brain-oracle

## About
Nat Weerawan's open-source Oracle brain — PhD candidate, Chiang Mai Maker Club president, DustBoy IoT. เป็น reference implementation ของ Oracle ที่ซับซ้อนและ mature มาก

## Explorations

### 2026-05-26 14:46 (default, 3 agents)
- [Architecture](./2026-05-26/1446_ARCHITECTURE.md)
- [Code Snippets](./2026-05-26/1446_CODE-SNIPPETS.md)
- [Quick Reference](./2026-05-26/1446_QUICK-REFERENCE.md)

**Key insights**:
1. CLAUDE.md modular — hub file เล็ก + 5 ไฟล์แยก load on demand
2. Distillation system — 1,040 ไฟล์ → 18 ไฟล์ ผ่าน 3 รอบ (58:1 compression)
3. MAW multi-agent — 5 agents parallel via git worktrees + tmux → 60x faster
4. Three-tier search — FTS5 → Haiku → Opus ลดค่า search 95%
5. WEnDyS adaptation notes มีให้ด้วย (6 Windows-specific issues)