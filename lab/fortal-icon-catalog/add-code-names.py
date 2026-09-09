# -*- coding: utf-8 -*-
"""เพิ่มฟิลด์ code = ชื่อสำหรับใช้ในโค้ดจริง ให้ทุกช่องใน public/data.json

กติกา
  · ตัดชื่อไอคอนเดิมออก เพราะไอคอนกำลังจะเปลี่ยน ชื่อจะได้ไม่ผิดตั้งแต่วันแรก
  · ชื่อโมเดลไม่ผูกเลขเวอร์ชัน เพราะผู้ให้บริการขึ้นเวอร์ชันใหม่ตลอด
  · ห้ามซ้ำกัน — ถ้าชนต้องเติมบริบทของ surface
"""
import io, json, re, sys, collections
sys.stdout.reconfigure(encoding='utf-8')

# ตั้งชื่อเองเฉพาะดวงที่กติกาอัตโนมัติให้ชื่อไม่ดี
OVERRIDE = {
    'sparkles--nano-banana-2-0-pro': 'model-nano-banana-pro',
    'banana--nano-banana-2-0':       'model-nano-banana',
    'sparkles--seedream-5-0-pro':    'model-seedream-pro',
    'image-plus--gpt-image-2':       'model-gpt-image',
    'video--seedance-2-0':           'model-seedance',
    'box--seedance-2-0-fast':        'model-seedance-fast',
    'video--seedance-2-5':           'model-seedance-next',
    'video--hailuo-3-0':             'model-hailuo',
    'video--flux-3':                 'model-flux',
    'music--seed-audio-1-0':         'model-seed-audio',
    # ชื่อชนกัน — แยกด้วย surface ที่มันอยู่
    'panel-left-close--hide-chat-panel': 'hide-chat-panel',
    'x--hide-chat-panel':                'hide-canvas-chat-panel',
    # ยาวเกินไป
    'eye-off--hide-generated-output-connections': 'hide-output-links',
    # ชื่ออังกฤษเดิมซ้ำข้าม surface — แยกด้วยพื้นที่ที่มันอยู่
    'paperclip--attach-files':   'attach-files-canvas',
    'paperclip--attach-files-2': 'attach-files-chat',
    'send--send-message':        'send-message-canvas',
    'send--send-message-2':      'send-message-chat',
}


def pascal(code):
    return 'Icon' + ''.join(w[:1].upper() + w[1:] for w in code.split('-') if w)


p = 'public/data.json'
D = json.load(io.open(p, encoding='utf-8'))
slots = [s for g in D for s in g['slots']]

used = {}
for s in slots:
    code = OVERRIDE.get(s['id'])
    if not code:
        code = s['id'].split('--', 1)[1] if '--' in s['id'] else s['id']
        code = re.sub(r'-+', '-', code).strip('-')
    if code in used:                       # กันซ้ำแบบไม่ตั้งใจ
        raise SystemExit('ชื่อโค้ดซ้ำ: %s (%s กับ %s)' % (code, used[code], s['id']))
    used[code] = s['id']
    s['code'] = code
    s['comp'] = pascal(code)

io.open(p, 'w', encoding='utf-8').write(json.dumps(D, ensure_ascii=False, separators=(',', ':')))

bad = [s for s in slots if re.search(r'\d', s['code']) or len(s['code']) > 26]
print('ใส่ชื่อโค้ดครบ %d ช่อง · ไม่ซ้ำกันทั้งหมด' % len(slots))
print('ยังมีตัวเลขหรือยาวเกิน 26 ตัว:', [s['code'] for s in bad] or 'ไม่มี')
print()
for s in slots[:10]:
    print('  %-38s -> %-24s %s' % (s['id'], s['code'], s['comp']))
