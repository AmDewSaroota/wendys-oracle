# -*- coding: utf-8 -*-
"""ยุบช่องที่เราตัดสินแล้วว่าใช้ไอคอนดวงเดียวกัน ให้เหลือช่องเดียว
   ตำแหน่งที่มันไปโผล่ทั้งหมดเก็บไว้ในฟิลด์ uses — ทะเบียนจะได้ตรงกับจำนวนดวงที่ต้องวาดจริง
   ถ้าวันหลังอยากแยกดวงไหนออก ค่อยเพิ่มช่องกลับเข้าไป
"""
import io, json, sys
sys.stdout.reconfigure(encoding='utf-8')

# ช่องที่เก็บไว้ : [ช่องที่ยุบเข้ามา]
MERGE = {
    'video--seedance-2-0':      ['video--seedance-2-5', 'box--seedance-2-0-fast'],
    'banana--nano-banana-2-0':  ['sparkles--nano-banana-2-0-pro'],
    'paperclip--attach-files':  ['paperclip--attach-files-2'],
    'send--send-message':       ['send--send-message-2'],
    'panel-left-close--hide-chat-panel': ['x--hide-chat-panel'],
}
# ชื่อใหม่ของช่องที่เก็บไว้ (ให้ครอบคลุมทุกที่ที่มันไปโผล่)
RENAME = {
    'video--seedance-2-0':      ('โมเดลวิดีโอ Seedance', 'Seedance', 'IconModelSeedance'),
    'banana--nano-banana-2-0':  ('โมเดลภาพ Nano Banana', 'Nano Banana', 'IconModelNanoBanana'),
    'paperclip--attach-files':  ('แนบไฟล์', 'Attach files', 'IconAttachFiles'),
    'send--send-message':       ('ส่งข้อความ', 'Send message', 'IconSendMessage'),
    'panel-left-close--hide-chat-panel': ('ซ่อนแผงแชท', 'Hide chat panel', 'IconHideChatPanel'),
}

p = 'public/data.json'
D = json.load(io.open(p, encoding='utf-8'))
BY = {}
for g in D:
    for s in g['slots']:
        s.pop('grp', None)
        s.pop('sug', None)
        BY[s['id']] = (g, s)

drop = set()
for keep, gone in MERGE.items():
    assert keep in BY, keep
    kg, ks = BY[keep]
    uses = [{'route': ks['route'], 'label': ks['label'], 'th': ks['th'], 'icon': kg['icon']}]
    for d in gone:
        assert d in BY, d
        dg, ds = BY[d]
        uses.append({'route': ds['route'], 'label': ds['label'], 'th': ds['th'], 'icon': dg['icon']})
        drop.add(d)
    ks['uses'] = uses
    if keep in RENAME:
        ks['th'], ks['en'], ks['comp'] = RENAME[keep]

for g in D:
    g['slots'] = [s for s in g['slots'] if s['id'] not in drop]
    g['n'] = len(g['slots'])
D = [g for g in D if g['n'] > 0]

io.open(p, 'w', encoding='utf-8').write(json.dumps(D, ensure_ascii=False, separators=(',', ':')))

S = [x for g in D for x in g['slots']]
print('ยุบ %d ช่อง · เหลือ %d ช่อง · %d กลุ่มไอคอนเดิม' % (len(drop), len(S), len(D)))
for keep in MERGE:
    s = [x for x in S if x['id'] == keep][0]
    print('  %-22s ใช้ %d ตำแหน่ง : %s' % (s['comp'], len(s['uses']), ' · '.join(u['th'] for u in s['uses'])))
dupg = [g for g in D if g['n'] > 1 and g['icon'] != '__new__']
print('ไอคอนเดิมที่ยังใช้ซ้ำ: %d ดวง ครอบคลุม %d ช่อง' % (len(dupg), sum(g['n'] for g in dupg)))
