/* David School Options — app logic.
   All data stays in this browser's localStorage unless the owner turns on Sync (private Gist, his own token).
   No SSN, student ID or medical record numbers are collected anywhere. */
(function () {
  "use strict";
  var D = window.DSO_DATA, S = window.DsoSync;
  var KEY = "dso-state-v1";
  var STATUSES = ["Not started", "Applied", "Approved", "Denied"];

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function nowISO() { return new Date().toISOString(); }
  function uid(p) { return (p || "x") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function link(label, url) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>"; }
  function tel(p) { if (!p) return ""; var d = p.replace(/[^0-9]/g, ""); return '<a class="tel" href="tel:' + d + '">📞 ' + esc(p) + "</a>"; }
  function fmtDate(iso) { if (!iso) return ""; var p = iso.split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2]); return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }); }
  function todayStr() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function fmtStamp(iso) { try { return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); } catch (e) { return iso; } }
  function optById(id) { for (var i = 0; i < D.OPTIONS.length; i++) if (D.OPTIONS[i].id === id) return D.OPTIONS[i]; return null; }
  function fundById(id) { for (var i = 0; i < D.FUNDING.length; i++) if (D.FUNDING[i].id === id) return D.FUNDING[i]; return null; }
  function verifiedTag() { return '<span class="verified">✓ Verified on ' + esc(fmtDate(D.VERIFIED)) + "</span>"; }
  function sourcesHtml(list) { return '<p class="sources">Sources: ' + list.map(function (s) { return link(s.label, s.url); }).join(" · ") + "</p>"; }
  /* warns if text contains something shaped like an SSN or a long ID number */
  function looksSensitive(v) { var s = String(v || ""); return /\b\d{3}-\d{2}-\d{4}\b/.test(s) || /\d{9,}/.test(s.replace(/[\s-]/g, "")); }

  /* ---------- state ---------- */
  function emptyState() {
    var s = { version: 1, settings: {}, settingsTimes: {}, tombstones: S.emptyTombs() };
    S.LIST_KEYS.forEach(function (k) { s[k] = []; });
    S.FLAG_KEYS.forEach(function (k) { s[k] = {}; });
    return s;
  }
  function load() {
    var base = emptyState(), s;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { s = null; }
    if (!s) s = base;
    S.LIST_KEYS.forEach(function (k) { if (!Array.isArray(s[k])) s[k] = []; });
    S.FLAG_KEYS.forEach(function (k) { if (!s[k] || typeof s[k] !== "object") s[k] = {}; });
    s.settings = s.settings || {}; s.settingsTimes = s.settingsTimes || {};
    var t = s.tombstones || {}; Object.keys(base.tombstones).forEach(function (k) { if (!t[k]) t[k] = {}; }); s.tombstones = t;
    return s;
  }
  var state = load();
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function save() { persist(); schedulePush(); }
  function getSet(k, dflt) { return state.settings[k] === undefined || state.settings[k] === null ? dflt : state.settings[k]; }
  function setSet(k, v) { state.settings[k] = v; state.settingsTimes[k] = nowISO(); save(); }
  function find(key, id) { for (var i = 0; i < state[key].length; i++) if (state[key][i].id === id) return state[key][i]; return null; }
  function upsert(key, obj) {
    obj.updatedAt = nowISO(); if (!obj.createdAt) obj.createdAt = obj.updatedAt;
    var cur = find(key, obj.id);
    if (cur) Object.keys(obj).forEach(function (k) { cur[k] = obj[k]; }); else state[key].push(obj);
    if (state.tombstones[key][obj.id]) delete state.tombstones[key][obj.id];
    save();
  }
  function removeItem(key, id) { state[key] = state[key].filter(function (x) { return x.id !== id; }); state.tombstones[key][id] = nowISO(); save(); }
  function setFlag(a, b, v) { if (!state.checks[a]) state.checks[a] = {}; state.checks[a][b] = { value: v, updatedAt: nowISO() }; var k = a + "|" + b; if (state.tombstones.checks[k]) delete state.tombstones.checks[k]; save(); }
  function getFlag(a, b) { var r = state.checks[a] && state.checks[a][b]; return !!(r && (r === true || r.value)); }
  function isFav(id) { return !!find("favorites", id); }
  function toggleFav(id) { if (isFav(id)) { removeItem("favorites", id); toast("Removed from saved"); } else { upsert("favorites", { id: id }); toast("Saved ★"); } }
  function inCompare(id) { return !!find("compare", id); }
  function toggleCompare(id) {
    if (inCompare(id)) { removeItem("compare", id); return; }
    if (state.compare.length >= 4) { toast("You can compare up to 4. Remove one first."); rerender(true); return; }
    upsert("compare", { id: id }); toast("Added to Compare (" + state.compare.length + ")");
  }
  function profile() { var p = getSet("profile", null); var d = JSON.parse(JSON.stringify(D.PROFILE_DEFAULT)); if (p) Object.keys(p).forEach(function (k) { if (p[k] !== "" && p[k] != null) d[k] = p[k]; }); return d; }

  /* ---------- theme ---------- */
  function applyTheme() { var t = getSet("theme", null) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); document.documentElement.dataset.theme = t; var b = $("#themeBtn"); if (b) b.textContent = t === "dark" ? "☀" : "☾"; }

  var toastTimer;
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200); }

  /* ---------- navigation ---------- */
  var NAV = [
    { id: "home", label: "Home", ico: "🏠", group: "Plan" },
    { id: "find", label: "Find options", ico: "🧭", group: "Plan" },
    { id: "results", label: "Results", ico: "📋", group: "Plan" },
    { id: "compare", label: "Compare", ico: "⚖️", group: "Plan" },
    { id: "saved", label: "Saved", ico: "★", group: "Plan" },
    { id: "funding", label: "Funding finder", ico: "💵", group: "Money & dates" },
    { id: "deadlines", label: "Deadlines", ico: "📅", group: "Money & dates" },
    { id: "docs", label: "Documents", ico: "🗂️", group: "Money & dates" },
    { id: "iep", label: "IEP & rights", ico: "🛡️", group: "Supports" },
    { id: "social", label: "Social & activities", ico: "🤝", group: "Supports" },
    { id: "planner", label: "Homeschool planner", ico: "📚", group: "Supports" },
    { id: "calls", label: "Calls & contacts", ico: "☎️", group: "Supports" },
    { id: "sync", label: "Sync", ico: "⟳", group: "More" },
    { id: "about", label: "About & sources", ico: "ℹ️", group: "More" }
  ];
  function renderNav(route) {
    var html = "", g = "";
    NAV.forEach(function (n) {
      if (n.group !== g) { g = n.group; html += '<div class="rail-group">' + esc(g) + "</div>"; }
      var badge = n.id === "compare" && state.compare.length ? ' <span class="pill">' + state.compare.length + "</span>" : n.id === "saved" && state.favorites.length ? ' <span class="pill">' + state.favorites.length + "</span>" : "";
      html += '<a href="#/' + n.id + '" class="' + (route === n.id ? "active" : "") + '"><span class="ico">' + n.ico + "</span>" + esc(n.label) + badge + "</a>";
    });
    $("#rail").innerHTML = html;
    var tabs = [["home", "🏠", "Home"], ["find", "🧭", "Find"], ["funding", "💵", "Funding"], ["compare", "⚖️", "Compare"], ["more", "☰", "More"]];
    $("#tabbar").innerHTML = tabs.map(function (t) {
      var act = route === t[0] || (t[0] === "more" && ["more", "deadlines", "docs", "iep", "social", "planner", "calls", "sync", "about", "saved"].indexOf(route) !== -1) || (t[0] === "find" && route === "results");
      var badge = t[0] === "compare" && state.compare.length ? '<i class="dot">' + state.compare.length + "</i>" : "";
      return '<a href="#/' + t[0] + '" class="' + (act ? "active" : "") + '"><span>' + t[1] + badge + "</span>" + t[2] + "</a>";
    }).join("");
  }

  /* ---------- wizard & matching ---------- */
  var WZ_DEFAULT = { models: ["homeschool", "hybrid", "virtual", "private", "public"], needs: ["behavior", "attention", "social"], academic: "capable", small: true, faith: "any", budget: "any", distance: "25" };
  function wz() { var w = getSet("wizard", null) || {}; var o = JSON.parse(JSON.stringify(WZ_DEFAULT)); Object.keys(w).forEach(function (k) { o[k] = w[k]; }); return o; }
  var BUDGETS = { free: { label: "Free only", max: 0 }, "5k": { label: "Up to $5,000 a year", max: 5000 }, "15k": { label: "Up to $15,000 a year", max: 15000 }, "40k": { label: "Up to $40,000 a year", max: 40000 }, any: { label: "Any (show all)", max: Infinity } };
  var DISTS = { "10": { label: "Within about 10 miles", max: 10 }, "25": { label: "Within about 25 miles (Plano, Dallas, McKinney)", max: 25 }, any: { label: "Any distance or online", max: Infinity } };
  var NEEDS = [
    { id: "behavior", label: "Behavior support", hint: "structure, clear routines, a behavior plan (BIP)" },
    { id: "attention", label: "Attention and focus", hint: "short lessons, movement breaks, fewer distractions" },
    { id: "social", label: "Social interaction (sometimes)", hint: "social-skills teaching, counseling, peer groups" },
    { id: "exec", label: "Executive function", hint: "organization, planning, time management" }
  ];
  function scoreOption(o, w) {
    var sc = 0, why = [], warn = [];
    var has = function (t) { return o.tags.indexOf(t) !== -1; };
    w.needs.forEach(function (n) { if (has(n)) { sc += 3; why.push(D.TAGS[n]); } });
    if (has("autism")) { sc += 3; why.push(D.TAGS.autism); }
    if (w.academic === "advanced") { if (has("twoE")) { sc += 4; why.push(D.TAGS.twoE); } if (has("advanced")) { sc += 3; why.push(D.TAGS.advanced); } }
    else { if (has("advanced")) { sc += 2; why.push(D.TAGS.advanced); } if (has("twoE")) { sc += 2; why.push(D.TAGS.twoE); } }
    if (w.small && has("small")) { sc += 2; why.push(D.TAGS.small); }
    if (has("iep")) { sc += 1; why.push(D.TAGS.iep); }
    if (has("flex")) { sc += 1; why.push(D.TAGS.flex); }
    if (w.faith === "sda") { if (has("sda")) { sc += 6; why.push(D.TAGS.sda); } else if (has("faith")) { sc += 1; why.push(D.TAGS.faith); } }
    if (w.faith === "christian" && has("faith")) { sc += 3; why.push(D.TAGS.faith); }
    if (o.costMax == null) warn.push("Cost not published. Call or check the site.");
    if (o.model !== "homeschool") w.needs.forEach(function (n) { if (!has(n)) warn.push("Doesn't list " + D.TAGS[n].toLowerCase() + ". Ask about it."); });
    return { score: sc, why: why.filter(function (x, i, a) { return a.indexOf(x) === i; }), warn: warn.slice(0, 3) };
  }
  function matchAll(w) {
    var bmax = (BUDGETS[w.budget] || BUDGETS.any).max, dmax = (DISTS[w.distance] || DISTS.any).max;
    var now = [], later = [], out = [];
    D.OPTIONS.forEach(function (o) {
      if (w.models.indexOf(o.model) === -1) { out.push({ o: o, reason: "Not a school type you picked" }); return; }
      if (o.costMax != null && o.costMax > bmax) { out.push({ o: o, reason: "Over your budget" }); return; }
      if (o.miles != null && o.miles > dmax) { out.push({ o: o, reason: "Farther than you picked" }); return; }
      var r = scoreOption(o, w); r.o = o;
      (o.later ? later : now).push(r);
    });
    now.sort(function (a, b) { return b.score - a.score || a.o.name.localeCompare(b.o.name); });
    later.sort(function (a, b) { return b.score - a.score; });
    return { now: now, later: later, out: out };
  }
  function scoreWithO(o) { var r = scoreOption(o, wz()); r.o = o; return r; }

  /* ---------- cards ---------- */
  function optionCard(r, rank) {
    var o = r.o, fav = isFav(o.id), cmp = inCompare(o.id);
    var dist = o.miles ? o.city + " · about " + o.miles + " mi" : o.city;
    return '<article class="card opt" data-id="' + o.id + '">' +
      '<div class="opt-top"><span class="chip model-' + o.model + '">' + esc(D.MODELS[o.model]) + "</span>" + (o.later ? '<span class="chip later">Later: ' + esc(o.later) + "</span>" : "") + (rank ? '<span class="rank">#' + rank + "</span>" : "") +
      '<button type="button" class="star' + (fav ? " on" : "") + '" data-act="fav" data-id="' + o.id + '" aria-label="' + (fav ? "Remove from saved" : "Save") + '">' + (fav ? "★" : "☆") + "</button></div>" +
      '<h3><a href="#/option/' + o.id + '">' + esc(o.name) + "</a></h3>" +
      '<p class="meta">' + esc(o.org) + "<br>📍 " + esc(dist) + " · Grades: " + esc(o.grades) + "</p>" +
      "<p>" + esc(o.summary) + "</p>" +
      '<p class="cost"><b>Cost:</b> ' + esc(o.cost) + "</p>" +
      (r.why && r.why.length ? '<div class="why">' + r.why.map(function (w) { return '<span class="tag ok">✓ ' + esc(w) + "</span>"; }).join("") + "</div>" : "") +
      (r.warn && r.warn.length ? '<ul class="warn">' + r.warn.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul>" : "") +
      '<div class="row">' + (o.phone ? tel(o.phone) : "") + link("Official site ↗", o.url) + '<a href="#/option/' + o.id + '">Details →</a>' +
      '<label class="cmp"><input type="checkbox" data-act="cmp" data-id="' + o.id + '"' + (cmp ? " checked" : "") + "> Compare</label></div>" +
      verifiedTag() + "</article>";
  }
  function disclaimer() { return '<div class="disclaimer"><b>Please note:</b> This app is for information only. It isn\'t legal, financial or educational advice. Costs, dates and rules change, so always check with each school or program before you decide. Every item links to its official source and shows the date it was checked.</div>'; }

  /* ---------- views ---------- */
  function viewHome() {
    var p = profile(), w = wz(), m = matchAll(w), top = m.now.slice(0, 3);
    var applied = state.funding.filter(function (f) { return f.status && f.status !== "Not started"; }).length;
    var upcoming = allDeadlines().filter(function (d) { return d.date >= todayStr(); }).slice(0, 3);
    return '<div class="page-head"><p class="kicker">School options for David · Frisco, TX</p><h1>Find the right school setup for David</h1><p class="lead">Homeschool, hybrid (part home, part school), virtual public, private, or staying public with better supports, plus the money that can help pay for it. Facts come from official sources only.</p></div>' +
      '<div class="card profile"><div class="row between"><h2>👦 David\'s profile</h2><button type="button" class="btn small" data-act="editProfile">Edit</button></div>' +
      '<p class="big">' + esc(p.summary) + '</p><ul class="facts"><li><b>Age:</b> ' + esc(p.age) + "</li><li><b>Home:</b> " + esc(p.city) + "</li><li><b>School now:</b> " + esc(p.school) + "</li><li><b>Plan:</b> " + esc(p.plan) + "</li><li><b>History:</b> " + esc(p.history) + '</li></ul><div class="why">' + ["Academically capable", "Behavior support", "Attention and focus", "Social interaction (sometimes)"].map(function (x) { return '<span class="tag ok">' + x + "</span>"; }).join("") + '</div><p class="help">No student ID, SSN or medical numbers are stored.</p></div>' +
      '<div class="grid3">' +
      '<a class="card tile" href="#/find"><span class="tile-ico">🧭</span><b>Find options</b><span>Answer 5 quick questions</span></a>' +
      '<a class="card tile" href="#/funding"><span class="tile-ico">💵</span><b>Funding finder</b><span>' + D.FUNDING.length + " programs · " + applied + " in progress</span></a>" +
      '<a class="card tile" href="#/compare"><span class="tile-ico">⚖️</span><b>Compare</b><span>' + state.compare.length + " picked</span></a></div>" +
      '<div class="card key"><h2>Key facts right now</h2><ul>' +
      "<li><b>TEFA (Texas ESA):</b> 2026-27 applications are closed (they ran February 4 to March 17, 2026). Dates for 2027-28 haven't been announced, so join the " + link("interest list", "https://educationfreedom.texas.gov/families/") + ". In 2026-27 it paid up to $30,000 for a student with an IEP at a participating private school, or $2,000 for homeschool.</li>" +
      "<li><b>PDSES ($1,500, one time):</b> for public-school students with an IEP. The next window is spring 2027. " + link("Details", "https://spedtex.tea.texas.gov/resources/pdses/frequently-asked-questions") + "</li>" +
      "<li><b>If you homeschool,</b> David's IEP ends. Frisco ISD can still offer some services through a services plan. " + link("Frisco ISD FAQ", "https://www.friscoisd.org/o/fisd/page/faq-specialed") + "</li>" +
      '<li><b>Hybrid that fits "2 days school, 3 days home":</b> <a href="#/option/dia">Duc in Altum</a> (McKinney, Tuesdays and Thursdays on campus) and <a href="#/option/coramdeo">Coram Deo</a> (Plano, 2 to 3 days on campus).</li>' +
      "<li><b>Frisco Flex</b> (Frisco ISD online and hybrid) is for grades 9 to 12 only, so it's for later.</li></ul>" + verifiedTag() + "</div>" +
      (top.length ? '<h2 class="sec">Top matches for your answers</h2><div class="cards">' + top.map(function (r, i) { return optionCard(r, i + 1); }).join("") + '</div><p><a class="btn primary" href="#/results">See all ' + m.now.length + " matches →</a></p>" : "") +
      (upcoming.length ? '<div class="card"><h2>Coming up</h2><ul class="plain">' + upcoming.map(function (d) { return "<li><b>" + esc(fmtDate(d.date)) + "</b>: " + esc(d.title) + "</li>"; }).join("") + '</ul><a href="#/deadlines">All deadlines →</a></div>' : "") +
      disclaimer();
  }

  var wzStep = 0;
  function choice(type, name, value, checked, title, desc) { return '<label class="choice"><input type="' + type + '" name="' + name + '" value="' + value + '"' + (checked ? " checked" : "") + "><span><b>" + esc(title) + "</b>" + (desc ? "<small>" + esc(desc) + "</small>" : "") + "</span></label>"; }
  function viewFind() {
    var w = wz(), steps = ["School type", "David's needs", "Faith", "Budget", "Distance"];
    var bar = '<ol class="steps">' + steps.map(function (s, i) { return '<li class="' + (i === wzStep ? "on" : i < wzStep ? "done" : "") + '"><button type="button" data-act="wzGo" data-i="' + i + '">' + (i + 1) + ". " + esc(s) + "</button></li>"; }).join("") + "</ol>";
    var body = "";
    if (wzStep === 0) {
      var desc = { homeschool: "You teach at home, with co-ops and clubs for friends", hybrid: "For example, 2 days at school and 3 at home", virtual: "Free online public school, and his IEP still applies", private: "Includes schools for bright students who learn differently", public: "Keep his IEP at Frisco ISD and add the supports he needs" };
      body = "<h2>Which school setups do you want to see?</h2><p class=\"help\">Pick as many as you like.</p><div class=\"choices\">" + Object.keys(D.MODELS).map(function (k) { return choice("checkbox", "models", k, w.models.indexOf(k) !== -1, D.MODELS[k], desc[k]); }).join("") + "</div>";
    } else if (wzStep === 1) {
      body = "<h2>What does David need help with?</h2><p class=\"help\">David is academically capable. His autism affects behavior, attention and sometimes social interaction, not his intelligence.</p><div class=\"choices\">" + NEEDS.map(function (n) { return choice("checkbox", "needs", n.id, w.needs.indexOf(n.id) !== -1, n.label, n.hint); }).join("") +
        choice("checkbox", "small", "1", w.small, "Small classes or 1-to-1", "fewer distractions and more teacher attention") + "</div>" +
        '<h3>Academic level</h3><div class="choices two">' + choice("radio", "academic", "capable", w.academic !== "advanced", "Grade level", "keep the work on track and challenging") + choice("radio", "academic", "advanced", w.academic === "advanced", "Advanced / gifted", "puts twice-exceptional (2e) and rigorous schools first") + "</div>";
    } else if (wzStep === 2) {
      body = "<h2>Faith preference</h2><div class=\"choices\">" + choice("radio", "faith", "any", w.faith === "any", "No preference", "show every option") + choice("radio", "faith", "christian", w.faith === "christian", "Christian schools first", "rank Christian options higher") + choice("radio", "faith", "sda", w.faith === "sda", "Seventh-day Adventist first", "rank Adventist schools highest, then other Christian ones") + "</div>";
    } else if (wzStep === 3) {
      body = "<h2>Budget per year (before any aid)</h2><p class=\"help\">Schools that don't publish tuition are still shown, marked \"Check site\".</p><div class=\"choices\">" + Object.keys(BUDGETS).map(function (k) { return choice("radio", "budget", k, w.budget === k, BUDGETS[k].label); }).join("") + "</div>";
    } else {
      body = "<h2>How far from Frisco?</h2><p class=\"help\">Distances are straight-line miles from the center of ZIP 75034. Driving distance is longer. Online options are always shown.</p><div class=\"choices\">" + Object.keys(DISTS).map(function (k) { return choice("radio", "distance", k, w.distance === k, DISTS[k].label); }).join("") + "</div>";
    }
    var nav = '<div class="row between wz-nav">' + (wzStep > 0 ? '<button type="button" class="btn" data-act="wzBack">← Back</button>' : "<span></span>") + (wzStep < 4 ? '<button type="button" class="btn primary" data-act="wzNext">Next →</button>' : '<button type="button" class="btn primary" data-act="wzDone">Show matches →</button>') + "</div>";
    return '<div class="page-head"><p class="kicker">Guided finder · step ' + (wzStep + 1) + ' of 5</p><h1>Find options</h1></div>' + bar + '<form id="wzForm" class="card wz" onsubmit="return false">' + body + nav + "</form>";
  }
  function readWizardForm() {
    var f = $("#wzForm"); if (!f) return; var w = wz();
    if (wzStep === 0) { w.models = $all('input[name="models"]:checked', f).map(function (i) { return i.value; }); if (!w.models.length) w.models = WZ_DEFAULT.models.slice(); }
    if (wzStep === 1) { w.needs = $all('input[name="needs"]:checked', f).map(function (i) { return i.value; }); w.small = !!$('input[name="small"]', f).checked; var a = $('input[name="academic"]:checked', f); w.academic = a ? a.value : "capable"; }
    if (wzStep === 2) { var fa = $('input[name="faith"]:checked', f); w.faith = fa ? fa.value : "any"; }
    if (wzStep === 3) { var b = $('input[name="budget"]:checked', f); w.budget = b ? b.value : "any"; }
    if (wzStep === 4) { var d = $('input[name="distance"]:checked', f); w.distance = d ? d.value : "any"; }
    setSet("wizard", w);
  }
  function viewResults() {
    var w = wz(), m = matchAll(w);
    var summary = '<p class="help">Showing: ' + w.models.map(function (k) { return esc(D.MODELS[k]); }).join(", ") + " · Needs: " + (w.needs.length ? w.needs.map(function (n) { return esc(D.TAGS[n]); }).join(", ") : "none picked") + " · " + esc((BUDGETS[w.budget] || BUDGETS.any).label) + " · " + esc((DISTS[w.distance] || DISTS.any).label) + ' · <a href="#/find">Change answers</a></p>';
    return '<div class="page-head"><p class="kicker">Your matches</p><h1>Results</h1><p class="lead">Ranked by how well each option matches David\'s needs: behavior, attention, social support and challenging academics. Tap ☆ to save, or tick Compare to see options side by side.</p>' + summary + "</div>" +
      (m.now.length ? '<div class="cards">' + m.now.map(function (r, i) { return optionCard(r, i + 1); }).join("") + "</div>" : '<div class="card"><p>No matches with these answers. Try a bigger budget or distance.</p></div>') +
      (m.later.length ? '<h2 class="sec">For later (high school)</h2><div class="cards">' + m.later.map(function (r) { return optionCard(r); }).join("") + "</div>" : "") +
      (m.out.length ? '<details class="card"><summary>Hidden by your answers (' + m.out.length + ")</summary><ul>" + m.out.map(function (x) { return '<li><a href="#/option/' + x.o.id + '">' + esc(x.o.name) + "</a>: " + esc(x.reason) + "</li>"; }).join("") + "</ul></details>" : "") +
      '<details class="card"><summary>Looked at but not included</summary><ul>' + D.NOT_INCLUDED.map(function (n) { return "<li><b>" + esc(n.name) + "</b>: " + esc(n.why) + " " + link("Source", n.url) + "</li>"; }).join("") + "</ul></details>" + disclaimer();
  }
  function viewOption(id) {
    var o = optById(id); if (!o) return '<div class="card"><p>Not found.</p><a href="#/results">Back</a></div>';
    return '<p><a href="#/results">← Back to results</a></p>' + optionCard(scoreWithO(o)) +
      '<div class="card"><h2>What to know</h2><ul>' + o.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul><p><b>Eligibility:</b> " + esc(o.eligibility) + "</p>" + sourcesHtml(o.sources) + "</div>" +
      '<div class="card"><h2>Questions to ask on the call</h2><ul><li>How do you support students with autism who are academically capable but need help with behavior and attention?</li><li>Do you teach social skills or offer counseling or peer groups?</li><li>How big are classes, and are movement breaks allowed?</li><li>Do you use a behavior plan, and how do you keep parents updated?</li><li>What does the total cost include? Do you offer financial aid or accept TEFA?</li></ul><button type="button" class="btn" data-act="logCall" data-org="' + esc(o.name) + '" data-phone="' + esc(o.phone || "") + '">＋ Log a call with this school</button></div>';
  }
  function viewCompare() {
    var picked = state.compare.map(function (c) { return optById(c.id); }).filter(Boolean);
    if (!picked.length) return '<div class="page-head"><h1>Compare</h1><p class="lead">Tick "Compare" on up to 4 options in Results to see them side by side.</p></div><a class="btn primary" href="#/results">Go to Results →</a>';
    var w = wz();
    var rows = [
      ["Type", function (o) { return esc(D.MODELS[o.model]); }],
      ["Where", function (o) { return esc(o.city) + (o.miles ? "<br><small>about " + o.miles + " mi</small>" : ""); }],
      ["Grades", function (o) { return esc(o.grades) + (o.later ? '<br><span class="chip later">' + esc(o.later) + "</span>" : ""); }],
      ["Cost", function (o) { return esc(o.cost); }],
      ["Match score", function (o) { return "<b>" + scoreOption(o, w).score + "</b>"; }]
    ];
    ["behavior", "attention", "social", "exec", "autism", "small", "advanced", "twoE", "iep", "flex", "faith", "sda"].forEach(function (t) { rows.push([D.TAGS[t], function (o) { return o.tags.indexOf(t) !== -1 ? '<span class="yes">✓</span>' : '<span class="no">—</span>'; }]); });
    rows.push(["Eligibility", function (o) { return esc(o.eligibility); }]);
    rows.push(["Contact", function (o) { return (o.phone ? tel(o.phone) + "<br>" : "") + link("Official site ↗", o.url); }]);
    return '<div class="page-head"><p class="kicker">Side by side</p><h1>Compare</h1><p class="lead">✓ means the official source describes it. — means it isn\'t described, so ask.</p></div>' +
      '<div class="cmp-wrap"><table class="cmp-table"><thead><tr><th></th>' + picked.map(function (o) { return '<th><a href="#/option/' + o.id + '">' + esc(o.name) + '</a><br><button type="button" class="btn small" data-act="cmpRemove" data-id="' + o.id + '">Remove</button></th>'; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr><th>" + esc(r[0]) + "</th>" + picked.map(function (o) { return "<td>" + r[1](o) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>" +
      '<p class="help">Verified on ' + esc(fmtDate(D.VERIFIED)) + '. <button type="button" class="btn small" data-act="print">🖨 Print</button></p>' + disclaimer();
  }
  function viewSaved() {
    var favs = state.favorites.map(function (f) { return optById(f.id); }).filter(Boolean);
    return '<div class="page-head"><h1>Saved</h1><p class="lead">Options you starred. They sync across your devices.</p></div>' + (favs.length ? '<div class="cards">' + favs.map(function (o) { return optionCard(scoreWithO(o)); }).join("") + "</div>" : '<div class="card"><p>Nothing saved yet. Tap ☆ on any option.</p></div>');
  }

  /* ---------- funding ---------- */
  function fundState(id) { var f = find("funding", id); return f ? JSON.parse(JSON.stringify(f)) : { id: id, status: "Not started", applied: "", decided: "", notes: "" }; }
  function viewFunding() {
    var w = wz(), filter = getSet("fundFilter", "fits");
    var list = D.FUNDING.filter(function (f) { return filter === "all" || f.fit.some(function (m) { return w.models.indexOf(m) !== -1; }); });
    var custom = state.funding.filter(function (f) { return f.custom; });
    var counts = {}; STATUSES.forEach(function (s) { counts[s] = 0; });
    D.FUNDING.concat(custom).forEach(function (f) { var s = fundState(f.id).status || "Not started"; counts[s] = (counts[s] || 0) + 1; });
    return '<div class="page-head"><p class="kicker">State · federal · county · private</p><h1>Funding finder</h1><p class="lead">Money and services that can help pay for David\'s schooling and supports. Track each one: Not started, Applied, Approved or Denied. Amounts and dates appear only when they\'re verified. Otherwise it says "Check site."</p></div>' +
      '<div class="stats">' + STATUSES.map(function (s) { return '<div class="stat st-' + s.replace(/\s/g, "") + '"><b>' + counts[s] + "</b><span>" + s + "</span></div>"; }).join("") + "</div>" +
      '<div class="card checklist"><h2>✅ What to apply for (in order)</h2><ol>' +
      "<li>Join the " + link("TEFA interest list", "https://educationfreedom.texas.gov/families/") + " now, and gather his IEP and income documents for the 2027-28 window.</li>" +
      "<li>If he's still in public school in spring 2027, apply for " + link("PDSES ($1,500)", "https://spedtex.tea.texas.gov/resources/pdses/application-process") + ".</li>" +
      "<li>Contact a provider on the " + link("Children's Autism Program list", "https://www.hhs.texas.gov/services/disability/childrens-autism-program") + " about focused ABA for behavior and social skills.</li>" +
      "<li>Ask schools you like about their own financial aid. Coram Deo's priority deadline for new families is January 15, 2027.</li>" +
      "<li>Ask a tax professional about using a 529 for K-12 costs (up to $20,000 a year).</li>" +
      "<li>At age 14: TWC Pre-Employment Transition Services.</li></ol></div>" +
      '<div class="row seg"><button type="button" class="btn small' + (filter === "fits" ? " primary" : "") + '" data-act="fundFilter" data-v="fits">Fits the school types you picked (' + D.FUNDING.filter(function (f) { return f.fit.some(function (m) { return w.models.indexOf(m) !== -1; }); }).length + ')</button><button type="button" class="btn small' + (filter === "all" ? " primary" : "") + '" data-act="fundFilter" data-v="all">Show all ' + D.FUNDING.length + "</button></div>" +
      '<div class="cards">' + list.map(fundCard).join("") + custom.map(customFundCard).join("") + "</div>" +
      '<div class="card"><h2>Add your own program</h2><div class="grid2"><label class="field"><span>Program name</span><input id="cfName" maxlength="80"></label><label class="field"><span>Website (optional)</span><input id="cfUrl" type="url" placeholder="https://"></label></div><button type="button" class="btn primary" data-act="addFund">＋ Add</button></div>' +
      '<details class="card"><summary>What I couldn\'t verify</summary><ul>' + D.COULD_NOT_VERIFY.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></details>" + disclaimer();
  }
  function trackerHtml(id) {
    var st = fundState(id), cls = (st.status || "Not started").replace(/\s/g, "");
    return '<div class="tracker st-' + cls + '"><label class="field"><span>Status</span><select data-act="fundStatus" data-id="' + id + '">' + STATUSES.map(function (s) { return "<option" + (s === st.status ? " selected" : "") + ">" + s + "</option>"; }).join("") + '</select></label><label class="field"><span>Applied on</span><input type="date" data-act="fundField" data-f="applied" data-id="' + id + '" value="' + esc(st.applied) + '"></label><label class="field"><span>Decision on</span><input type="date" data-act="fundField" data-f="decided" data-id="' + id + '" value="' + esc(st.decided) + '"></label><label class="field"><span>Follow up on</span><input type="date" data-act="fundField" data-f="followUp" data-id="' + id + '" value="' + esc(st.followUp || "") + '"></label><label class="field wide"><span>Notes (no ID numbers)</span><textarea rows="2" data-act="fundField" data-f="notes" data-id="' + id + '">' + esc(st.notes) + "</textarea></label></div>";
  }
  function fundCard(f) {
    return '<article class="card fund"><div class="opt-top"><span class="chip lvl">' + esc(f.level) + "</span>" + (f.later ? '<span class="chip later">' + esc(f.later) + "</span>" : "") + "</div><h3>" + esc(f.name) + "</h3>" +
      "<p><b>Amount:</b> " + esc(f.amount) + "</p><p><b>Status:</b> " + esc(f.status) + "</p><p><b>Who qualifies:</b> " + esc(f.eligibility) + "</p><p><b>Deadline:</b> " + esc(f.deadline) + "</p>" + (f.notes ? '<p class="note">' + esc(f.notes) + "</p>" : "") +
      '<div class="row">' + (f.phone ? tel(f.phone) : "") + link("Official site ↗", f.url) + "</div>" + sourcesHtml(f.sources) + trackerHtml(f.id) + verifiedTag() + "</article>";
  }
  function customFundCard(f) { return '<article class="card fund"><div class="opt-top"><span class="chip">Your entry</span><button type="button" class="btn small danger" data-act="delFund" data-id="' + f.id + '">Delete</button></div><h3>' + esc(f.name) + "</h3>" + (f.url ? "<p>" + link("Website ↗", f.url) + "</p>" : "") + trackerHtml(f.id) + "</article>"; }

  /* ---------- deadlines ---------- */
  function allDeadlines() {
    var list = D.DEADLINES.map(function (d) { return { id: d.id, date: d.date, title: d.title, url: d.url, kind: d.kind, verified: true }; });
    state.deadlines.forEach(function (d) { list.push({ id: d.id, date: d.date, title: d.title, notes: d.notes, kind: "mine", own: true }); });
    state.funding.forEach(function (f) { if (f.followUp) { var fd = fundById(f.id); list.push({ id: "fu-" + f.id, date: f.followUp, title: "Follow up: " + (fd ? fd.name : f.name), kind: "mine" }); } });
    state.calls.forEach(function (c) { if (c.follow) list.push({ id: "cf-" + c.id, date: c.follow, title: "Call back: " + c.org, kind: "mine" }); });
    list.sort(function (a, b) { return a.date.localeCompare(b.date); });
    return list;
  }
  function viewDeadlines() {
    var t = todayStr(), list = allDeadlines(), up = list.filter(function (d) { return d.date >= t; }), past = list.filter(function (d) { return d.date < t; });
    var item = function (d) {
      var days = Math.round((new Date(d.date + "T00:00") - new Date(t + "T00:00")) / 864e5);
      return '<li class="dl-item ' + d.kind + '"><div class="dl-date"><b>' + esc(fmtDate(d.date)) + "</b>" + (days >= 0 ? "<small>" + (days === 0 ? "today" : "in " + days + " day" + (days === 1 ? "" : "s")) + "</small>" : "") + '</div><div class="dl-body">' + esc(d.title) + (d.notes ? "<br><small>" + esc(d.notes) + "</small>" : "") + '<div class="row">' + (d.verified ? '<span class="verified">✓ Verified</span>' + link("Source", d.url) : '<span class="chip">Your date</span>') + '<button type="button" class="btn small" data-act="ics" data-id="' + esc(d.id) + '">＋ Calendar</button>' + (d.own ? '<button type="button" class="btn small danger" data-act="delDeadline" data-id="' + d.id + '">Delete</button>' : "") + "</div></div></li>";
    };
    return '<div class="page-head"><p class="kicker">Verified dates only</p><h1>Deadlines</h1><p class="lead">Official dates appear only when a program has published them. Others are listed as "date TBA." Add your own dates below. Calls and funding follow-ups show up here automatically.</p></div>' +
      '<div class="card"><h2>Upcoming</h2>' + (up.length ? '<ul class="dl">' + up.map(item).join("") + "</ul>" : "<p>No upcoming dates.</p>") + "</div>" +
      '<div class="card"><h2>Dates not announced yet</h2><ul>' + D.TBA.map(function (x) { return "<li>" + esc(x.title) + " " + link("Source", x.url) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><h2>Add a date</h2><div class="grid2"><label class="field"><span>Date</span><input id="ddDate" type="date"></label><label class="field"><span>What</span><input id="ddTitle" maxlength="120" placeholder="e.g. Tour at Great Lakes Academy"></label></div><label class="field"><span>Notes</span><input id="ddNotes" maxlength="200"></label><button type="button" class="btn primary" data-act="addDeadline">＋ Add date</button></div>' +
      (past.length ? '<details class="card"><summary>Past dates (' + past.length + ')</summary><ul class="dl">' + past.map(item).join("") + "</ul></details>" : "") + disclaimer();
  }

  /* ---------- documents ---------- */
  function viewDocs() {
    var have = D.DOCS.filter(function (d) { var s = find("docs", d.id); return s && s.have; }).length;
    return '<div class="page-head"><p class="kicker">Gather once, use everywhere</p><h1>Document checklist</h1><p class="lead">Check off what you have and note where it\'s kept (for example, "blue folder" or "email from case manager"). Nothing is uploaded. <b>Don\'t type SSNs, student ID numbers or medical record numbers here.</b></p></div>' +
      '<div class="progress"><div style="width:' + Math.round(have / D.DOCS.length * 100) + '%"></div></div><p class="help">' + have + " of " + D.DOCS.length + " gathered</p>" +
      '<div class="card"><ul class="docs">' + D.DOCS.map(function (d) { var s = find("docs", d.id) || {}; return '<li><label class="docchk"><input type="checkbox" data-act="docHave" data-id="' + d.id + '"' + (s.have ? " checked" : "") + "><span><b>" + esc(d.name) + "</b><small>" + esc(d.why) + '</small></span></label><input class="where" data-act="docWhere" data-id="' + d.id + '" placeholder="Where it\'s kept" maxlength="80" value="' + esc(s.where || "") + '"></li>'; }).join("") + "</ul></div>" + disclaimer();
  }

  /* ---------- IEP & social ---------- */
  function viewIep() {
    return '<div class="page-head"><p class="kicker">Parent rights in Texas</p><h1>IEP & rights</h1><p class="lead">How each choice affects David\'s IEP, and who can help for free.</p></div>' +
      '<div class="card"><h2>What happens to his IEP if…</h2><div class="iep-table">' + D.IEP_CHANGES.map(function (c) { return '<div class="iep-row"><b>' + esc(c.move) + "</b><p>" + esc(c.effect) + (c.url ? " " + link("Source", c.url) : "") + "</p></div>"; }).join("") + "</div>" + verifiedTag() + "</div>" +
      '<div class="card"><h2>Asking for better supports at Frisco ISD</h2><ol><li>Write to his case manager and ask for an ARD meeting. Say what you see at home and school: behavior, attention, social moments.</li><li>Ask about a Functional Behavior Assessment (FBA) and a Behavior Intervention Plan (BIP) if behavior gets in the way of learning.</li><li>Ask for attention supports (breaks, a seat with fewer distractions, chunked assignments) and social-skills goals or counseling.</li><li>Ask for a GT referral if he shows gifted traits. Frisco ISD recognizes twice-exceptional (2E) students.</li><li>Bring the ' + link("Notice of Procedural Safeguards", "https://spedtex.tea.texas.gov/resources/notice-procedural-safeguards") + " and the " + link("ARD guide", "https://spedtex.tea.texas.gov/sites/spedtex.tea.texas.gov/files/2026-05/ARD%20Guide%202025%20-%20English%20-%20ACC.pdf") + ".</li></ol></div>" +
      '<div class="cards">' + D.SUPPORTS.map(function (s) { return '<article class="card"><h3>' + esc(s.name) + "</h3><p>" + esc(s.what) + '</p><div class="row">' + (s.phone ? tel(s.phone) : "") + link("Open ↗", s.url) + "</div></article>"; }).join("") + "</div>" + disclaimer();
  }
  function viewSocial() {
    return '<div class="page-head"><p class="kicker">Friends, groups and activities near Frisco</p><h1>Social & activities</h1><p class="lead">David sometimes needs support with social interaction. These local groups, co-ops and clubs offer structured social practice and a chance to make friends, whatever school path you choose.</p></div>' +
      '<div class="cards">' + D.SOCIAL.map(function (s) { return '<article class="card"><h3>' + esc(s.name) + '</h3><p class="meta">📍 ' + esc(s.where) + "</p><p>" + esc(s.what) + '</p><div class="row">' + (s.phone ? tel(s.phone) : "") + link("Official site ↗", s.url) + "</div>" + verifiedTag() + "</article>"; }).join("") + "</div>" +
      '<div class="card"><h2>Schools with social-skills teaching</h2><ul><li><a href="#/option/oakhill">Oak Hill Academy</a>: social skills are the cornerstone, with weekly sessions.</li><li><a href="#/option/shelton">Shelton School</a>: a social-skills program in every grade.</li><li><a href="#/option/sage">The Sage School of Dallas</a>: teachers trained for 2e, ADHD and autistic learners.</li><li><a href="#/option/fusion">Fusion Academy Plano</a>: Homework Café and clubs alongside 1-to-1 classes.</li></ul></div>' + disclaimer();
  }

  /* ---------- planner ---------- */
  function weekKey(off) { var d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + (off || 0) * 7); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  var weekOff = 0;
  function field(id, label, val, type) { return '<label class="field"><span>' + esc(label) + '</span><input id="' + id + '" data-act="letterField" type="' + (type || "text") + '" maxlength="120" value="' + esc(val || "") + '"></label>'; }
  function letterHtml(L) {
    var st = L.student || "[student name]", sc = L.school || "[school]", d = L.date ? fmtDate(L.date) : "[date]";
    return "<p>" + esc(new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })) + "</p><p>To: Principal and Registrar, " + esc(sc) + ", Frisco Independent School District</p>" +
      "<p>Re: Withdrawal of " + esc(st) + (L.grade ? ", grade " + esc(L.grade) : "") + "</p>" +
      "<p>Please accept this letter as notice that we are withdrawing " + esc(st) + " from " + esc(sc) + " effective " + esc(d) + ". " + esc(st) + " will be educated at home in a bona fide manner, using a written curriculum designed to meet basic education goals in reading, spelling, grammar, mathematics and good citizenship, as recognized by the Texas Supreme Court in <i>Leeper et al. v. Arlington ISD et al.</i>.</p>" +
      "<p>Please let me know if you need anything further to complete the withdrawal. I will also complete Frisco ISD's online withdrawal form.</p><p>Sincerely,</p><p>" + esc(L.parent || "[parent name]") + (L.addr ? "<br>" + esc(L.addr) : "") + "</p>";
  }
  function viewPlanner() {
    var L = getSet("letter", {}) || {}, tplKey = getSet("weekTpl", "hybrid23"), tpl = D.WEEK_TEMPLATES[tplKey] || D.WEEK_TEMPLATES.hybrid23, wk = "wk-" + weekKey(weekOff), note = find("planner", wk);
    var done = 0, total = 0;
    var grid = '<div class="cmp-wrap"><table class="plan"><thead><tr><th>Subject</th>' + tpl.days.map(function (d) { return "<th>" + d + "<br>" + (tpl.school.indexOf(d) !== -1 ? '<small class="chip">School</small>' : '<small class="chip home">Home</small>') + "</th>"; }).join("") + "</tr></thead><tbody>" +
      D.SUBJECTS.map(function (s) { return "<tr><th>" + esc(s) + "</th>" + tpl.days.map(function (d) { if (tpl.school.indexOf(d) !== -1) return '<td><span class="muted">school</span></td>'; total++; var c = getFlag(wk, s + "|" + d); if (c) done++; return '<td><input type="checkbox" data-act="planChk" data-w="' + wk + '" data-c="' + esc(s + "|" + d) + '"' + (c ? " checked" : "") + ' aria-label="' + esc(s + " " + d) + '"></td>'; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
    return '<div class="page-head"><p class="kicker">Homeschool basics</p><h1>Homeschool planner</h1><p class="lead">What Texas requires, a withdrawal letter, free curriculum, routines that help with attention and behavior, and a weekly checklist.</p></div>' +
      '<div class="card"><h2>What Texas requires</h2><ul><li>Teach in a bona fide (real) way using a written curriculum that covers <b>reading, spelling, grammar, math and good citizenship</b>. This comes from the Texas Supreme Court\'s Leeper v. Arlington ISD decision.</li><li>TEA doesn\'t regulate, monitor, approve, register or accredit homeschools.</li><li>You <b>must formally withdraw</b> him from Frisco ISD. Frisco ISD campuses use an online Withdrawal Form in the Parent Portal (the "Withdrawal Forms" tile). A district may ask in writing for a letter of assurance that he is being homeschooled.</li><li>Keep records of curriculum and progress. They help if he returns to public school, and they help with the district\'s services plan.</li><li>Before withdrawing, think about PDSES ($1,500): it\'s only for students enrolled in public school.</li></ul>' + sourcesHtml([{ label: "TEA: Home Schooling", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/home-schooling" }, { label: "Frisco ISD campus withdrawal steps", url: "https://sites.google.com/friscoisd.org/lebanontrailregistration/withdraw" }, { label: "THSC", url: "https://thsc.org/requirements-to-homeschool-in-texas/" }]) + "</div>" +
      '<div class="card"><h2>Withdrawal letter (letter of assurance)</h2><p class="help">Fill in the blanks. The letter is saved only on this device and in your private Sync. Don\'t add his student ID.</p><div class="grid2">' +
      field("lParent", "Parent name", L.parent) + field("lStudent", "Student name", L.student || "David") + field("lSchool", "School", L.school || "Pioneer Heritage Middle School") + field("lGrade", "Grade", L.grade) + field("lDate", "Withdrawal date", L.date, "date") + field("lAddr", "Your mailing address (optional)", L.addr) + "</div>" +
      '<button type="button" class="btn primary" data-act="printLetter">🖨 Print letter</button><div id="letterPreview" class="letter">' + letterHtml(L) + "</div></div>" +
      '<div class="card"><h2>Help with attention and behavior at home</h2><ul class="tips">' + D.ATTENTION_TIPS.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul><p class="help">These are general study tips, not medical advice. Ask his IEP team or therapist what already works for David, and use the same strategies at home.</p></div>' +
      '<div class="card"><h2>Free curriculum and help</h2><ul>' + D.CURRICULUM.map(function (c) { return "<li>" + link(c.name, c.url) + ": " + esc(c.what) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><div class="row between"><h2>Weekly checklist</h2><select data-act="weekTpl" aria-label="Week template">' + Object.keys(D.WEEK_TEMPLATES).map(function (k) { return '<option value="' + k + '"' + (k === tplKey ? " selected" : "") + ">" + esc(D.WEEK_TEMPLATES[k].label) + "</option>"; }).join("") + '</select></div><div class="row"><button type="button" class="btn small" data-act="weekPrev">← Prev</button><b>Week of ' + esc(fmtDate(weekKey(weekOff))) + '</b><button type="button" class="btn small" data-act="weekNext">Next →</button><span class="chip">' + done + " / " + total + " done</span></div>" + grid +
      '<label class="field"><span>Notes for this week</span><textarea rows="2" data-act="weekNote" data-w="' + wk + '">' + esc(note ? note.text : "") + "</textarea></label></div>" + disclaimer();
  }

  /* ---------- calls ---------- */
  var callPrefill = null;
  function viewCalls() {
    var list = state.calls.slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); }), pre = callPrefill; callPrefill = null;
    return '<div class="page-head"><p class="kicker">Keep track of every conversation</p><h1>Calls & contacts</h1><p class="lead">Log calls and emails with schools and programs: who you spoke to, what they said, and when to follow up. Follow-ups appear in Deadlines. Don\'t record SSNs or ID numbers.</p></div>' +
      '<div class="card"><h2>New entry</h2><div class="grid2"><label class="field"><span>Date</span><input id="cDate" type="date" value="' + todayStr() + '"></label><label class="field"><span>School / program</span><input id="cOrg" maxlength="100" value="' + esc(pre ? pre.org : "") + '"></label><label class="field"><span>Person</span><input id="cWho" maxlength="80"></label><label class="field"><span>Phone or email</span><input id="cPhone" maxlength="80" value="' + esc(pre ? pre.phone : "") + '"></label></div><label class="field"><span>What they said</span><textarea id="cSum" rows="3" maxlength="1500"></textarea></label><label class="field"><span>Follow up on</span><input id="cFollow" type="date"></label><button type="button" class="btn primary" data-act="addCall">Save entry</button></div>' +
      (list.length ? list.map(function (c) { return '<article class="card call"><div class="row between"><b>' + esc(fmtDate(c.date)) + " · " + esc(c.org) + '</b><button type="button" class="btn small danger" data-act="delCall" data-id="' + c.id + '">Delete</button></div>' + (c.who ? "<p>👤 " + esc(c.who) + "</p>" : "") + (c.phone ? "<p>☎ " + esc(c.phone) + "</p>" : "") + "<p>" + esc(c.summary).replace(/\n/g, "<br>") + "</p>" + (c.follow ? '<p class="chip">Follow up ' + esc(fmtDate(c.follow)) + "</p>" : "") + "</article>"; }).join("") : '<div class="card"><p class="muted">No calls logged yet.</p></div>');
  }

  function backupCard() { return '<div class="card"><h2>Backup</h2><p class="help">Export a backup file, or import one to merge it with what\'s here.</p><div class="row"><button type="button" class="btn" data-act="export">⬇ Export backup</button><label class="btn">⬆ Import backup<input type="file" class="importFile" accept="application/json,.json" hidden></label></div></div>'; }
  function viewMore() {
    return '<div class="page-head"><h1>More</h1></div><div class="more-grid">' + NAV.filter(function (n) { return ["home", "find", "funding", "compare"].indexOf(n.id) === -1; }).map(function (n) { return '<a class="card tile" href="#/' + n.id + '"><span class="tile-ico">' + n.ico + "</span><b>" + esc(n.label) + "</b></a>"; }).join("") + "</div>" + backupCard();
  }
  function viewAbout() {
    return '<div class="page-head"><h1>About & sources</h1></div><div class="card"><p>David School Options helps compare homeschool, hybrid, virtual public, private and public-school paths for David, plus the funding that can help, all from official sources.</p><ul><li>' + D.OPTIONS.length + " school and program options, " + D.FUNDING.length + " funding programs, " + D.SUPPORTS.length + " rights and support contacts, and " + D.SOCIAL.length + " social groups and activities.</li><li>Everything was checked on " + esc(fmtDate(D.VERIFIED)) + ". Each card links to its source.</li><li>Your notes, statuses and lists are saved only on this device unless you turn on <a href=\"#/sync\">Sync</a>, which keeps a private copy in your own GitHub account.</li><li>No SSN, student ID or medical record numbers are collected. Nothing is uploaded.</li><li>Works offline after the first visit.</li></ul></div>" +
      '<div class="card"><h2>Looked at but not included</h2><ul>' + D.NOT_INCLUDED.map(function (n) { return "<li><b>" + esc(n.name) + "</b>: " + esc(n.why) + " " + link("Source", n.url) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><h2>What I couldn\'t verify</h2><ul>' + D.COULD_NOT_VERIFY.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" + backupCard() + disclaimer() + '<p class="help">App version ' + esc(window.DSO_VERSION || "") + "</p>";
  }
  function viewSync() {
    var connected = !!S.getToken();
    return '<div class="page-head"><p class="kicker">PC · tablet · phone</p><h1>Sync</h1><p class="lead">Keep your saved options, funding statuses, documents checklist, deadlines, calls and planner the same on every device. Your data is saved in a private Gist ("David School Options Sync") in your own GitHub account.</p></div>' +
      '<div class="card"><h2>Status</h2><p id="syncStatusLine" class="muted"></p><p id="syncLastLine" class="help"></p><p id="syncTokenMask" class="help"></p><div id="syncConnectedActions" class="row"' + (connected ? "" : " hidden") + '><button type="button" class="btn primary" data-act="syncNow">⟳ Sync now</button><button type="button" class="btn danger" data-act="disconnect">Disconnect this device</button></div></div>' +
      '<div class="card" id="syncSetupCard"><h2>' + (connected ? "Use a different token" : "Connect this device") + "</h2><ol><li>Use the same GitHub sync key you use in Business SuccessHQ, or " + link("create a new one", "https://github.com/settings/tokens/new?scopes=gist&description=David%20School%20Options%20Sync") + " with only the <b>gist</b> box checked.</li><li>Paste it below and tap <b>Connect</b>.</li><li>Do the same on your PC, tablet and phone.</li></ol>" +
      '<label class="field"><span>GitHub access token</span><input id="syncTokenInput" type="password" autocomplete="off" spellcheck="false" placeholder="Paste your token here"></label><p id="syncConnectError" class="small bad"></p><button type="button" class="btn primary" data-act="connect">Connect</button>' +
      '<p class="help">The token stays on this device and is sent only to api.github.com. Never paste it into a chat or email.</p></div>' + backupCard();
  }

  var VIEWS = { home: viewHome, find: viewFind, results: viewResults, compare: viewCompare, saved: viewSaved, funding: viewFunding, deadlines: viewDeadlines, docs: viewDocs, iep: viewIep, social: viewSocial, planner: viewPlanner, calls: viewCalls, more: viewMore, about: viewAbout, sync: viewSync };
  function route() { var h = location.hash.replace(/^#\/?/, ""); var parts = h.split("/"); return { name: parts[0] || "home", arg: parts[1] }; }
  function rerender(keepScroll) {
    var r = route(), y = window.scrollY;
    $("#view").innerHTML = r.name === "option" ? viewOption(r.arg) : (VIEWS[r.name] || viewHome)();
    renderNav(r.name === "option" ? "results" : r.name);
    var nav = NAV.filter(function (n) { return n.id === r.name; })[0];
    document.title = (r.name === "home" ? "" : (nav ? nav.label : "Option") + " · ") + "David School Options";
    if (r.name === "sync") renderSyncStatus();
    renderSyncBadge();
    if (keepScroll) window.scrollTo(0, y);
  }
  window.addEventListener("hashchange", function () { closeRail(); rerender(); window.scrollTo(0, 0); });

  /* ---------- modal (edit profile) ---------- */
  function openModal(html) { var m = $("#modal"); m.innerHTML = '<div class="modal-box" role="dialog" aria-modal="true">' + html + "</div>"; m.hidden = false; }
  function closeModal() { var m = $("#modal"); m.hidden = true; m.innerHTML = ""; }
  function editProfile() {
    var p = profile();
    openModal('<h2>Edit David\'s profile</h2><p class="help">Plain words only. Don\'t enter IDs, SSNs or medical record numbers.</p><form id="profForm"><label class="field"><span>Name</span><input name="name" maxlength="40" value="' + esc(p.name) + '"></label><label class="field"><span>Age</span><input name="age" type="number" min="3" max="21" value="' + esc(p.age) + '"></label><label class="field"><span>Summary</span><textarea name="summary" rows="4" maxlength="400">' + esc(p.summary) + '</textarea></label><label class="field"><span>Current school</span><input name="school" maxlength="80" value="' + esc(p.school) + '"></label><div class="row between"><button type="button" class="btn" data-act="closeModal">Cancel</button><button class="btn primary" type="submit">Save</button></div></form>');
  }
  function onModalSubmit(e) {
    e.preventDefault(); var f = e.target; if (f.id !== "profForm") return;
    var vals = { name: f.name.value.trim(), age: f.age.value, summary: f.summary.value.trim(), school: f.school.value.trim() };
    if (Object.keys(vals).some(function (k) { return looksSensitive(vals[k]); })) { toast("That looks like an ID number. Please leave it out."); return; }
    var cur = getSet("profile", {}) || {}; Object.keys(vals).forEach(function (k) { cur[k] = vals[k]; });
    setSet("profile", cur); closeModal(); toast("Profile saved"); rerender(true);
  }

  /* ---------- events ---------- */
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function onClick(e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.dataset.act, id = b.dataset.id;
    if (b.tagName === "INPUT" || b.tagName === "SELECT" || b.tagName === "TEXTAREA") return;
    switch (act) {
      case "fav": e.preventDefault(); toggleFav(id); rerender(true); break;
      case "cmpRemove": removeItem("compare", id); rerender(true); break;
      case "wzNext": readWizardForm(); wzStep = Math.min(4, wzStep + 1); rerender(); window.scrollTo(0, 0); break;
      case "wzBack": readWizardForm(); wzStep = Math.max(0, wzStep - 1); rerender(); break;
      case "wzGo": readWizardForm(); wzStep = +b.dataset.i; rerender(); break;
      case "wzDone": readWizardForm(); wzStep = 0; location.hash = "#/results"; break;
      case "fundFilter": setSet("fundFilter", b.dataset.v); rerender(true); break;
      case "addFund": var n = val("cfName"), u = val("cfUrl"); if (!n) { toast("Type a program name"); return; } if (u && !/^https?:\/\//i.test(u)) u = "https://" + u; upsert("funding", { id: uid("cf"), custom: true, name: n, url: u, status: "Not started" }); toast("Added"); rerender(true); break;
      case "delFund": if (confirm("Delete this program?")) { removeItem("funding", id); rerender(true); } break;
      case "addDeadline": var dd = val("ddDate"), dt = val("ddTitle"); if (!dd || !dt) { toast("Add a date and what it's for"); return; } if (looksSensitive(dt + " " + val("ddNotes"))) { toast("Please leave ID numbers out"); return; } upsert("deadlines", { id: uid("dl"), date: dd, title: dt, notes: val("ddNotes") }); toast("Date added"); rerender(true); break;
      case "delDeadline": removeItem("deadlines", id); rerender(true); break;
      case "ics": var d = allDeadlines().filter(function (x) { return x.id === id; })[0]; if (d) downloadIcs(d); break;
      case "addCall":
        var c = { id: uid("call"), date: val("cDate"), org: val("cOrg"), who: val("cWho"), phone: val("cPhone"), summary: val("cSum"), follow: val("cFollow") };
        if (!c.org) { toast("Add the school or program"); return; }
        if (looksSensitive(c.summary + " " + c.who)) { toast("That looks like an ID number. Please leave it out."); return; }
        upsert("calls", c); toast("Saved"); rerender(true); break;
      case "delCall": if (confirm("Delete this entry?")) { removeItem("calls", id); rerender(true); } break;
      case "logCall": callPrefill = { org: b.dataset.org, phone: b.dataset.phone }; location.hash = "#/calls"; break;
      case "printLetter": document.body.classList.add("print-letter"); window.print(); setTimeout(function () { document.body.classList.remove("print-letter"); }, 500); break;
      case "print": window.print(); break;
      case "weekPrev": weekOff--; rerender(true); break;
      case "weekNext": weekOff++; rerender(true); break;
      case "editProfile": editProfile(); break;
      case "closeModal": closeModal(); break;
      case "export": exportData(); break;
      case "connect": connectSync(); break;
      case "disconnect": disconnectSync(); break;
      case "syncNow": runSync("manual"); break;
    }
  }
  var fieldTimers = {};
  function debounce(key, fn) { clearTimeout(fieldTimers[key]); fieldTimers[key] = setTimeout(fn, 500); }
  function fundPatch(id, patch) { var s = fundState(id); Object.keys(patch).forEach(function (k) { s[k] = patch[k]; }); var fd = fundById(id); if (fd && !s.name) s.name = fd.name; upsert("funding", s); }
  function onChange(e) {
    var t = e.target, act = t.dataset.act;
    if (t.classList.contains("importFile")) { importFile(t); return; }
    if (!act) return;
    if (act === "cmp") { toggleCompare(t.dataset.id); rerender(true); }
    else if (act === "fundStatus") { var p = { status: t.value }; if (t.value === "Applied" && !fundState(t.dataset.id).applied) p.applied = todayStr(); if ((t.value === "Approved" || t.value === "Denied") && !fundState(t.dataset.id).decided) p.decided = todayStr(); fundPatch(t.dataset.id, p); toast("Status: " + t.value); rerender(true); }
    else if (act === "fundField" && t.type === "date") { var q = {}; q[t.dataset.f] = t.value; fundPatch(t.dataset.id, q); }
    else if (act === "planChk") { setFlag(t.dataset.w, t.dataset.c, t.checked); rerender(true); }
    else if (act === "docHave") { var cur = find("docs", t.dataset.id) || { id: t.dataset.id }; cur = JSON.parse(JSON.stringify(cur)); cur.have = t.checked; upsert("docs", cur); rerender(true); }
    else if (act === "weekTpl") { setSet("weekTpl", t.value); rerender(true); }
  }
  function onInput(e) {
    var t = e.target, act = t.dataset.act; if (!act) return;
    if (act === "fundField" && t.type !== "date") { if (looksSensitive(t.value)) { toast("Please leave ID numbers out"); return; } debounce("ff" + t.dataset.id + t.dataset.f, function () { var q = {}; q[t.dataset.f] = t.value; fundPatch(t.dataset.id, q); }); }
    else if (act === "docWhere") { if (looksSensitive(t.value)) { toast("Please leave ID numbers out"); return; } debounce("dw" + t.dataset.id, function () { var cur = JSON.parse(JSON.stringify(find("docs", t.dataset.id) || { id: t.dataset.id })); cur.where = t.value; upsert("docs", cur); }); }
    else if (act === "weekNote") { debounce("wn" + t.dataset.w, function () { upsert("planner", { id: t.dataset.w, text: t.value }); }); }
    else if (act === "letterField") {
      var map = { lParent: "parent", lStudent: "student", lSchool: "school", lGrade: "grade", lDate: "date", lAddr: "addr" };
      var L = JSON.parse(JSON.stringify(getSet("letter", {}) || {}));
      Object.keys(map).forEach(function (k) { var el = document.getElementById(k); if (el) L[map[k]] = el.value; });
      if (looksSensitive(L.parent + L.student + L.addr)) { toast("Please leave ID numbers out"); return; }
      var pv = $("#letterPreview"); if (pv) pv.innerHTML = letterHtml(L);
      debounce("letter", function () { setSet("letter", L); });
    }
  }

  function icsEsc(s) { return String(s).replace(/[\\;,]/g, function (c) { return "\\" + c; }).replace(/\n/g, "\\n"); }
  function downloadIcs(d) {
    var ds = d.date.replace(/-/g, ""), nd = new Date(d.date + "T00:00"); nd.setDate(nd.getDate() + 1);
    var de = nd.getFullYear() + String(nd.getMonth() + 1).padStart(2, "0") + String(nd.getDate()).padStart(2, "0");
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//David School Options//EN", "BEGIN:VEVENT", "UID:" + d.id + "@david-school-options", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z", "DTSTART;VALUE=DATE:" + ds, "DTEND;VALUE=DATE:" + de, "SUMMARY:" + icsEsc(d.title), d.url ? "URL:" + d.url : "", "END:VEVENT", "END:VCALENDAR"].filter(Boolean).join("\r\n");
    saveFile(ics, "text/calendar", d.id + ".ics");
  }
  function saveFile(text, type, name) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
  function exportData() { saveFile(JSON.stringify(S.syncPayload(state), null, 2), "application/json", "david-school-options-backup-" + todayStr() + ".json"); toast("Backup downloaded"); }
  function importFile(input) {
    var f = input.files && input.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try { var data = S.parsePayload(r.result); if (!data) throw new Error("x"); applyMerged(S.mergeStates(state, data)); save(); toast("Backup imported and merged"); rerender(); }
      catch (err) { toast("That file isn't a David School Options backup"); }
      input.value = "";
    };
    r.readAsText(f);
  }

  /* ---------- sync ---------- */
  var syncing = false, syncStatus = "idle", syncError = "", dirty = false, pushTimer = null, pullTimer = null;
  function schedulePush() { if (!S.getToken()) return; dirty = true; renderSyncBadge(); clearTimeout(pushTimer); pushTimer = setTimeout(function () { runSync("auto"); }, 2500); }
  function schedulePull(reason) { if (!S.getToken()) return; clearTimeout(pullTimer); pullTimer = setTimeout(function () { runSync(reason || "focus"); }, 400); }
  function applyMerged(m) {
    S.LIST_KEYS.forEach(function (k) { state[k] = m[k] || []; });
    S.FLAG_KEYS.forEach(function (k) { state[k] = m[k] || {}; });
    state.settings = m.settings || {}; state.settingsTimes = m.settingsTimes || {};
    state.tombstones = m.tombstones || S.emptyTombs(); state.version = 1; applyTheme();
  }
  function isTyping() { var a = document.activeElement; return a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT") && a.type !== "checkbox" && a.type !== "radio"; }
  function runSync(reason) {
    var token = S.getToken(); if (!token) return Promise.resolve();
    if (navigator.onLine === false) { syncStatus = "offline"; dirty = true; renderSyncStatus(); return Promise.resolve(); }
    if (syncing) { dirty = true; return Promise.resolve(); }
    syncing = true; syncStatus = reason === "connect" ? "connecting" : "syncing"; syncError = ""; renderSyncStatus();
    var before = JSON.stringify(S.syncPayload(state).data);
    return Promise.resolve().then(function () {
      var id = S.getGistId(); if (!id) return null;
      return S.getGist(token, id).then(function (g) { return { remote: S.readGistData(g) }; }).catch(function () { S.setGistId(""); return null; });
    }).then(function (found) {
      if (found) return found;
      return S.findExistingGist(token).then(function (g) { if (!g) return null; S.setGistId(g.id); return S.getGist(token, g.id).then(function (gg) { return { remote: S.readGistData(gg) }; }); });
    }).then(function (found) {
      if (found && found.remote) { applyMerged(S.mergeStates(state, found.remote)); persist(); }
      dirty = false;
      var content = JSON.stringify(S.syncPayload(state), null, 2);
      if (!S.getGistId()) return S.createGist(token, content).then(function (c) { if (c && c.id) S.setGistId(c.id); });
      return S.patchGist(token, S.getGistId(), content);
    }).then(function () {
      S.setLastSync(nowISO()); syncStatus = "synced";
      if (JSON.stringify(S.syncPayload(state).data) !== before && !isTyping()) rerender(true);
    }, function (err) { syncStatus = "error"; syncError = err && err.message ? String(err.message) : "Sync couldn't be completed."; })
      .then(function () { syncing = false; renderSyncStatus(); if (dirty && S.getToken() && navigator.onLine) schedulePush(); });
  }
  function connectSync() {
    var input = document.getElementById("syncTokenInput"), err = document.getElementById("syncConnectError");
    var token = input ? input.value.trim() : ""; if (err) err.textContent = "";
    if (!token) { err.textContent = "Paste your GitHub access token first."; return; }
    if (/\s/.test(token)) { err.textContent = "The token shouldn't contain spaces. Copy it again from GitHub."; return; }
    S.setToken(token); input.value = ""; syncStatus = "connecting";
    runSync("connect").then(function () {
      if (syncStatus === "error") { if (syncError.indexOf("not accepted") !== -1) S.clearToken(); var e2 = document.getElementById("syncConnectError"); if (e2) e2.textContent = syncError; renderSyncStatus(); }
      else { toast("Sync connected"); rerender(); }
    });
  }
  function disconnectSync() {
    if (!confirm("Disconnect Sync on this device? Your data stays here, and the private Gist stays in your GitHub account.")) return;
    clearTimeout(pushTimer); clearTimeout(pullTimer); S.clearToken(); S.setLastSync(""); syncing = false; syncStatus = "idle"; syncError = "";
    toast("Sync disconnected"); rerender();
  }
  function syncStatusText() {
    if (!S.getToken()) return "Not connected";
    if (syncStatus === "offline" || navigator.onLine === false) return "Offline. Changes will sync when you're back online.";
    if (syncStatus === "connecting") return "Connecting…";
    if (syncStatus === "syncing") return "Syncing…";
    if (syncStatus === "error") return "Sync needs attention";
    if (dirty) return "Changes waiting to sync";
    return "Connected";
  }
  function renderSyncBadge() { var b = document.getElementById("syncBadge"); if (!b) return; if (!S.getToken()) { b.hidden = true; return; } b.hidden = false; b.textContent = "⟳ " + (syncStatus === "error" ? "!" : syncing ? "…" : "✓"); b.title = syncStatusText(); }
  function renderSyncStatus() {
    renderSyncBadge();
    var line = document.getElementById("syncStatusLine"); if (!line) return;
    var connected = !!S.getToken(), last = S.getLastSync();
    line.textContent = syncStatusText() + (syncStatus === "error" && syncError ? ": " + syncError : "");
    document.getElementById("syncLastLine").textContent = connected && last ? "Last synced " + fmtStamp(last) : "";
    document.getElementById("syncTokenMask").textContent = connected ? "Token on this device: " + S.maskToken(S.getToken()) : "";
    document.getElementById("syncConnectedActions").hidden = !connected;
    var setup = document.getElementById("syncSetupCard"); if (setup) setup.querySelector("h2").textContent = connected ? "Use a different token" : "Connect this device";
  }

  /* ---------- boot ---------- */
  function closeRail() { document.body.classList.remove("rail-open"); }
  applyTheme();
  $("#themeBtn").addEventListener("click", function () { setSet("theme", document.documentElement.dataset.theme === "dark" ? "light" : "dark"); applyTheme(); });
  $("#menuBtn").addEventListener("click", function () { document.body.classList.toggle("rail-open"); });
  $("#railBackdrop").addEventListener("click", closeRail);
  $("#syncBadge").addEventListener("click", function () { location.hash = "#/sync"; });
  var viewEl = $("#view");
  viewEl.addEventListener("click", onClick); viewEl.addEventListener("change", onChange); viewEl.addEventListener("input", onInput);
  var modalEl = $("#modal");
  modalEl.addEventListener("submit", onModalSubmit);
  modalEl.addEventListener("click", function (e) { if (e.target === modalEl) closeModal(); else onClick(e); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modalEl.hidden) closeModal(); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") schedulePull("focus"); });
  window.addEventListener("focus", function () { schedulePull("focus"); });
  window.addEventListener("online", function () { if (S.getToken()) runSync("online"); });
  if (!location.hash) location.hash = "#/home"; else rerender();
  if (S.getToken()) runSync("open");
  window.DSO_APP = { state: function () { return state; }, matchAll: function () { return matchAll(wz()); } };
})();
