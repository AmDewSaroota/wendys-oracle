/* แท็บ "หน้าจอ" — ภาพหน้าจอทุกหน้าของ fortal.studio เรียงตาม URL
   แกนคือ URL เพราะสิ่งที่ผู้ใช้กดเพื่อไปถึงหน้าคือ URL · หน้าต่างซ้อนกับเมนูที่ไม่มี URL
   ของตัวเอง จะอยู่ใต้ URL ที่มันเกิด */
(function () {
  var V = window.__V || "1";
  var root = document.getElementById("root");
  var data = null, q = "";

  fetch("/screens-data.json?v=" + V).then(function (r) { return r.json(); }).then(function (d) {
    data = d; render();
  }).catch(function (e) {
    root.innerHTML = '<div class="wrap" style="padding:60px 0">โหลดข้อมูลไม่ได้: ' + e.message + "</div>";
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function stats() {
    var app = data.groups.filter(function (g) { return g.url.indexOf("[เว็บคู่มือ]") !== 0; });
    var imgs = 0;
    data.groups.forEach(function (g) { imgs += g.shots.length; });
    return { urls: app.length, docs: data.groups.length - app.length, imgs: imgs };
  }

  function render() {
    var s = stats();
    var html = "";
    html += '<header class="top"><div class="hrow">' +
      '<div class="brand"><b>Fortal — แคตตาล็อกสำหรับดีไซน์</b>' +
      '<span>' + esc(data.note) + "</span></div>" +
      '<nav class="sctabs"><a href="/">ไอคอน</a><a href="/screens" class="on">หน้าจอ</a></nav>' +
      "</div></header>";

    html += '<div class="wrap">';
    html += '<div class="sckpi">' +
      '<div><b>' + s.urls + "</b><span>URL ของเว็บแอป</span></div>" +
      '<div><b>' + s.imgs + "</b><span>ภาพหน้าจอ</span></div>" +
      '<div><b>' + s.docs + "</b><span>หน้าเว็บคู่มือ</span></div>" +
      '<div><b>' + esc(data.captured) + "</b><span>วันที่เก็บภาพ</span></div></div>";

    html += '<div class="scsearch"><input id="scq" placeholder="พิมพ์เพื่อกรอง — เช่น billing, studio, เมนู" value="' + esc(q) + '"></div>';

    var cur = null, shown = 0;
    data.groups.forEach(function (g, gi) {
      var hay = (g.url + " " + g.desc + " " + g.group + " " +
                 g.shots.map(function (x) { return x.caption; }).join(" ")).toLowerCase();
      if (q && hay.indexOf(q.toLowerCase()) < 0) return;
      shown++;
      if (g.group !== cur) { html += "<h2>" + esc(g.group) + "</h2>"; cur = g.group; }
      html += '<div class="scrow" data-g="' + gi + '">' +
        '<div class="sctop">' +
        '<a class="scurl" href="' + esc(g.urlFull) + '" target="_blank" rel="noreferrer">' + esc(g.urlFull) + "</a>" +
        '<button class="sccopy" data-u="' + esc(g.urlFull) + '">คัดลอก URL</button>' +
        '<span class="scdesc">' + esc(g.desc) + "</span>" +
        '<span class="sccount">' + g.shots.length + " ภาพ</span></div>";
      if (g.shots.length) {
        html += '<div class="scshots">';
        g.shots.forEach(function (sh, si) {
          html += '<a class="scshot" data-g="' + gi + '" data-i="' + si + '" title="' + esc(sh.caption) + '">' +
                  '<img loading="lazy" src="/screens/thumb/' + esc(sh.img) + '"></a>';
        });
        html += "</div>";
      }
      html += "</div>";
    });
    if (!shown) html += '<div class="scempty">ไม่มี URL ไหนตรงกับคำที่พิมพ์</div>';
    html += "</div>";

    html += '<div id="sclb"><button id="sclbx" title="ปิด (Esc)">&times;</button>' +
      '<button class="scnav" id="sclbp">&#8249;</button>' +
      '<img id="sclbimg"><div id="sclbcap"></div>' +
      '<button class="scnav" id="sclbn">&#8250;</button></div>';

    root.innerHTML = html;
    var box = document.getElementById("scq");
    box.addEventListener("input", function () {
      q = box.value;
      var pos = box.selectionStart;
      render();
      var nb = document.getElementById("scq");
      nb.focus(); try { nb.setSelectionRange(pos, pos); } catch (e) {}
    });
  }

  /* ---- ดูภาพขยายในหน้าเดิม — เลื่อนซ้ายขวาได้เฉพาะภาพของ URL เดียวกัน และไม่วน ---- */
  var grp = null, idx = 0;
  function show(i) {
    if (!grp || i < 0 || i >= grp.length) return;
    idx = i;
    var sh = grp[idx];
    document.getElementById("sclbimg").src = "/screens/full/" + sh.img;
    document.getElementById("sclbcap").innerHTML =
      esc(sh.caption) + "<small>ภาพที่ " + (idx + 1) + " จาก " + grp.length +
      (idx === 0 ? " · ใบแรก" : "") + (idx === grp.length - 1 ? " · ใบสุดท้าย" : "") + "</small>";
    document.getElementById("sclbp").disabled = idx === 0;
    document.getElementById("sclbn").disabled = idx === grp.length - 1;
    document.getElementById("sclb").classList.add("on");
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    var shot = t.closest ? t.closest("a.scshot") : null;
    if (shot) {
      e.preventDefault();
      grp = data.groups[+shot.dataset.g].shots;
      show(+shot.dataset.i);
      return;
    }
    if (t.closest("#sclbp")) { show(idx - 1); return; }
    if (t.closest("#sclbn")) { show(idx + 1); return; }
    if (t.closest("#sclbx") || t.id === "sclb") { document.getElementById("sclb").classList.remove("on"); return; }
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
