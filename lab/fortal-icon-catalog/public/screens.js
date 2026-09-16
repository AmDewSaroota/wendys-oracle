/* แท็บ "หน้าจอ" — ภาพหน้าจอจริงของ fortal.studio เรียงตาม URL แล้วแตกเป็นชุดย่อย
   ทุกชุดย่อยมี 2 ฝั่ง: ซ้าย = ของจริงที่แคปมา · ขวา = ดีไซน์ที่ดีไซเนอร์อัปเอง
   ดีไซเนอร์ลากไฟล์ใส่ได้เลย ไม่ต้องรอใครมาวางให้ (เบราว์เซอร์ย่อภาพก่อนส่ง) */
(function () {
  var V = window.__V || "1";
  var root = document.getElementById("root");
  var data = null, state = null, q = "";

  Promise.all([
    fetch("/screens-data.json?v=" + V).then(function (r) { return r.json(); }),
    fetch("/api/state").then(function (r) { return r.ok ? r.json() : { slots: {} }; }).catch(function () { return { slots: {} }; }),
  ]).then(function (res) {
    data = res[0]; state = res[1] || { slots: {} };
    render();
  }).catch(function (e) {
    root.innerHTML = '<div class="wrap" style="padding:60px 0">โหลดข้อมูลไม่ได้: ' + e.message + "</div>";
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function slotOf(key) { return (state && state.slots ? state.slots["design:" + key] : null) || null; }
  function designUrl(key) {
    var s = slotOf(key);
    return s ? "/api/file/design:" + encodeURIComponent(key) + "?t=" + (s.at || 0) : null;
  }

  /* ---------- วาดหน้า ---------- */
  function render() {
    var imgs = 0, withDesign = 0, totalSec = 0;
    data.groups.forEach(function (g) {
      imgs += g.shots.length;
      (g.sections || []).forEach(function (sec) { totalSec++; if (slotOf(sec.key)) withDesign++; });
    });

    var html = '<header class="top"><div class="hrow">' +
      '<div class="brand"><b>Fortal — แคตตาล็อกสำหรับดีไซน์</b><span>' + esc(data.note) + "</span></div>" +
      '<nav class="sctabs"><a href="/">ไอคอน</a><a href="/screens" class="on">หน้าจอ</a></nav>' +
      "</div></header>";

    html += '<div class="wrap">';
    html += '<div class="sckpi">' +
      "<div><b>" + data.groups.length + "</b><span>URL ของเว็บแอป</span></div>" +
      "<div><b>" + totalSec + "</b><span>ชุดย่อยที่ต้องออกแบบ</span></div>" +
      "<div><b>" + imgs + "</b><span>ภาพหน้าจอจริง</span></div>" +
      '<div><b class="' + (withDesign ? "scok" : "") + '">' + withDesign + "</b><span>ชุดที่มีดีไซน์แล้ว</span></div></div>" +
      (data.scope ? '<div class="scscope">' + esc(data.scope) + "</div>" : "");

    html += '<div class="scsearch"><input id="scq" placeholder="พิมพ์เพื่อกรอง — เช่น billing, studio, ลืมรหัส" value="' + esc(q) + '"></div>';

    var cur = null, shown = 0;
    data.groups.forEach(function (g, gi) {
      var hay = (g.url + " " + g.desc + " " + g.group + " " +
                 g.shots.map(function (x) { return x.caption + " " + x.section; }).join(" ")).toLowerCase();
      if (q && hay.indexOf(q.toLowerCase()) < 0) return;
      shown++;
      if (g.group !== cur) { html += "<h2>" + esc(g.group) + "</h2>"; cur = g.group; }

      html += '<div class="scrow" data-g="' + gi + '"><div class="sctop">' +
        '<a class="scurl" href="' + esc(g.urlOpen || g.urlFull) + '" target="_blank" rel="noreferrer">' + esc(g.urlFull) + "</a>" +
        '<button class="sccopy" data-u="' + esc(g.urlOpen || g.urlFull) + '">คัดลอก URL</button>' +
        (g.urlOpen && g.urlOpen !== g.urlFull ? '<span class="screal" title="' + esc(g.urlOpen) + '">ตัวอย่างจริง</span>' : "") +
        '<span class="scdesc">' + esc(g.desc) + "</span>" +
        '<span class="sccount">' + g.shots.length + " ภาพ</span></div>";

      (g.sections || []).forEach(function (sec) {
        var mine = g.shots.filter(function (s) { return s.sectionKey === sec.key; });
        var du = designUrl(sec.key), slot = slotOf(sec.key);
        html += '<div class="scsec" data-key="' + esc(sec.key) + '">' +
          '<div class="scsechead"><b>' + esc(sec.name) + "</b><span>" + mine.length + " ภาพ</span>" +
          '<button class="sccmp" data-g="' + gi + '" data-key="' + esc(sec.key) + '">' +
          (du ? "เทียบกับดีไซน์" : "เปิดจอเทียบ") + "</button>" +
          "</div><div class=\"scpair\">";

        html += '<div class="scside"><div class="scsidehead">ของจริงในเว็บ</div><div class="scshots">';
        mine.forEach(function (sh) {
          html += '<a class="scshot" data-g="' + gi + '" data-img="' + esc(sh.img) + '" title="' + esc(sh.caption) + '">' +
                  '<img loading="lazy" src="/screens/thumb/' + esc(sh.img) + '">' +
                  '<span class="sccap">' + esc(sh.caption) + "</span></a>";
        });
        html += "</div></div>";

        html += '<div class="scside"><div class="scsidehead">ดีไซน์ (Figma)</div>' +
          '<div class="scdrop' + (du ? " has" : "") + '" data-key="' + esc(sec.key) + '" tabindex="0">' +
          (du
            ? '<img src="' + du + '"><div class="scmeta">โดย ' + esc(slot.by || "-") +
              '<button class="scre" data-key="' + esc(sec.key) + '">เปลี่ยนรูป</button></div>'
            : '<div class="schint">ลากภาพมาวางตรงนี้<br><small>หรือกดเพื่อเลือกไฟล์ · วางจากคลิปบอร์ดก็ได้ (Ctrl+V)</small></div>') +
          "</div>" +
          '<div class="scfig"><span>ลิงก์ Figma</span>' +
          '<input class="scfigin" data-key="' + esc(sec.key) + '" placeholder="วางลิงก์เฟรมใน Figma ที่นี่" value="' +
          esc((slot && slot.note) || "") + '">' +
          ((slot && slot.note) ? '<a class="scfiggo" href="' + esc(slot.note) + '" target="_blank" rel="noreferrer">เปิด</a>' : "") +
          "</div></div>";

        html += "</div></div>";
      });
      html += "</div>";
    });
    if (!shown) html += '<div class="scempty">ไม่มี URL ไหนตรงกับคำที่พิมพ์</div>';
    html += "</div>";

    html += '<div id="sclb"><button id="sclbx" title="ปิด (Esc)">&times;</button>' +
      '<button class="scnav" id="sclbp">&#8249;</button>' +
      '<div id="sclbbody"><div class="sclbcol" id="sclbL"></div><div class="sclbcol" id="sclbR"></div></div>' +
      '<div id="sclbcap"></div><button class="scnav" id="sclbn">&#8250;</button></div>';
    html += '<input type="file" id="scfile" accept="image/png,image/webp,image/jpeg" style="display:none">';
    html += '<div class="toast" id="sctoast"></div>';

    root.innerHTML = html;
    var box = document.getElementById("scq");
    box.addEventListener("input", function () {
      q = box.value;
      var pos = box.selectionStart;
      render();
      var nb = document.getElementById("scq");
      nb.focus(); try { nb.setSelectionRange(pos, pos); } catch (e) {}
    });
    wireDrop();
    [].slice.call(document.querySelectorAll(".scfigin")).forEach(function (inp) {
      inp.addEventListener("change", function () { saveLink(inp.dataset.key, inp.value.trim()); });
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") inp.blur(); });
    });
  }

  function saveLink(key, url) {
    if (url && !/^https?:\/\//i.test(url)) { toast("ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://", true); return; }
    fetch("/api/action", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "note", id: "design:" + key, note: url }),
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j.error) throw new Error(j.error);
      return fetch("/api/state").then(function (s) { return s.json(); });
    }).then(function (st) { state = st; render(); toast(url ? "เก็บลิงก์ Figma แล้ว" : "ลบลิงก์แล้ว"); })
      .catch(function (e) { toast(e.message, true); });
  }

  function toast(msg, bad) {
    var t = document.getElementById("sctoast");
    if (!t) return;
    t.textContent = msg; t.className = "toast on" + (bad ? " bad" : "");
    setTimeout(function () { t.className = "toast"; }, 2600);
  }

  /* ---------- อัปโหลดภาพดีไซน์ ---------- */
  var pendingKey = null;

  function wireDrop() {
    var file = document.getElementById("scfile");
    if (file) file.onchange = function () {
      if (file.files && file.files[0] && pendingKey) handleFile(file.files[0], pendingKey);
      file.value = "";
    };
    [].slice.call(document.querySelectorAll(".scdrop")).forEach(function (d) {
      d.addEventListener("dragover", function (e) { e.preventDefault(); d.classList.add("over"); });
      d.addEventListener("dragleave", function () { d.classList.remove("over"); });
      d.addEventListener("drop", function (e) {
        e.preventDefault(); d.classList.remove("over");
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) handleFile(f, d.dataset.key);
      });
      d.addEventListener("click", function (e) {
        if (e.target.closest(".scre") || !e.target.closest(".scdrop")) return;
        pendingKey = d.dataset.key;
        document.getElementById("scfile").click();
      });
      d.addEventListener("focus", function () { pendingKey = d.dataset.key; });
      d.addEventListener("paste", function (e) {
        var items = (e.clipboardData || {}).items || [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image/") === 0) {
            handleFile(items[i].getAsFile(), d.dataset.key);
            e.preventDefault(); return;
          }
        }
      });
    });
  }

  /** ย่อภาพในเบราว์เซอร์ก่อนส่ง — ภาพจาก Figma มักใหญ่หลาย MB */
  function shrink(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onerror = function () { reject(new Error("อ่านไฟล์ไม่ได้")); };
      fr.onload = function () {
        var im = new Image();
        im.onerror = function () { reject(new Error("ไฟล์นี้ไม่ใช่รูปภาพ")); };
        im.onload = function () {
          var MAXW = 1600, w = im.width, h = im.height;
          if (w > MAXW) { h = Math.round(h * MAXW / w); w = MAXW; }
          var c = document.createElement("canvas");
          c.width = w; c.height = h;
          c.getContext("2d").drawImage(im, 0, 0, w, h);
          var q = 0.82, out = c.toDataURL("image/webp", q);
          while (out.length > 2.6 * 1024 * 1024 && q > 0.4) { q -= 0.12; out = c.toDataURL("image/webp", q); }
          resolve({ data: out, mime: "image/webp" });
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  function handleFile(file, key) {
    if (!file || !key) return;
    toast("กำลังย่อและอัปโหลด…");
    shrink(file).then(function (r) {
      return fetch("/api/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "upload", id: "design:" + key, name: file.name || "design.webp",
                               mime: r.mime, data: r.data }),
      });
    }).then(function (res) {
      return res.json().then(function (j) {
        if (!res.ok || j.error) throw new Error(j.error || "อัปโหลดไม่สำเร็จ");
        return fetch("/api/state").then(function (s) { return s.json(); });
      });
    }).then(function (st) {
      state = st; render(); toast("อัปโหลดแล้ว");
    }).catch(function (e) { toast(e.message, true); });
  }

  /* ---------- ดูภาพ / เทียบซ้ายขวา ---------- */
  var grp = null, idx = 0, cmpKey = null;

  function show(i) {
    if (!grp || i < 0 || i >= grp.length) return;
    idx = i;
    var sh = grp[idx];
    var L = document.getElementById("sclbL"), R = document.getElementById("sclbR");
    L.innerHTML = '<div class="sclbtag">ของจริงในเว็บ</div><img src="/screens/full/' + sh.img + '">';
    var du = cmpKey ? designUrl(cmpKey) : null;
    var note = cmpKey && slotOf(cmpKey) ? slotOf(cmpKey).note : "";
    R.style.display = "";
    R.innerHTML = '<div class="sclbtag">ดีไซน์ (Figma)</div>' +
      (du ? '<img src="' + du + '">'
          : '<div class="scdrop scdroplb" data-key="' + esc(cmpKey || "") + '" tabindex="0">' +
            '<div class="schint">ยังไม่มีดีไซน์ของชุดนี้<br><small>ลากภาพมาวาง · กดเพื่อเลือกไฟล์ · Ctrl+V</small></div></div>') +
      (note ? '<a class="scfiggo" href="' + esc(note) + '" target="_blank" rel="noreferrer">เปิดใน Figma</a>' : "");
    wireDrop();
    document.getElementById("sclbcap").innerHTML =
      esc(sh.caption) + "<small>ภาพที่ " + (idx + 1) + " จาก " + grp.length +
      (idx === 0 ? " · ใบแรก" : "") + (idx === grp.length - 1 ? " · ใบสุดท้าย" : "") + "</small>";
    document.getElementById("sclbp").disabled = idx === 0;
    document.getElementById("sclbn").disabled = idx === grp.length - 1;
    document.getElementById("sclb").classList.add("on");
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    var cmp = t.closest(".sccmp");
    if (cmp) {
      var g1 = data.groups[+cmp.dataset.g];
      cmpKey = cmp.dataset.key;
      grp = g1.shots.filter(function (s) { return s.sectionKey === cmpKey; });
      show(0); return;
    }
    var shot = t.closest("a.scshot");
    if (shot) {
      e.preventDefault();
      var g2 = data.groups[+shot.dataset.g];
      var me = g2.shots.filter(function (s) { return s.img === shot.dataset.img; })[0];
      cmpKey = me && designUrl(me.sectionKey) ? me.sectionKey : null;
      grp = me ? g2.shots.filter(function (s) { return s.sectionKey === me.sectionKey; }) : g2.shots;
      show(grp.indexOf(me)); return;
    }
    if (t.closest("#sclbp")) { show(idx - 1); return; }
    if (t.closest("#sclbn")) { show(idx + 1); return; }
    if (t.closest("#sclbx") || t.id === "sclb") { document.getElementById("sclb").classList.remove("on"); return; }
    var re = t.closest(".scre");
    if (re) { pendingKey = re.dataset.key; document.getElementById("scfile").click(); return; }
    var cp = t.closest(".sccopy");
    if (cp) {
      var txt = cp.dataset.u, done = function () {
        var old = cp.textContent; cp.textContent = "คัดลอกแล้ว"; cp.classList.add("done");
        setTimeout(function () { cp.textContent = old; cp.classList.remove("done"); }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { legacy(txt, done); });
      else legacy(txt, done);
    }
  });

  function legacy(txt, done) {
    var ta = document.createElement("textarea");
    ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = 0;
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { prompt("ก๊อป URL นี้ไปวางได้เลย:", txt); }
    document.body.removeChild(ta);
  }

  document.addEventListener("keydown", function (e) {
    var lb = document.getElementById("sclb");
    if (!lb || !lb.classList.contains("on")) return;
    if (e.key === "Escape") lb.classList.remove("on");
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();
