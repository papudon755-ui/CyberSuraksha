/* CyberSuraksha — shared interactions */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Spot the scam (threats.html) ---------- */
  var scam = document.getElementById("scamGame");
  if (scam) {
    var hotspots = Array.prototype.slice.call(scam.querySelectorAll(".hotspot"));
    var total = hotspots.length;
    var found = 0;
    var countEl = document.getElementById("scamCount");
    var flagItems = {};
    Array.prototype.forEach.call(document.querySelectorAll(".flag-list li"), function (li) {
      flagItems[li.getAttribute("data-flag")] = li;
    });

    function updateCounter() {
      if (countEl) countEl.innerHTML = "Found <b>" + found + "</b> of " + total + " red flags";
    }

    hotspots.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.classList.contains("found")) return;
        btn.classList.add("found");
        btn.setAttribute("aria-pressed", "true");
        found += 1;
        var key = btn.getAttribute("data-flag");
        var li = flagItems[key];
        if (li) {
          li.classList.add("revealed");
          li.querySelector(".flag-text").textContent = btn.getAttribute("data-explain");
        }
        updateCounter();
        if (found === total) {
          var done = document.getElementById("scamDone");
          if (done) {
            done.classList.add("show");
            done.setAttribute("tabindex", "-1");
            done.focus({ preventScroll: false });
          }
        }
      });
    });
    updateCounter();
  }

  /* ---------- Password strength checker (safety-tips.html) ---------- */
  var pwInput = document.getElementById("pwInput");
  if (pwInput) {
    var fill = document.getElementById("pwFill");
    var label = document.getElementById("pwLabel");

    pwInput.addEventListener("input", function () {
      var v = pwInput.value;
      var score = 0;
      if (v.length >= 8) score += 1;
      if (v.length >= 12) score += 1;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score += 1;
      if (/\d/.test(v)) score += 1;
      if (/[^A-Za-z0-9]/.test(v)) score += 1;

      var pct = [0, 20, 40, 60, 80, 100][score];
      fill.style.width = pct + "%";

      label.className = "meter-label";
      if (!v) {
        label.textContent = "Type a password to check its strength.";
        fill.style.width = "0";
        return;
      }
      if (score <= 2) {
        label.textContent = "Weak — easy to guess. Try a longer password with mixed characters.";
        label.classList.add("weak");
        fill.style.background = "var(--danger)";
      } else if (score <= 4) {
        label.textContent = "Okay — getting there. Add more length or symbols to make it strong.";
        label.classList.add("okay");
        fill.style.background = "var(--accent)";
      } else {
        label.textContent = "Strong — good length and variety. Keep it unique to one account.";
        label.classList.add("strong");
        fill.style.background = "var(--ok)";
      }
    });
  }

  /* ---------- Safe-browsing checklist ---------- */
  var checklist = document.getElementById("safeChecklist");
  if (checklist) {
    var boxes = checklist.querySelectorAll('input[type="checkbox"]');
    var progress = document.getElementById("checklistProgress");
    function refresh() {
      var done = 0;
      boxes.forEach(function (b) {
        b.closest("li").classList.toggle("done", b.checked);
        if (b.checked) done += 1;
      });
      if (progress) progress.textContent = done + " of " + boxes.length + " habits checked";
    }
    boxes.forEach(function (b) { b.addEventListener("change", refresh); });
    refresh();
  }
  /* ---------- Hero particle wave (index.html, lightweight) ---------- */
  (function () {
    var canvas = document.getElementById("heroWave");
    if (!canvas) return;
    var img = document.getElementById("heroImg");
    function showFallback() {
      canvas.hidden = true;
      if (img && img.dataset.src && !img.src) img.src = img.dataset.src;
      if (img) img.hidden = false;
    }
    /* No canvas, or user prefers reduced motion -> static image, zero animation cost */
    if (!canvas.getContext ||
        (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      showFallback();
      return;
    }
    var ctx = canvas.getContext("2d");
    if (!ctx) { showFallback(); return; }
    canvas.hidden = false;

    var W = 0, H = 0, dots = [], raf = null;
    var DPR = Math.min(window.devicePixelRatio || 1, 1.5); /* cap resolution for speed */
    var COLORS = ["34,211,238", "125,211,252", "224,242,254"];

    function build() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = Math.max(300, r.width);
      H = Math.max(180, r.height);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      dots = [];
      var cols = Math.max(56, Math.min(140, Math.floor(W / 16))); /* ~56-140 columns */
      var rows = 7;
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          dots.push({
            bx: (i + 0.5) / cols * W,
            by: (j + 0.5) / rows * H,
            /* phase tied to x-position so dots move as coherent waves */
            ph: (i / cols) * Math.PI * 3 + Math.random() * 0.5,
            sp: 0.6 + Math.random() * 0.8,
            sz: 1.4 + Math.random() * 2.4
          });
        }
      }
    }

    function frame(ts) {
      raf = null;
      if (document.hidden) return;
      var t = ts / 1000;
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < dots.length; k++) {
        var d = dots[k];
        var w1 = Math.sin(d.ph + t * 0.9 * d.sp);
        var w2 = Math.sin(d.ph * 2.3 - t * 0.55 * d.sp);
        var x = d.bx + Math.cos(t * 0.35 * d.sp + d.ph) * 7;
        var y = d.by + w1 * H * 0.18 + w2 * H * 0.08;
        var glow = w1 * 0.375 + 0.625; /* 0.25..1 brighter on wave crests */
        var crest = glow > 0.82; /* bright white crest dots */
        ctx.beginPath();
        ctx.arc(x, y, d.sz * (crest ? 1.5 : (0.7 + glow * 0.6)), 0, 6.2832);
        ctx.fillStyle = crest
          ? "rgba(255,255,255,0.95)"
          : "rgba(" + COLORS[k % 3] + "," + (0.25 + glow * 0.65).toFixed(2) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf && !document.hidden) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.05 }).observe(canvas);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    var rsz = null;
    window.addEventListener("resize", function () {
      if (rsz) clearTimeout(rsz);
      rsz = setTimeout(function () { build(); start(); }, 200);
    });
    build();
    start();
  })();
})();
