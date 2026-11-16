// Reads a shared trip from the part of the link after "#". That part is never sent to any
// server, so the trip only exists in this browser. Format: see README.md ("Share link format").
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var MAX = { n: 100, a: 200, by: 40, note: 140 };

  function bad() {
    $("who").textContent = "Hmm.";
    $("place").textContent = "That link didn't work";
    $("when").textContent = "";
    $("bad").classList.remove("hidden");
  }

  function read() {
    var hash = window.location.hash.replace(/^#/, "");
    if (!hash) return null;
    var p;
    try { p = new URLSearchParams(hash); } catch (e) { return false; }
    if (p.get("v") !== "1") return false;
    var t = {
      n: (p.get("n") || "").trim(),
      by: (p.get("by") || "").trim(),
      note: (p.get("note") || "").trim(),
      at: p.get("at") || "",
      tz: p.get("tz") || "",
      lat: parseFloat(p.get("lat")),
      lon: parseFloat(p.get("lon"))
    };
    if (!t.n || t.n.length > MAX.n || t.by.length > MAX.by || t.note.length > MAX.note) return false;
    if ((p.get("a") || "").length > MAX.a) return false;
    if (!(t.lat >= -90 && t.lat <= 90 && t.lon >= -180 && t.lon <= 180)) return false;
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/.test(t.at)) return false;
    t.date = new Date(t.at);
    if (isNaN(t.date.getTime())) return false;
    try { new Intl.DateTimeFormat("en-GB", { timeZone: t.tz }); } catch (e) { t.tz = undefined; }
    if (!t.tz) t.tz = undefined;
    return t;
  }

  function show(t) {
    var day = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: t.tz }).format(t.date);
    var time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: t.tz }).format(t.date);
    $("who").textContent = (t.by ? t.by : "Someone") + " shared a trip";
    $("place").textContent = t.n;
    $("when").textContent = day + ", arrive " + time;
    if (t.note) { $("note").textContent = "“" + t.note + "”"; $("note").classList.remove("hidden"); }
    if (t.date.getTime() < Date.now()) $("past").classList.remove("hidden");
    document.title = (t.by ? t.by + " shared a trip" : "A shared trip") + " · Righto";
  }

  var t = read();
  if (t === false) bad();
  else if (t) show(t);
})();
