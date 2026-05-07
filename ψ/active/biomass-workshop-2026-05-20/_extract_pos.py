import fitz, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
doc = fitz.open(r'C:\Users\NDFlt02\OneDrive\Documents\หนังสือเชิญ นายภิญโญ ตัณรัตนมณฑล.pdf')
page = doc[1]
ph = page.rect.height
pw = page.rect.width
print(f'Page: {pw} x {ph} pt')
keywords = ['ชื่อ', 'ตำแหน่ง', 'โทรศัพท์', 'เข้าร่วม', 'ผู้แทน', 'การเข้าร่วม']
blocks = page.get_text('dict')['blocks']
for b in blocks:
    if 'lines' not in b: continue
    for ln in b['lines']:
        for s in ln['spans']:
            txt = s['text'].strip()
            if not txt: continue
            if any(k in txt for k in keywords):
                bbox = s['bbox']
                x_pct = bbox[0] / pw * 100
                y_pct = bbox[1] / ph * 100
                y_end_pct = bbox[3] / ph * 100
                print(f'y:{y_pct:5.2f}-{y_end_pct:5.2f}% | x:{x_pct:5.2f}% | "{txt}"')
doc.close()
