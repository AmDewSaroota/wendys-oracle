/* แคตตาล็อกช่องไอคอน Fortal — ฝั่งหน้าเว็บ
   เก็บข้อมูลผ่าน /api/state, /api/action, /api/file/<id> · ตัวตนมาจากล็อกอิน Google */
(function () {
  'use strict';

  var DATA = [];        // กลุ่มไอคอน + ช่อง
  var SLOTS = [];
  var BYID = new Map();
  var STATE = new Map(); // id -> สถานะจากเซิร์ฟเวอร์
  var EVENTS = [];
  var ME = null;
  var VER = (window.__V || '0');
  var PLACES = 0;   // จำนวนตำแหน่งจริงในเว็บ (บางดวงใช้หลายที่)
  var TODRAW = [];  // ดวงที่ต้องวาดจริง (ไม่นับดวงที่ตัดสินว่าไม่ต้องวาด)
  var BRIEF = null;
  var COMMENTS = [];
  var FILTER = 'all', Q = '', PICKICON = '', PICKFAM = '';
  var OPEN = {};   // แผงบรีฟที่กางอยู่
  var PENDING_ID = null;
  var DEL_PENDING = null, DEL_TIMER = null;
  var BUSY = 0;

  var MAXB = 150 * 1024;
  var OK_EXT = ['svg', 'png', 'webp'];
  var MIME = { svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp' };
  var KIND = { ok: 'ตรงความหมาย', dup: 'ตรงแต่ซ้ำ', wrong: 'ไม่ตรง', new: 'ยังไม่มี' };
  var ACT = {
    up: 'ส่งไฟล์', re: 'ส่งไฟล์ใหม่ทับของเดิม', ok: 'กดผ่าน', rev: 'กดต้องแก้',
    undo: 'ยกเลิกสถานะ กลับไปรอรีวิว', note: 'เขียนหมายเหตุ', del: 'เอาไฟล์ออก',
    cmt: 'คอมเมนต์', link: 'ผูกให้ใช้ไอคอนร่วมกับช่องอื่น', unlink: 'ปลดการใช้ไอคอนร่วม'
  };
  var COPY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var CHAT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>';
  var DASH = '<svg class="cur" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/></svg>';

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('on'); }, 3400);
  }
  function ts(ms) {
    if (!ms) return '';
    var d = new Date(Number(ms));
    try { return d.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
    catch (_) { return d.toISOString().slice(0, 16).replace('T', ' '); }
  }
  function extOf(n) { var m = /\.([a-z0-9]+)$/i.exec(n || ''); return m ? m[1].toLowerCase() : ''; }
  /** ตัดส่วนที่คนมักติดท้ายชื่อไฟล์ออก — สำเนา เวอร์ชัน ความละเอียด */
  function baseName(s) {
    return String(s)
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[\s_-]*\(\d+\)\s*$/, '')
      .replace(/[\s_-]*(copy|final|ver|version)\s*\d*\s*$/i, '')
      .replace(/[\s_-]*@\s*\d+\s*x\s*$/i, '')
      .trim();
  }
  function norm(s) {
    return baseName(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  /** เทียบแบบหลวมสุด ตัดขีดทิ้ง — icon-generate กับ IconGenerate จะได้ตรงกัน */
  function loose(s) { return norm(s).replace(/-/g, ''); }


  /* ---------------- โครงหน้า ---------------- */
  function shell() {
    var k = { ok: 0, dup: 0, wrong: 0, new: 0 };
    SLOTS.forEach(function (s) { k[s.kind] = (k[s.kind] || 0) + 1; });
    return '' +
'<header class="top"><div class="hrow">' +
  '<div class="brand"><b>แคตตาล็อกช่องไอคอน Fortal</b>' +
    '<span>' + SLOTS.length + ' ดวงที่ต้องวาด · ไปใช้จริง ' + PLACES + ' ตำแหน่ง</span></div>' +
  '<span class="me" id="me"></span>' +
  '<div class="prog"><div class="pbar"><i id="pbar"></i></div>' +
    '<div class="pnum"><b id="pdone">0</b> / ' + SLOTS.length + ' ช่อง</div></div>' +
'</div></header>' +

'<main class="wrap">' +
  '<section class="hero">' +
    '<h1>วาดเสร็จแล้วลากไฟล์มาวางให้ตรงช่อง</h1>' +
    '<p>หนึ่งช่องคือไอคอนหนึ่งดวงที่ต้องวาดใหม่ ทุกช่องบอก <b>ตำแหน่งจริงในเว็บ</b> ไว้แล้ว — อยู่หน้าไหน และเป็นปุ่มที่มีป้าย <code>aria-label</code> ว่าอะไร · ช่องที่ติดป้ายทอง แปลว่าตอนนี้ <b>ยังใช้ไอคอนดวงเดียวกับที่อื่น</b> ต้องแยกให้มีดวงของตัวเอง</p>' +
    '<div class="steps">' +
      '<div class="step"><b>1 · ทำใน Figma</b><p>ตั้งชื่อเฟรมให้ตรงกับ<b>ชื่อไอคอน</b>ในลิสต์ (<button class="inlink" id="dlnames2">กดโหลดลิสต์ CSV</button> ไปตั้ง) แล้ว Export เป็น SVG ทั้งชุด</p></div>' +
      '<div class="step"><b>2 · ลากเข้าเว็บทีเดียว</b><p>ลากไฟล์ทั้งกองมาวางที่แถบ <b>“วางไฟล์ไอคอนที่นี่”</b> ด้านล่าง ระบบจับคู่เข้าช่องอัตโนมัติ ดูพรีวิวก่อนยืนยันได้</p></div>' +
      '<div class="step"><b>3 · พี่กี๋รีวิว</b><p>กดผ่านถ้าโอเค · ถ้ายังไม่ผ่าน คอมเมนต์บอกจุดที่ต้องแก้ในช่องนั้น คุยกันในหน้าเดียวจบ ทุกคนเห็นพร้อมกัน</p></div>' +
    '</div>' +
    '<div class="tiles">' +
      '<div class="tile a"><div class="n">' + SLOTS.length + '</div><p>ดวงที่ต้องวาดทั้งหมด · ไปใช้จริง ' +
        PLACES + ' ตำแหน่ง</p></div>' +
      '<div class="tile g"><div class="n">' + k.dup + '</div><p>ตรงความหมาย แต่ยังใช้ไอคอนซ้ำกับที่อื่น</p></div>' +
      '<div class="tile r"><div class="n">' + k.wrong + '</div><p>ไอคอนสื่อผิดเรื่อง ต้องกำหนดสัญลักษณ์ใหม่</p></div>' +
      '<div class="tile n"><div class="n">' + k.new + '</div><p>ยังไม่มีไอคอนในระบบเลย</p></div>' +
    '</div>' +
  '</section>' +

  '<div id="brief"></div>' +

  '<div class="dropzone" id="bulk">' +
    '<div class="dzi"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/></svg></div>' +
    '<div class="dzt"><b>วางไฟล์ไอคอนที่นี่</b>' +
      '<p>ลากไฟล์ SVG จาก Figma มาทั้งกองทีเดียว — ระบบจับคู่เข้าช่องให้เองจากชื่อไฟล์ แล้วให้ดูพรีวิวก่อนยืนยัน · รับ SVG · PNG · WebP ไฟล์ละไม่เกิน 150 KB</p></div>' +
    '<div class="dzb"><button class="btn p" id="bulkpick">เลือกไฟล์จากเครื่อง</button>' +
      '<button class="btn" id="dlnames">โหลดรายชื่อไอคอน (CSV)</button></div>' +
  '</div>' +
  '<div class="figma">' +
    '<b>ทำใน Figma แล้วส่งเข้าที่นี่ยังไง</b>' +
    '<ol>' +
      '<li>ตั้งชื่อแต่ละเฟรม/คอมโพเนนต์ใน Figma ให้ตรงกับ <b>ชื่อไอคอน</b> ในรายการ เช่น <code>IconGenerate</code> (โหลดรายชื่อจากปุ่มด้านบน)</li>' +
      '<li>เลือกทุกเฟรม แล้ว Export เป็น SVG — Figma จะตั้งชื่อไฟล์ตามชื่อเฟรมให้เอง</li>' +
      '<li>ลากไฟล์ทั้งหมดมาวางที่แถบด้านบนนี้ทีเดียว ระบบจับคู่เข้าช่องให้เอง (ไม่สนตัวพิมพ์ใหญ่เล็กกับขีด)</li>' +
    '</ol>' +
  '</div>' +

  '<div class="areabar">จัดกลุ่มตาม<b>พื้นที่จริงในเว็บ</b> — วาดไล่ทีละหน้าจอ จะได้ชุดที่เข้ากัน · ' +
    'ป้ายทองบนดวงไหน แปลว่าดวงนั้นยังใช้รูปซ้ำกับที่อื่นอยู่ กดดูได้ว่าซ้ำกับอะไร<br>' +
    '<b>ดูภาพหน้าจอ</b> เปิดได้ทุกคน · <b>เปิดหน้าจริง</b> ต้องล็อกอิน fortal.studio และเป็นสมาชิกโปรเจกต์ ' +
    'ถ้าไม่ใช่คนในทีมจะเปิดไม่ได้</div>' +
  '<div class="controls">' +
    '<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input id="q" type="search" placeholder="ค้นหา ชื่อไทย · ชื่ออังกฤษ · รหัสช่อง · หน้าเว็บ" autocomplete="off"></div>' +
    '<div class="chips" id="chips"></div>' +
    '<span style="flex:1"></span>' +
    '<button class="btn sm" id="bgtoggle">พื้นพรีวิว: อ่อน</button>' +
    '<button class="btn sm" id="expand">ล้างตัวกรอง</button>' +
  '</div>' +

  '<div id="feed"></div>' +
  '<div id="board"></div>' +

  '<footer>' +
    '<button class="btn p" id="dlok">ดาวน์โหลดที่ผ่านแล้ว (.zip)</button>' +
    '<button class="btn" id="dlall">ดาวน์โหลดทั้งหมดที่ส่งมา (.zip)</button>' +
    '<button class="btn" id="dlman">ดาวน์โหลด manifest.json</button>' +
    '<span class="sp"></span><span id="foot"></span>' +
  '</footer>' +
'</main>' +
'<input type="file" id="picker" multiple accept=".svg,.png,.webp,image/svg+xml,image/png,image/webp" hidden>';
  }

  /* ---------------- คุยกับเซิร์ฟเวอร์ ---------------- */
  function api(body) {
    return fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || ('ผิดพลาด ' + r.status));
        return j;
      });
    });
  }

  var polling = null;
  function pull(silent) {
    return fetch('/api/state', { cache: 'no-store' })
      .then(function (r) {
        if (r.status === 401) { location.href = '/signin'; throw new Error('unauthorized'); }
        return r.json();
      })
      .then(function (j) {
        ME = j.me;
        STATE.clear();
        Object.keys(j.slots || {}).forEach(function (k) { STATE.set(k, j.slots[k]); });
        EVENTS = j.events || [];
        COMMENTS = j.comments || [];
        render();
      })
      .catch(function (e) { if (!silent) toast('โหลดข้อมูลไม่สำเร็จ · ' + e.message); });
  }
  function startPolling() {
    if (polling) clearInterval(polling);
    polling = setInterval(function () { if (!document.hidden && !BUSY) pull(true); }, 8000);
    // กลับมาที่แท็บนี้เมื่อไหร่ ดึงของใหม่ทันที ไม่ต้องรอรอบถัดไป
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !BUSY) pull(true);
    });
    window.addEventListener('focus', function () { if (!BUSY) pull(true); });
  }

  /* ---------------- รับไฟล์ ---------------- */
  function readFile(f) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = function () { rej(new Error('read')); };
      r.readAsDataURL(f);
    });
  }
  function accept(id, f) {
    var ext = extOf(f.name);
    if (OK_EXT.indexOf(ext) < 0) { toast('รับเฉพาะ SVG · PNG · WebP — ไฟล์นี้เป็น .' + (ext || '?')); return Promise.resolve(false); }
    if (f.size > MAXB) { toast('ไฟล์ใหญ่ ' + Math.round(f.size / 1024) + ' KB เกิน 150 KB'); return Promise.resolve(false); }
    var sl = BYID.get(id);
    BUSY++;
    return readFile(f)
      .then(function (data) {
        return api({ op: 'upload', id: id, th: sl ? sl.th : id, name: f.name, mime: MIME[ext], data: data });
      })
      .then(function () {
        var nm = (sl && sl.th) || id;
        toast((sl && sl._exists ? '' : '') + 'ส่ง ' + f.name + ' เข้าช่อง ' + nm + ' แล้ว');
        return true;
      })
      .catch(function (e) { toast('อัปโหลดไม่สำเร็จ · ' + e.message); return false; })
      .then(function (r) { BUSY--; return r; });
  }
  function matchFile(name) {
    var nm = norm(name);
    if (nm.length < 2) return null;             // ชื่อที่เหลือค่าว่าง/สั้นเกิน (เช่นภาษาไทยล้วน) ไม่จับคู่
    var id = NORMID.get(nm);
    if (id) return { id: id, how: 'ตรงชื่อ' };
    var lo = loose(name);
    if (lo.length < 2) return null;
    id = LOOSEID.get(lo);
    if (id) return { id: id, how: 'ตรงแบบไม่สนขีดกับตัวพิมพ์' };
    return null;
  }

  /** ให้ดูก่อนว่าไฟล์ไหนจะลงช่องไหน แล้วค่อยยืนยัน */
  function bulk(files) {
    var rows = files.map(function (f) {
      var ext = extOf(f.name);
      var bad = OK_EXT.indexOf(ext) < 0 ? 'ชนิดไฟล์ไม่รองรับ'
              : (f.size > MAXB ? 'ไฟล์ใหญ่เกิน 150 KB' : null);
      var m = bad ? null : matchFile(f.name);
      return { f: f, m: m, sl: m ? BYID.get(m.id) : null, bad: bad };
    });
    var okRows = rows.filter(function (r) { return r.m && !r.bad; });
    var body = '<div class="mtable">' + rows.map(function (r) {
      var right = r.bad ? '<span class="x">' + esc(r.bad) + '</span>'
        : r.m ? '<span class="y">' + esc(r.sl ? r.sl.th : r.m.id) + '</span>' +
                '<span class="how">' + esc(r.m.how) + '</span>'
              : '<span class="x">ไม่มีช่องชื่อนี้</span>';
      return '<div class="mrow"><span class="fn">' + esc(r.f.name) + '</span>' + right + '</div>';
    }).join('') + '</div>';
    return ask({
      title: 'พร้อมส่ง ' + okRows.length + ' จาก ' + rows.length + ' ไฟล์',
      body: body + (okRows.length < rows.length
        ? '<p class="hint4">ไฟล์ที่จับคู่ไม่ได้จะถูกข้าม — เปลี่ยนชื่อไฟล์ให้ตรงกับชื่อใต้ภาพแล้วลากใหม่ได้</p>' : ''),
      ok: okRows.length ? 'ยืนยันการส่ง' : 'ปิด'
    }).then(function (yes) {
      if (!yes || !okRows.length) return;
      var i = 0, hit = 0;
      return (function step() {
        if (i >= okRows.length) {
          return pull(true).then(function () { toast(hit + ' ไฟล์เข้าช่องแล้ว'); });
        }
        var r = okRows[i++];
        return accept(r.m.id, r.f).then(function (okv) { if (okv) hit++; return step(); });
      })();
    });
  }

  var NORMID = new Map();
  var LOOSEID = new Map();

  /* ---------------- วาดหน้า ---------------- */
  function aliasOf(id) { var v = STATE.get(id); return (v && v.aliasOf) || null; }
  /** ช่องที่ถือไฟล์จริง — ถ้าช่องนี้ผูกไว้กับช่องอื่น ให้ไปเอาของช่องนั้น */
  function srcOf(id) { return aliasOf(id) || id; }
  function fileOf(id) { return STATE.get(srcOf(id)); }
  function linkedTo(id) {
    return SLOTS.filter(function (x) { return aliasOf(x.id) === id; });
  }
  /** ช่องนี้ถือว่ามีของแล้วหรือยัง (ส่งเองหรือผูกกับช่องที่มีของ) */
  function filled(id) { return !!fileOf(id); }
  function statusOf(id) {
    var v = STATE.get(id);
    if (v && v.aliasOf) return statusOf(v.aliasOf);
    return v ? (v.status || 'submitted') : 'none';
  }
  function match(s) {
    var st = statusOf(s.id);
    if (FILTER === 'todo' && st !== 'none') return false;
    if (FILTER === 'ref' && !s.ref) return false;
    if (FILTER === 'sent' && st !== 'submitted') return false;
    if (FILTER === 'ok' && st !== 'approved') return false;
    if (FILTER === 'rev' && st !== 'revise') return false;
    if (FILTER === 'dupg' && s.kind !== 'dup') return false;
    if (FILTER === 'cmt' && !openCount('slot:' + s.id)) return false;
    if (PICKICON && s._g.icon !== PICKICON) return false;
    if (PICKFAM && (!s.fam || s.fam.k !== PICKFAM)) return false;
    if (!Q) return true;
    var hay = (s.id + ' ' + (s.code || '') + ' ' + (s.comp || '') + ' ' + s.th + ' ' + s.en +
               ' ' + s.route + ' ' + s.label + ' ' + (s._g.icon || '')).toLowerCase();
    return hay.indexOf(Q) >= 0;
  }

  function slotHTML(s) {
    var al = aliasOf(s.id), v = fileOf(s.id), st = statusOf(s.id);
    var alSlot = al ? BYID.get(al) : null;
    var cn = cmtsOf('slot:' + s.id).length, op = openCount('slot:' + s.id);
    var cls = ['slot']; if (v) cls.push('has'); if (al) cls.push('link');
    if (st === 'approved') cls.push('ok');
    if (st === 'revise') cls.push('rev');
    var tag = st === 'approved' ? 'ผ่าน' : st === 'revise' ? 'ต้องแก้' : v ? 'ส่งแล้ว' : '';
    var art = v
      ? '<img class="shot" alt="' + esc(s.th) + '" src="/api/file/' + encodeURIComponent(srcOf(s.id)) + '?v=' + (v.at || 0) + '">'
      : (s._g.svg || DASH);
    var uses = (s.uses && s.uses.length > 1) ? s.uses.length : 0;
    var dupN = (s.kind === 'dup') ? s._g.n : 0;
    var linkTag = uses ? '<span class="ltag">ดวงเดียว ใช้ ' + uses + ' ตำแหน่ง</span>' : '';
    return '<article class="' + cls.join(' ') + '">' +
      '<div class="drop" data-drop="' + esc(s.id) + '" title="ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์">' +
        art + (tag ? '<span class="tag">' + tag + '</span>' : '') + linkTag +
      '</div>' +
      '<div class="body">' +
        (s.fam ? '<button class="famflag" data-fam="' + esc(s.fam.k) + '" data-from="' + esc(s.id) + '">' + esc(s.fam.n) +
          ' · ต้องเข้าชุดกัน</button>' : '') +
        (s.ref ? '<div class="refflag">อ้างอิงสัญลักษณ์' + (s.ref.who ? ' ' + esc(s.ref.who) : 'ของผู้ให้บริการ') +
          ' · วาดใหม่ในสไตล์เรา</div>' : '') +
        (dupN ? '<button class="dupflag" data-dupjump="' + esc(s._g.icon) + '" data-from="' + esc(s.id) + '">' +
          'ตอนนี้ใช้รูปเดียวกับอีก ' + (dupN - 1) + ' ที่ · ดูทั้งชุด</button>' : '') +
        '<div class="idrow"><code>' + esc(s.comp || s.id) + '</code>' +
          '<button data-copy="' + esc(s.comp || s.id) + '" title="คัดลอกชื่อไอคอน">' + COPY_SVG + '</button></div>' +
        '<div class="nm">' + esc(s.th) + '<em>' + esc(s.en) + '</em></div>' +
      '</div>' +
      '<button class="cbar' + (op ? ' hot' : '') + '" data-open="' + esc(s.id) + '">' +
        '<span class="ci">' + CHAT_SVG + (cn ? '<i>' + cn + '</i>' : '') + '</span>' +
        '<span class="ct">' + (cn ? (op ? op + ' คอมเมนต์ยังไม่ปิด' : cn + ' คอมเมนต์') : 'ยังไม่มีคอมเมนต์') + '</span>' +
        '<span class="go">รายละเอียด</span>' +
      '</button>' +
    '</article>';
  }

  function render() {
    var famName = PICKFAM ? (SLOTS.filter(function (x) { return x.fam && x.fam.k === PICKFAM; })[0] || {}).fam : null;
    var html = (PICKICON ? '<div class="pickbar">กำลังดูเฉพาะชุด <span class="mono">' + esc(PICKICON) +
      '</span> <button class="lnk" id="expand2">ดูทั้งหมด</button></div>' : '') +
      (famName ? '<div class="pickbar fam">กำลังดูเฉพาะ <b>' + esc(famName.n) +
        '</b> — ดวงพวกนี้ต้องหน้าตาเป็นพวกเดียวกัน แม้อยู่คนละพื้นที่' +
        ' <button class="lnk" id="expand2">ดูทั้งหมด</button></div>' : '') +
      renderByArea();
    $('#board').innerHTML = html || '<div class="empty">ไม่มีดวงที่ตรงกับที่ค้น</div>';

    var done = TODRAW.filter(function (s) { return filled(s.id); }).length;
    var okn = SLOTS.filter(function (s) { return statusOf(s.id) === 'approved'; }).length;
    $('#pdone').textContent = done;
    $('#pbar').style.width = (done / Math.max(1, TODRAW.length) * 100) + '%';
    $('#foot').textContent = 'ส่งแล้ว ' + done + ' ดวง · ผ่านรีวิว ' + okn + ' ดวง · ยังไม่ส่ง ' +
      (TODRAW.length - done) + ' ดวง';
    drawChips();
    drawFeed();
    drawMe();
    drawBrief();
    refreshDlg();
  }

  function sec(title, note, inner, count) {
    return '<section class="sec"><h2>' + title + ' <em>' + count + ' ดวง</em></h2>' +
      (note ? '<p>' + note + '</p>' : '') + inner + '</section>';
  }

  /** เรียงในพื้นที่เดียวกัน: ที่ยังใช้รูปซ้ำขึ้นก่อน แล้วไม่ตรง แล้วยังไม่มี แล้วที่เหลือ */
  var KORDER = { dup: 0, wrong: 1, new: 2, ok: 3 };
  function renderByArea() {
    var areas = [];
    SLOTS.filter(match).forEach(function (s) {
      var a = areas.filter(function (x) { return x.name === s.area; })[0];
      if (!a) { a = { name: s.area, ao: s.ao, list: [] }; areas.push(a); }
      a.list.push(s);
    });
    if (!areas.length) return '';
    areas.sort(function (a, b) { return a.ao - b.ao; });
    var nav = '<nav class="anav">' + areas.map(function (a, i) {
      return '<button data-go="area' + (i + 1) + '"><i>' + (i + 1) + '</i>' + esc(a.name) +
        '<em>' + a.list.length + '</em></button>';
    }).join('') + '</nav>';
    return nav + areas.map(function (a, idx) {
      function rank(x) {
        if (x._g.n > 1 && x._g.icon !== '__new__') return 0;          // ยังใช้รูปซ้ำ
        return (KORDER[x.kind] === 1 || KORDER[x.kind] === 2) ? 1 : 2; // ไม่ตรง/ยังไม่มี แล้วค่อยที่เหลือ
      }
      a.list.sort(function (x, y) {
        var d = rank(x) - rank(y);
        return d || (y._g.n - x._g.n);
      });
      var dup = a.list.filter(function (x) { return x.kind === 'dup'; }).length;
      var lk = (BRIEF && BRIEF.areaLinks && BRIEF.areaLinks[a.name]) || {};
      return '<section class="sec area" id="area' + (idx + 1) + '">' +
        '<h2><span class="anum">' + (idx + 1) + '</span>' + esc(a.name) +
        ' <em>' + a.list.length + ' ดวง</em>' +
        (dup ? '<em class="gold">' + dup + ' ดวงยังใช้รูปซ้ำ</em>' : '') +
        '<span class="alinks">' +
          ((lk.shots && lk.shots.length)
            ? '<button class="alink" data-shots="' + esc(lk.shots.join('|')) + '" data-t="' + esc(a.name) + '">ดูภาพหน้าจอ</button>' : '') +
          (lk.url ? '<a class="alink dim" href="' + esc(lk.url) + '" target="_blank" rel="noopener" ' +
            'title="ต้องล็อกอิน fortal.studio และเป็นสมาชิกโปรเจกต์">เปิดหน้าจริง ↗</a>' : '') +
          (lk.note ? '<span class="anote">' + esc(lk.note) + '</span>' : '') +
        '</span></h2>' +
        '<div class="flat">' + a.list.map(slotHTML).join('') + '</div></section>';
    }).join('');
  }

  /** กรองแล้วให้ดวงที่กดค้างอยู่ในสายตา ไม่เด้งไปบนสุด */
  function keepInView(id) {
    if (!id) return;
    var el = document.querySelector('[data-open="' + id + '"]');
    if (el) el.closest('.slot').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function drawMe() {
    if (!ME) return;
    $('#me').innerHTML = 'ใช้งานเป็น <b>' + esc(ME.name) + '</b>' +
      (ME.reviewer ? '' : ' <span class="ro">ดูและส่งไฟล์ได้ ไม่ได้รีวิว</span>') +
      '<a class="lnk" href="/api/auth/signout">ออกจากระบบ</a>';
  }

  function drawChips() {
    var c = {
      all: SLOTS.length,
      dupg: SLOTS.filter(function (s) { return s.kind === 'dup'; }).length,
      todo: TODRAW.filter(function (s) { return statusOf(s.id) === 'none'; }).length,
      ref: SLOTS.filter(function (s) { return !!s.ref; }).length,
      sent: SLOTS.filter(function (s) { return statusOf(s.id) === 'submitted'; }).length,
      ok: SLOTS.filter(function (s) { return statusOf(s.id) === 'approved'; }).length,
      rev: SLOTS.filter(function (s) { return statusOf(s.id) === 'revise'; }).length,
      cmt: SLOTS.filter(function (s) { return openCount('slot:' + s.id) > 0; }).length
    };
    var L = [['all', 'ทั้งหมด'], ['todo', 'ยังไม่ส่ง'], ['dupg', 'ยังใช้รูปซ้ำ'],
             ['sent', 'รอรีวิว'], ['ok', 'ผ่านแล้ว'],
             ['cmt', 'มีคอมเมนต์ค้าง'], ['ref', 'อ้างอิงแบรนด์']];
    $('#chips').innerHTML = L.map(function (p) {
      return '<button class="chip' + (FILTER === p[0] ? ' on' : '') + '" data-f="' + p[0] + '">' +
        p[1] + '<span class="c">' + c[p[0]] + '</span></button>';
    }).join('');
  }

  function drawFeed() {
    var box = $('#feed'); if (!box) return;
    if (!EVENTS.length) { box.innerHTML = ''; return; }
    var rows = EVENTS.slice(0, 10).map(function (e) {
      return '<li><span class="t">' + esc(ts(e.t)) + '</span>' +
        '<span><b>' + esc(e.u) + '</b> ' + esc(ACT[e.a] || e.a) + ' — ' + esc(e.th || e.slot) +
        ' <code>' + esc(e.slot) + '</code>' + (e.f ? ' <code>' + esc(e.f) + '</code>' : '') + '</span></li>';
    }).join('');
    box.innerHTML = '<div class="feed"><h3>ความเคลื่อนไหวล่าสุด <em>10 รายการล่าสุด</em></h3><ol>' + rows + '</ol></div>';
  }


  /* ---------------- คอมเมนต์ ---------------- */
  function cmtsOf(target) {
    return COMMENTS.filter(function (c) { return c.target === target; });
  }
  function openCount(target) {
    return cmtsOf(target).filter(function (c) { return !c.done; }).length;
  }
  function threadHTML(target, compact) {
    var list = cmtsOf(target);
    var rows = list.map(function (c) {
      var mine = ME && c.u === ME.name;
      return '<li class="msg' + (c.done ? ' done' : '') + '">' +
        '<div class="mh"><b>' + esc(c.u) + '</b><span class="t">' + esc(ts(c.t)) + '</span>' +
          (c.done ? '<span class="tick">ปิดประเด็นแล้ว</span>' : '') +
          '<span class="sp"></span>' +
          '<button class="lnk" data-cdone="' + c.id + '" data-want="' + (c.done ? '0' : '1') + '">' +
            (c.done ? 'เปิดใหม่' : 'ปิดประเด็น') + '</button>' +
          (mine ? '<button class="lnk" data-cdel="' + c.id + '">ลบ</button>' : '') +
        '</div>' +
        '<div class="mb">' + esc(c.text).replace(/\n/g, '<br>') + '</div>' +
      '</li>';
    }).join('');
    return '<div class="thread' + (compact ? ' cmp' : '') + '">' +
      (rows ? '<ul class="msgs">' + rows + '</ul>' : '') +
      '<div class="cin">' +
        '<textarea data-ctext="' + esc(target) + '" rows="1" placeholder="เขียนคอมเมนต์… (Ctrl+Enter เพื่อส่ง)"></textarea>' +
        '<button class="btn sm" data-csend="' + esc(target) + '">ส่ง</button>' +
      '</div>' +
    '</div>';
  }

  /* ---------------- บรีฟ ---------------- */
  function shotsHTML(files, alt) {
    return '<div class="shots">' + files.map(function (f) {
      return '<figure class="shot"><img src="/shots/' + esc(f) + '" alt="' + esc(alt) + '" data-zoom="/shots/' + esc(f) + '">' +
        '<figcaption>คลิกเพื่อดูใหญ่</figcaption></figure>';
    }).join('') + '</div>';
  }
  function ask(opt) {
    return new Promise(function (res) {
      var d = document.createElement('div');
      d.className = 'lb modal';
      d.innerHTML = '<div class="mcard" role="dialog" aria-modal="true">' +
        '<h3>' + esc(opt.title) + '</h3>' +
        (opt.body ? '<p>' + opt.body + '</p>' : '') +
        '<div class="mact"><button class="btn" data-no>ยกเลิก</button>' +
        '<button class="btn ' + (opt.danger ? 'danger' : 'p') + '" data-yes>' + esc(opt.ok || 'ตกลง') + '</button></div>' +
      '</div>';
      function close(v) { d.remove(); document.removeEventListener('keydown', key); res(v); }
      function key(e) { if (e.key === 'Escape') close(false); if (e.key === 'Enter') close(true); }
      d.addEventListener('click', function (e) {
        if (e.target.closest('[data-yes]')) return close(true);
        if (e.target.closest('[data-no]') || !e.target.closest('.mcard')) return close(false);
      });
      document.addEventListener('keydown', key);
      document.body.appendChild(d);
      var y = d.querySelector('[data-yes]'); if (y) y.focus();
    });
  }

  function zoomMany(files, title) {
    var d = document.createElement('div');
    d.className = 'lb shots-lb';
    d.innerHTML = '<div class="slb"><h4>' + esc(title) + '</h4>' +
      files.map(function (f) { return '<img src="/shots/' + esc(f) + '" alt="">'; }).join('') +
      '</div><button class="lbx" aria-label="ปิด">✕</button>';
    d.addEventListener('click', function (e) {
      if (!e.target.closest('img') || e.target.closest('.lbx')) d.remove();
    });
    document.addEventListener('keydown', function k(e) {
      if (e.key === 'Escape') { d.remove(); document.removeEventListener('keydown', k); }
    });
    document.body.appendChild(d);
  }

  function zoom(src) {
    var d = document.createElement('div');
    d.className = 'lb';
    d.innerHTML = '<img src="' + esc(src) + '" alt=""><button class="lbx" aria-label="ปิด">✕</button>';
    d.addEventListener('click', function () { d.remove(); });
    document.body.appendChild(d);
    document.addEventListener('keydown', function esc_(e) {
      if (e.key === 'Escape') { d.remove(); document.removeEventListener('keydown', esc_); }
    });
  }

  function panel(key, title, sub, inner, badge) {
    var open = !!OPEN[key];
    return '<section class="panel' + (open ? ' open' : '') + '">' +
      '<button class="ph" data-panel="' + key + '">' +
        '<span class="cv">' + (open ? '▾' : '▸') + '</span>' +
        '<b>' + title + '</b><span class="sub">' + sub + '</span>' +
        (badge ? '<span class="bd">' + badge + '</span>' : '') +
      '</button>' +
      (open ? '<div class="pb">' + inner + '</div>' : '') +
    '</section>';
  }

  function drawBrief() {
    var box = $('#brief'); if (!box || !BRIEF) return;
    var cnt = { ok: 0, dup: 0, wrong: 0, new: 0 };
    SLOTS.forEach(function (s) { cnt[s.kind]++; });

    var scope = '<div class="cards3">' + BRIEF.scope.map(function (x) {
      return '<div class="bcard"><b>' + esc(x.n) + ' · ' + esc(x.title) + '</b><p>' + esc(x.body) + '</p></div>';
    }).join('') + '</div>';

    var kinds = '<div class="cards4">' + BRIEF.kinds.map(function (k) {
      return '<div class="bcard k-' + k.key + '"><div class="kn">' + cnt[k.key] + '</div>' +
        '<b>' + esc(k.title) + ' — ' + esc(k.frame) + '</b><p>' + esc(k.body) + '</p></div>';
    }).join('') + '</div>' +
    '<p class="hint2">สีกรอบของช่องด้านล่างใช้ความหมายเดียวกันนี้ — เทาคือตรงความหมาย · ทองคือตรงแต่ซ้ำ · แดงคือไม่ตรง · เส้นประคือยังไม่มี</p>';

    var areas = BRIEF.areas.map(function (a) {
      return '<div class="area">' +
        '<div class="ahd"><b>' + esc(a.title) + '</b>' +
          (a.en ? '<em>' + esc(a.en) + '</em>' : '') + '</div>' +
        '<p>' + esc(a.cap) + '</p>' +
        shotsHTML(a.shots, a.title) +
        (a.want ? '<div class="wantbox"><b>' + esc(a.want.text) + '</b>' +
          (a.want.shot ? '<figure class="shot wantshot"><img src="/shots/' + esc(a.want.shot) +
            '" alt="' + esc(a.want.text) + '" data-zoom="/shots/' + esc(a.want.shot) +
            '"><figcaption>คลิกเพื่อดูใหญ่ · ภาพประกอบตำแหน่งที่ต้องเพิ่ม</figcaption></figure>' : '') +
          '<ul>' + a.want.items.map(function (w) {
            return '<li><span class="mono">' + esc(w.comp) + '</span> — ' + esc(w.th) +
              '<span>' + esc(w.where) + '</span></li>';
          }).join('') + '</ul>' + (a.want.note ? '<p class="wnote">' + esc(a.want.note) + '</p>' : '') + '</div>' : '') +
        '</div>';
    }).join('');

    var issues = BRIEF.issues.map(function (x) {
      var g = DATA.filter(function (d) { return d.icon === x.icon; })[0];
      return '<div class="issue">' +
        '<div class="ih">' + (g && g.svg ? '<span class="ii">' + g.svg + '</span>' : '<span class="ii dash">' + DASH + '</span>') +
          '<b' + (x.icon ? ' class="mono"' : '') + '>' + esc(x.icon || 'ยังไม่มีไอคอนในระบบ') + '</b>' +
          '<span class="cnt">' + esc(x.count) + '</span></div>' +
        '<p class="wh"><span>ใช้อยู่ที่</span> ' + esc(x.where) + '</p>' +
        '<p class="pp"><span>เสนอ</span> ' + esc(x.proposal) + '</p>' +
        (x.shot ? shotsHTML([x.shot], x.icon || '') : '') +
      '</div>';
    }).join('');

    var rules = '<table class="rules"><thead><tr><th>ต้องกำหนด</th><th>เหตุผล</th></tr></thead><tbody>' +
      BRIEF.rules.map(function (r) { return '<tr><td><b>' + esc(r.t) + '</b></td><td>' + esc(r.why) + '</td></tr>'; }).join('') +
      '</tbody></table>';

    box.innerHTML = '<div class="brief">' +
      '<div class="bh">บรีฟงาน <span>กดหัวข้อเพื่อกางอ่าน</span></div>' +
      panel('scope', 'โจทย์ของงานนี้', BRIEF.scope.length + ' ข้อ · ข้อสรุปที่ใช้เป็นกรอบงาน', scope) +
      panel('kinds', '4 ประเภทของงาน และสีประจำประเภท', 'ใช้อ่านสีกรอบของช่องด้านล่าง', kinds) +
      panel('areas', 'พื้นที่จริงในเว็บ', BRIEF.areas.length + ' บริเวณ · ภาพหน้าจอจริง', areas) +
      panel('issues', 'ปมที่ต้องตัดสินร่วมกัน', BRIEF.issues.length + ' เรื่อง · ยังไม่ใช่ข้อสรุป', issues) +
      panel('rules', 'กติกาการวาดทั้งชุด', BRIEF.rules.length + ' ข้อ · ทำให้ดวงที่ 141 ยังเข้าชุดกับดวงแรก', rules) +
    '</div>';
  }


  /* ---------------- หน้าต่างรายละเอียดช่อง ---------------- */
  var DLG_ID = null;

  function timelineHTML(id) {
    var rows = [];
    EVENTS.filter(function (e) { return e.slot === id; }).forEach(function (e) {
      rows.push({ t: e.t, kind: 'ev', u: e.u, a: e.a, f: e.f });
    });
    cmtsOf('slot:' + id).forEach(function (c) { rows.push({ t: c.t, kind: 'cm', c: c }); });
    rows.sort(function (a, b) { return a.t - b.t; });
    if (!rows.length) return '<p class="none">ยังไม่มีความเคลื่อนไหวในช่องนี้</p>';
    var trimmed = rows.length > 10;
    var show = trimmed ? rows.slice(-10) : rows;
    return (trimmed ? '<p class="tlmore">แสดง 10 รายการล่าสุด · มีทั้งหมด ' + rows.length + ' รายการ</p>' : '') +
      '<ol class="tl">' + show.map(function (r) {
      if (r.kind === 'ev') {
        return '<li class="ev"><span class="dot"></span>' +
          '<div class="tx"><b>' + esc(r.u) + '</b> ' + esc(ACT[r.a] || r.a) +
          (r.f ? ' <span class="mono">' + esc(r.f) + '</span>' : '') +
          '<span class="t">' + esc(ts(r.t)) + '</span></div></li>';
      }
      var c = r.c, mine = ME && c.u === ME.name;
      return '<li class="cm' + (c.done ? ' done' : '') + '"><span class="dot"></span>' +
        '<div class="bub"><div class="bh2"><b>' + esc(c.u) + '</b>' +
          '<span class="t">' + esc(ts(c.t)) + '</span>' +
          (c.done ? '<span class="tick">ปิดประเด็นแล้ว</span>' : '') +
          '<span class="sp"></span>' +
          '<button class="lnk" data-cdone="' + c.id + '" data-want="' + (c.done ? '0' : '1') + '">' +
            (c.done ? 'เปิดใหม่' : 'ปิดประเด็น') + '</button>' +
          (mine ? '<button class="lnk" data-cdel="' + c.id + '">ลบ</button>' : '') +
        '</div><div class="mb">' + esc(c.text).replace(/\n/g, '<br>') + '</div></div></li>';
    }).join('') + '</ol>';
  }

  function dlgHTML(id) {
    var s = BYID.get(id); if (!s) return '';
    var al = aliasOf(id), alSlot = al ? BYID.get(al) : null;
    var v = fileOf(id), st = statusOf(id);
    var own = STATE.get(id);
    var big = v
      ? '<img src="/api/file/' + encodeURIComponent(srcOf(id)) + '?v=' + (v.at || 0) + '" alt="' + esc(s.th) + '">'
      : '<div class="noimg">' + (s._g.svg || DASH) + '<p>' +
        'ยังไม่มีใครส่งไฟล์เข้าช่องนี้</p></div>';
    var stx = { none: 'ยังไม่ส่ง', submitted: 'รอรีวิว', approved: 'ผ่านแล้ว', revise: 'ต้องแก้' }[st];
    var rows = [
      (s.uses && s.uses.length > 1)
        ? ['ใช้ ' + s.uses.length + ' ตำแหน่ง', '<ul class="uses">' + s.uses.map(function (u) {
            return '<li><b>' + esc(u.th) + '</b><span>' + esc(u.route) +
              (/^ไม่มี aria-label/.test(u.label) ? '' : ' · <span class="mono">' + esc(u.label) + '</span>') +
              '</span></li>';
          }).join('') + '</ul>']
        : ['หน้าเว็บ', esc(s.route)],
      (s.uses && s.uses.length > 1) ? null
        : ['ป้ายปุ่ม', /^ไม่มี aria-label/.test(s.label)
            ? '<i>' + esc(s.label) + '</i>' : '<span class="mono">' + esc(s.label) + '</span>'],
      ['ไอคอนเดิม', s._g.icon === '__new__' ? '<i>ยังไม่มี</i>'
        : '<span class="mono">' + esc(s._g.icon) + '</span>' + (s._g.n > 1 ? ' · ใช้ซ้ำ ' + s._g.n + ' ที่' : '')],
      ['ประเภทงาน', KIND[s.kind]],
      s.ref ? ['ที่มาของแบบ', (s.ref.who ? '<b>' + esc(s.ref.who) + '</b><br>' : '') + esc(s.ref.why)] : null,
      ['สถานะ', stx]
    ].filter(Boolean);
    var here = linkedTo(id);
    if (al) rows.push(['ใช้ไอคอนร่วมกับ', '<span class="mono">' + esc((alSlot && alSlot.comp) || al) + '</span>' +
      (alSlot ? ' · ' + esc(alSlot.th) : '')]);
    if (here.length) rows.push(['ช่องที่ใช้ดวงนี้ร่วมด้วย', here.map(function (x) {
      return '<span class="mono">' + esc(x.comp) + '</span>'; }).join(' · ')]);
    if (v) {
      rows.push(['ไฟล์', '<span class="mono">' + esc(v.name || '') + '</span>' + (al ? ' <i>(ของช่องต้นทาง)</i>' : '')]);
      rows.push(['ส่งโดย', esc(v.by || '—') + ' · ' + esc(ts(v.at))]);
      if (v.reviewAt) rows.push([st === 'approved' ? 'ผ่านโดย' : 'ตีกลับโดย',
        esc(v.reviewBy || '—') + ' · ' + esc(ts(v.reviewAt))]);
    }
    var canReview = ME && ME.reviewer;

    var info = '<div class="dinfo-col">' +
      '<div class="dhd"><h3>' + esc(s.th) + '<em>' + esc(s.en) + '</em></h3>' +
        '<div class="dcodes">' +
          '<span class="cpair"><i>ชื่อไอคอน</i><code>' + esc(s.comp || id) + '</code>' +
            '<button data-copy="' + esc(s.comp || id) + '" title="คัดลอก">' + COPY_SVG + '</button>' +
            '<span class="hint3">ใช้เป็นทั้งชื่อไฟล์ ' + esc(s.comp || id) + '.svg และชื่อ component</span></span>' +
          '<span class="cpair dim"><i>รหัสช่อง</i><code>' + esc(id) + '</code></span>' +
        '</div></div>' +
      '<table class="dinfo"><tbody>' + rows.map(function (r) {
        return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>' +
      (s.note ? '<div class="why' + (s.kind === 'wrong' ? ' w' : '') + '">' + esc(s.note) + '</div>' : '') +
      '<h4 class="dh4">ความเคลื่อนไหวและคอมเมนต์</h4>' +
      '<div class="dlogwrap">' + timelineHTML(id) + '</div>' +
      '<div class="cin">' +
        '<textarea data-ctext="slot:' + esc(id) + '" rows="2" placeholder="เขียนคอมเมนต์… (Ctrl+Enter เพื่อส่ง)"></textarea>' +
        '<button class="btn p" data-csend="slot:' + esc(id) + '">ส่ง</button>' +
      '</div>' +
    '</div>';

    var pic = '<div class="dpic-col">' +
      '<div class="dprev" data-drop="' + esc(id) + '" title="ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์">' + big + '</div>' +
      '<div class="dbtns">' +
        (s.ref ? '<span class="offnote">' + esc(s.ref.why) + '</span>' : '') +
        (v && canReview ? '<button class="btn sm" data-ok="' + esc(id) + '">' +
            (st === 'approved' ? '✓ ผ่านแล้ว' : 'ผ่าน') + '</button>' : '') +
        (v ? '<button class="btn sm" data-dl="' + esc(id) + '">ดาวน์โหลด</button>' +
             '<button class="btn sm" data-del="' + esc(id) + '">ลบ</button>' : '') +
        '<button class="btn sm" data-pick="' + esc(id) + '">' +
          (own && own.name ? 'ส่งไฟล์ใหม่ทับ' : 'เลือกไฟล์ส่ง') + '</button>' +
      '</div>' +
    '</div>';

    return '<div class="dcard" role="dialog" aria-modal="true">' +
      '<button class="lbx" data-dclose aria-label="ปิด">✕</button>' +
      info + pic +
    '</div>';
  }

  /** กล่องเลือกว่าช่องนี้ใช้ไอคอนร่วมกับช่องไหน */
  function linkBoxHTML(id) {
    var s = BYID.get(id), al = aliasOf(id);
    if (linkedTo(id).length) {
      return '<div class="linkbox"><b>ช่องนี้เป็นช่องหลัก</b>' +
        '<p>มีอีก ' + linkedTo(id).length + ' ช่องใช้ไอคอนดวงนี้ร่วมด้วย ไฟล์ตัวจริงอยู่ที่ช่องนี้ที่เดียว<br>' +
        'ถ้าจะเลิกใช้ร่วม ให้ไปกดปลดที่ช่องนั้น ไม่ใช่ที่นี่</p></div>';
    }
    var cand = SLOTS.filter(function (x) {
      return x.id !== id && STATE.get(x.id) && STATE.get(x.id).name && !aliasOf(x.id);
    });
    var same = cand.filter(function (x) { return x._g.icon === s._g.icon; });
    var rest = cand.filter(function (x) { return x._g.icon !== s._g.icon; });
    function opts(list) {
      return list.map(function (x) {
        return '<option value="' + esc(x.id) + '"' + (al === x.id ? ' selected' : '') + '>' +
          esc(x.comp) + ' — ' + esc(x.th) + '</option>';
      }).join('');
    }
    var sug = s.sug ? BYID.get(s.sug) : null;
    var sugReady = sug && STATE.get(sug.id) && STATE.get(sug.id).name && !aliasOf(sug.id);
    return '<div class="linkbox">' +
      '<b>ใช้ไอคอนร่วมกับช่องอื่น</b>' +
      (sug && !al ? '<p class="sug">ข้อเสนอจากบรีฟ — ควรใช้ดวงเดียวกับ <span class="mono">' +
        esc(sug.comp) + '</span> (' + esc(sug.th) + ')' +
        (sugReady ? ' <button class="lnk" data-dolink="' + esc(id) + '" data-to="' + esc(sug.id) + '">ผูกตามนี้</button>'
                  : ' · รอให้ช่องนั้นส่งไฟล์ก่อน') + '</p>' : '') +
      '<p>บางตำแหน่งตั้งใจให้ใช้ไอคอนดวงเดียวกัน เช่นโมเดลตระกูลเดียวกันที่แยกกันด้วยชื่อรุ่นอยู่แล้ว<br>' +
        '<b>วิธีทำ</b> วาดดวงเดียว → ส่งเข้าช่องหลักช่องเดียว → กลับมาที่ช่องนี้แล้วเลือกช่องหลักจากรายการ<br>' +
        'ช่องนี้จะไม่ต้องส่งไฟล์เอง ดึงภาพจากช่องหลักมาแสดง และในไฟล์ zip จะมีไฟล์เดียว ไม่ซ้ำ</p>' +
      (cand.length
        ? '<div class="lrow"><select data-link="' + esc(id) + '">' +
            '<option value="">— ไม่ผูก ใช้ดวงของตัวเอง —</option>' +
            (same.length ? '<optgroup label="ไอคอนเดิมกลุ่มเดียวกัน">' + opts(same) + '</optgroup>' : '') +
            (rest.length ? '<optgroup label="ช่องอื่นที่ส่งไฟล์แล้ว">' + opts(rest) + '</optgroup>' : '') +
          '</select>' + (al ? '<button class="btn sm" data-unlink="' + esc(id) + '">ปลด</button>' : '') + '</div>'
        : '<p class="none">ยังผูกไม่ได้ตอนนี้ เพราะยังไม่มีช่องอื่นส่งไฟล์เข้ามาเลย — ส่งไฟล์เข้าช่องหลักก่อน แล้วค่อยกลับมาที่นี่</p>') +
    '</div>';
  }

  function openDlg(id) {
    DLG_ID = id;
    var d = document.getElementById('dlg');
    if (!d) {
      d = document.createElement('div');
      d.id = 'dlg'; d.className = 'lb dlg';
      d.addEventListener('click', function (e) {
        if (e.target.closest('[data-dclose]') || !e.target.closest('.dcard')) closeDlg();
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && DLG_ID) closeDlg(); });
      document.body.appendChild(d);
    }
    d.innerHTML = dlgHTML(id);
    var sc = d.querySelector('.dlogwrap'); if (sc) sc.scrollTop = sc.scrollHeight;
    var ta = d.querySelector('[data-ctext]'); if (ta) ta.focus();
  }
  function closeDlg() {
    DLG_ID = null;
    var d = document.getElementById('dlg'); if (d) d.remove();
  }
  function refreshDlg() {
    if (!DLG_ID) return;
    var d = document.getElementById('dlg'); if (!d) return;
    var ta = d.querySelector('[data-ctext]');
    var keep = ta ? ta.value : '';
    var sc = d.querySelector('.dlogwrap');
    var atEnd = sc ? (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 30) : true;
    d.innerHTML = dlgHTML(DLG_ID);
    var ta2 = d.querySelector('[data-ctext]');
    if (ta2 && keep) ta2.value = keep;
    var sc2 = d.querySelector('.dlogwrap');
    if (sc2 && atEnd) sc2.scrollTop = sc2.scrollHeight;
  }

  /* ---------------- การกระทำ ---------------- */
  function review(id, want) {
    if (!ME || !ME.reviewer) { toast('บัญชีนี้ยังไม่มีสิทธิ์รีวิว'); return; }
    var back = statusOf(id) === want;
    var sl = BYID.get(id);
    BUSY++;
    api({ op: 'review', id: id, th: sl ? sl.th : id, status: back ? 'submitted' : want })
      .then(function () { return pull(true); })
      .catch(function (e) { toast('บันทึกไม่สำเร็จ · ' + e.message); })
      .then(function () { BUSY--; });
  }
  function resetDel() {
    if (!DEL_PENDING) return;
    var b = document.querySelector('[data-del="' + DEL_PENDING + '"]');
    if (b) { b.textContent = 'ลบ'; b.classList.remove('danger'); }
    DEL_PENDING = null;
  }
  function removeFile(id) {
    var sl = BYID.get(id);
    BUSY++;
    api({ op: 'delete', id: id, th: sl ? sl.th : id })
      .then(function () { return pull(true); })
      .catch(function (e) { toast('ลบไม่สำเร็จ · ' + e.message); })
      .then(function () { BUSY--; });
  }

  /* ---------------- ส่งไฟล์ออก ---------------- */
  function fetchBlob(id) {
    return fetch('/api/file/' + encodeURIComponent(id), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('โหลดไฟล์ไม่ได้'); return r.blob(); });
  }
  function saveBlob(filename, blob) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function outName(id) {
    var s = BYID.get(id) || {}, v = fileOf(id) || {};
    return (s.comp || id) + '.' + extOf(v.name);
  }
  function saveOne(id) {
    var v = fileOf(id); if (!v) return;
    fetchBlob(srcOf(id)).then(function (b) { saveBlob(outName(id), b); })
      .catch(function (e) { toast(e.message); });
  }
  function downloadNames() {
    var esc2 = function (v) { v = String(v == null ? '' : v); return /["|,|\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var head = ['ชื่อไอคอน (ตั้งชื่อเฟรม Figma ให้ตรงนี้)', 'ชื่อไทย', 'ชื่ออังกฤษ', 'พื้นที่ในเว็บ', 'หน้าเว็บ', 'ป้ายปุ่ม', 'ประเภท'];
    var lines = [head.map(esc2).join(',')];
    SLOTS.forEach(function (s) {
      lines.push([s.comp, s.th, s.en, s.area, s.route,
        /^ไม่มี aria-label/.test(s.label) ? '' : s.label,
        ({ ok: 'ตรงความหมาย', dup: 'ตรงแต่ซ้ำ', wrong: 'ไม่ตรง', new: 'ยังไม่มี' })[s.kind]
      ].map(esc2).join(','));
    });
    saveBlob('fortal-icon-names.csv', new Blob([String.fromCharCode(0xFEFF) + lines.join(String.fromCharCode(10))], { type: 'text/csv;charset=utf-8' }));
    toast('ได้รายชื่อ ' + SLOTS.length + ' ไอคอนแล้ว — เอาไปตั้งชื่อเฟรมใน Figma');
  }

  function manifest(list) {
    return list.map(function (s) {
      var v = fileOf(s.id) || {};
      return {
        slot: s.id, icon: s.comp || null,
        thai: s.th, english: s.en, page: s.route, aria_label: s.label,
        used_at: (s.uses && s.uses.length > 1)
          ? s.uses.map(function (u) { return { page: u.route, aria_label: u.label, thai: u.th,
                                               css_class: u.icon === '__new__' ? null : 'lucide-' + u.icon }; })
          : [{ page: s.route, aria_label: s.label, thai: s.th,
               css_class: s._g.icon === '__new__' ? null : 'lucide-' + s._g.icon }],
        current_icon: s._g.icon === '__new__' ? null : s._g.icon,
        shares_icon_with: (s._g.n > 1 && s._g.icon !== '__new__')
          ? s._g.slots.filter(function (x) { return x.id !== s.id; }).map(function (x) { return x.id; }) : [],
        type: s.kind, status: statusOf(s.id),
        reference: s.ref ? { provider: s.ref.who || null, note: s.ref.why } : null,
        family: s.fam ? s.fam.n : null,
        same_as: (function () { var a = aliasOf(s.id); var t = a && BYID.get(a); return t ? (t.comp || a) : null; })(),
        file: aliasOf(s.id) ? null : (v.name ? outName(s.id) : null),
        uploaded_by: v.by || null, uploaded_at: v.at ? new Date(Number(v.at)).toISOString() : null,
        reviewed_by: v.reviewBy || null, reviewed_at: v.reviewAt ? new Date(Number(v.reviewAt)).toISOString() : null,
        review_note: v.note || '',
        note_by: v.noteBy || null, note_at: v.noteAt ? new Date(Number(v.noteAt)).toISOString() : null,
        comments: cmtsOf('slot:' + s.id).map(function (c) {
          return { at: new Date(Number(c.t)).toISOString(), who: c.u, text: c.text, resolved: c.done };
        }),
        history: EVENTS.filter(function (e) { return e.slot === s.id; })
          .map(function (e) { return { at: new Date(Number(e.t)).toISOString(), who: e.u, action: e.a, file: e.f || null }; })
      };
    });
  }
  function readmeText(list) {
    var L = [];
    L.push('ไอคอน Fortal — ชุดที่ส่งออกจากแคตตาล็อก');
    L.push('ออกเมื่อ ' + ts(Date.now()) + ' · ' + list.length + ' ไฟล์');
    L.push('ที่มา ' + location.origin);
    L.push('');
    L.push('ชื่อไฟล์ในนี้คือชื่อไอคอนที่ใช้ในโค้ดได้เลย ไม่ต้องเปลี่ยนชื่อใหม่');
    L.push('เช่น IconCreditBalance.svg ใช้เป็น component ชื่อ IconCreditBalance');
    L.push('');
    L.push('สำคัญ — ไอคอนเดิมหนึ่งดวงถูกใช้อยู่หลายที่');
    L.push('ห้ามแทนที่โดยดูจากชื่อไอคอนเดิม เพราะจะเปลี่ยนพร้อมกันหมดทุกจุด');
    L.push('เช่น sparkles ดวงเดียวถูกใช้อยู่ 8 ตำแหน่ง ต้องแยกเป็น 8 ดวงแล้วไล่เปลี่ยนทีละจุด');
    L.push('');
    L.push('manifest.json บอกของแต่ละไฟล์ไว้ครบ');
    L.push('  icon               ชื่อไอคอน ใช้เป็นชื่อไฟล์และชื่อ component');
    L.push('  same_as            มีค่า = จุดนี้ใช้ไอคอนดวงเดียวกับชื่อนั้น ไม่มีไฟล์แยก');

    L.push("  used_at            ทุกตำแหน่งที่ไอคอนดวงนี้ไปโผล่ พร้อมป้ายปุ่มและคลาสของไอคอนเดิม");
    L.push('  shares_icon_with   ช่องอื่นที่ตอนนี้ใช้ไอคอนเดิมดวงเดียวกัน');
    L.push('  status / comments  ผลรีวิวและสิ่งที่คุยกันไว้');
    L.push('');
    L.push('หมายเหตุ — ไอคอนของโมเดลวาดใหม่ในสไตล์ Fortal โดยอ้างอิงสัญลักษณ์ของผู้ให้บริการ');
    L.push('ไม่ได้ก๊อปโลโก้ของเขามาใช้ตรง ๆ · ดูรายการที่ manifest.json ฟิลด์ reference');
    L.push('');
    L.push('รายการไฟล์');
    list.forEach(function (x) {
      L.push('  ' + outName(x.id));
      L.push('      ' + x.th + ' · ' + x.en);
      if (x.uses && x.uses.length > 1) {
        L.push('      ดวงเดียว ใช้ ' + x.uses.length + ' ตำแหน่ง');
        x.uses.forEach(function (u) {
          L.push('        - ' + u.th + '  ' + u.route +
            (/^ไม่มี aria-label/.test(u.label) ? '' : '  aria-label: ' + u.label));
        });
      } else {
        L.push('      ' + x.route + (/^ไม่มี aria-label/.test(x.label) ? '' : '  aria-label: ' + x.label));
      }
      if (x._g.n > 1 && x._g.icon !== '__new__')
        L.push('      เดิมใช้ ' + x._g.icon + ' ร่วมกับอีก ' + (x._g.n - 1) + ' ตำแหน่ง');
    });
    return L.join('\n');
  }

  function zipOut(pick, fname, label) {
    var list = SLOTS.filter(function (s) { return filled(s.id) && pick(s); });
    var withFile = list.filter(function (s) { return !aliasOf(s.id); });
    if (!list.length) { toast('ยังไม่มีไฟล์ในกลุ่ม “' + label + '”'); return; }
    if (typeof JSZip === 'undefined') { toast('ตัวรวมไฟล์ zip ยังโหลดไม่เสร็จ ลองใหม่อีกที'); return; }
    toast('กำลังรวม ' + list.length + ' ไฟล์…');
    var z = new JSZip();
    Promise.all(withFile.map(function (s) {
      return fetchBlob(s.id).then(function (b) { z.file(outName(s.id), b); });
    })).then(function () {
      z.file('manifest.json', JSON.stringify(manifest(list), null, 1));
      z.file('อ่านก่อน.txt', readmeText(list));
      return z.generateAsync({ type: 'blob' });
    }).then(function (blob) { saveBlob(fname, blob); })
      .catch(function (e) { toast('รวมไฟล์ไม่สำเร็จ · ' + e.message); });
  }

  /* ---------------- เหตุการณ์ ---------------- */
  function wire() {
    document.addEventListener('click', function (e) {
      var fj = e.target.closest('[data-fam]');
      if (fj) {
        FILTER = 'all'; Q = ''; PICKICON = ''; PICKFAM = fj.dataset.fam;
        $('#q').value = ''; render(); keepInView(fj.dataset.from);
        return;
      }
      var dj = e.target.closest('[data-dupjump]');
      if (dj) {
        FILTER = 'all'; Q = ''; PICKFAM = ''; PICKICON = dj.dataset.dupjump;
        $('#q').value = ''; render(); keepInView(dj.dataset.from);
        return;
      }
      var go = e.target.closest('[data-go]');
      if (go) {
        var t = document.getElementById(go.dataset.go);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      var f = e.target.closest('[data-f]');
      if (f) { FILTER = f.dataset.f; render(); return; }
      var cp = e.target.closest('[data-copy]');
      if (cp) {
        navigator.clipboard.writeText(cp.dataset.copy)
          .then(function () { toast('คัดลอกรหัสช่องแล้ว · ' + cp.dataset.copy); })
          .catch(function () { toast('คัดลอกไม่ได้ในหน้านี้'); });
        return;
      }
      var okb = e.target.closest('[data-ok]');
      if (okb) { review(okb.dataset.ok, 'approved'); return; }
      var rv = e.target.closest('[data-rev]');
      if (rv) { review(rv.dataset.rev, 'revise'); return; }
      var dl = e.target.closest('[data-dl]');
      if (dl) { saveOne(dl.dataset.dl); return; }
      var de = e.target.closest('[data-del]');
      if (de) {
        var id = de.dataset.del;
        var sl = BYID.get(id) || {}, v = STATE.get(id) || {};
        ask({
          title: 'เอาไฟล์ออกจากช่องนี้?',
          body: '<b>' + esc(sl.th || id) + '</b><br><span class="mono">' + esc(id) + '</span>' +
                (v.name ? '<br>ไฟล์ <span class="mono">' + esc(v.name) + '</span>' +
                          ' ที่ส่งโดย ' + esc(v.by || '—') : '') +
                '<br><br>ไฟล์จะหายไปจากช่อง แต่ประวัติว่าใครส่ง ใครลบ ยังอยู่',
          ok: 'ลบไฟล์', danger: true
        }).then(function (yes) { if (yes) removeFile(id); });
        return;
      }
      var dz = e.target.closest('[data-drop]');
      if (dz) { PENDING_ID = dz.dataset.drop; var p = $('#picker'); p.removeAttribute('multiple'); p.click(); return; }
      if (e.target.closest('#bulkpick')) { PENDING_ID = null; var p2 = $('#picker'); p2.setAttribute('multiple', ''); p2.click(); return; }
      if (e.target.closest('#expand2')) { FILTER = 'all'; Q = ''; PICKICON = ''; PICKFAM = ''; $('#q').value = ''; render(); return; }
      if (e.target.closest('#expand')) { FILTER = 'all'; Q = ''; PICKICON = ''; PICKFAM = ''; $('#q').value = ''; render(); return; }
      if (e.target.closest('#bgtoggle')) { setBg(!document.body.classList.contains('dk')); return; }
      if (e.target.closest('#dlok')) { zipOut(function (s) { return statusOf(s.id) === 'approved'; }, 'fortal-icons-approved.zip', 'ผ่านแล้ว'); return; }
      if (e.target.closest('#dlall')) { zipOut(function () { return true; }, 'fortal-icons-submitted.zip', 'ส่งแล้ว'); return; }
      var dlk = e.target.closest('[data-dolink]');
      if (dlk) { act({ op: 'alias', id: dlk.dataset.dolink, target: dlk.dataset.to,
                       th: (BYID.get(dlk.dataset.dolink) || {}).th || null }); return; }
      var ul = e.target.closest('[data-unlink]');
      if (ul) { act({ op: 'alias', id: ul.dataset.unlink, target: '',
                      th: (BYID.get(ul.dataset.unlink) || {}).th || null }); return; }
      var pk = e.target.closest('[data-pick]');
      if (pk) { PENDING_ID = pk.dataset.pick; var pp = $('#picker'); pp.removeAttribute('multiple'); pp.click(); return; }
      var op_ = e.target.closest('[data-open]');
      if (op_) { openDlg(op_.dataset.open); return; }
      var sh = e.target.closest('[data-shots]');
      if (sh) { zoomMany(sh.dataset.shots.split('|'), sh.dataset.t); return; }
      var zm = e.target.closest('[data-zoom]');
      if (zm) { zoom(zm.dataset.zoom); return; }
      var ps = e.target.closest('[data-panel]');
      if (ps) { OPEN[ps.dataset.panel] = !OPEN[ps.dataset.panel]; drawBrief(); return; }
      var cs = e.target.closest('[data-csend]');
      if (cs) { sendComment(cs.dataset.csend); return; }
      var cd = e.target.closest('[data-cdel]');
      if (cd) { act({ op: 'comment_del', cid: Number(cd.dataset.cdel) }); return; }
      var ck = e.target.closest('[data-cdone]');
      if (ck) { act({ op: 'comment_done', cid: Number(ck.dataset.cdone), done: ck.dataset.want === '1' }); return; }
      if (e.target.closest('#dlman')) { saveBlob('fortal-icon-manifest.json', new Blob([JSON.stringify(manifest(SLOTS), null, 1)], { type: 'application/json' })); return; }
      if (e.target.closest('#dlnames') || e.target.closest('#dlnames2')) { downloadNames(); return; }
    });

    document.addEventListener('input', function (e) {
      if (e.target.id === 'q') { Q = e.target.value.trim().toLowerCase(); PICKICON = ''; PICKFAM = ''; render(); }
    });
    document.addEventListener('change', function (e) {
      var lk = e.target.closest('[data-link]');
      if (lk) {
        act({ op: 'alias', id: lk.dataset.link, target: lk.value,
              th: (BYID.get(lk.dataset.link) || {}).th || null });
        return;
      }
      if (e.target.id === 'picker') {
        var files = Array.prototype.slice.call(e.target.files || []);
        var t = e.target;
        if (files.length) {
          if (PENDING_ID) {
            var one = PENDING_ID; PENDING_ID = null;
            accept(one, files[0]).then(function (okv) { if (okv) pull(true); });
          } else bulk(files);
        }
        t.value = '';
      }
    });

    var overEl = null;
    document.addEventListener('dragover', function (e) {
      e.preventDefault();
      var dz = e.target.closest('[data-drop]') || e.target.closest('#bulk');
      if (overEl && overEl !== dz) overEl.classList.remove('over');
      if (dz) { dz.classList.add('over'); overEl = dz; }
    });
    document.addEventListener('dragleave', function (e) {
      if (overEl && !e.relatedTarget) { overEl.classList.remove('over'); overEl = null; }
    });
    document.addEventListener('drop', function (e) {
      e.preventDefault();
      if (overEl) overEl.classList.remove('over');
      overEl = null;
      var dz = e.target.closest('[data-drop]');
      var files = Array.prototype.slice.call((e.dataTransfer && e.dataTransfer.files) || []);
      if (!files.length) return;
      if (dz) accept(dz.dataset.drop, files[0]).then(function (okv) { if (okv) pull(true); });
      else bulk(files);
    });
  }

  function act(body) {
    BUSY++;
    return api(body)
      .then(function () { return pull(true); })
      .catch(function (e) { toast('บันทึกไม่สำเร็จ · ' + e.message); })
      .then(function () { BUSY--; });
  }
  function sendComment(target) {
    var ta = document.querySelector('[data-ctext="' + target + '"]');
    if (!ta) return;
    var text = ta.value.trim();
    if (!text) { ta.focus(); return; }
    ta.value = '';
    act({ op: 'comment', target: target, text: text,
          th: (BYID.get(target.replace(/^slot:/, '')) || {}).th || null });
  }
  document.addEventListener('keydown', function (e) {
    var ta = e.target.closest && e.target.closest('[data-ctext]');
    if (ta && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); sendComment(ta.dataset.ctext); }
  });

  function setBg(dark) {
    document.body.classList.toggle('dk', dark);
    var b = $('#bgtoggle'); if (b) b.textContent = 'พื้นพรีวิว: ' + (dark ? 'เข้ม' : 'อ่อน');
    try { localStorage.setItem('catalogBg', dark ? 'dk' : 'lt'); } catch (_) { }
  }

  /* ---------------- เริ่มทำงาน ---------------- */
  Promise.all([
    fetch('/data.json?v=' + VER).then(function (r) { return r.json(); }),
    fetch('/brief.json?v=' + VER).then(function (r) { return r.json(); })
      .catch(function () { return null; })
  ])
    .then(function (both) {
      DATA = both[0]; BRIEF = both[1];
      DATA.forEach(function (g) { g.slots.forEach(function (s) { s._g = g; SLOTS.push(s); }); });
      PLACES = SLOTS.reduce(function (a, x) { return a + ((x.uses && x.uses.length) || 1); }, 0);
      TODRAW = SLOTS.slice();
      BYID = new Map(SLOTS.map(function (s) { return [s.id, s]; }));
      NORMID = new Map();
      LOOSEID = new Map();
      SLOTS.forEach(function (s) {
        [s.id, s.code, s.comp].forEach(function (k) {
          if (!k) return;
          var nk = norm(k);
          if (nk.length >= 2) NORMID.set(nk, s.id);
          var l = loose(k);
          if (l.length < 2) return;
          if (LOOSEID.has(l) && LOOSEID.get(l) !== s.id) LOOSEID.set(l, null);  // กำกวม ไม่เดา
          else LOOSEID.set(l, s.id);
        });
      });
      $('#root').innerHTML = shell();
      wire();
      try { setBg(localStorage.getItem('catalogBg') === 'dk'); } catch (_) { setBg(false); }
      return pull();
    })
    .then(function () { startPolling(); })
    .catch(function (e) {
      var r = $('#root');
      if (r) r.innerHTML = '<div class="empty">เปิดหน้าไม่สำเร็จ · ' + esc(e.message) + '</div>';
    });
})();
