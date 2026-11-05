/* =========================================================================
   Team mission – shared logic (no DOM). Used by the team table and the
   phones (team-mission.html) and by the app, which reads the completion code.
   -------------------------------------------------------------------------
   Dealing:  card c (1-based) in round r (0-based) goes to person
             ((c - 1 + r) mod n) + 1. Neighbouring cards therefore always
             sit with two different people for n ≥ 2, and the deal moves on
             by one person every round.
   Seat link: team-mission.html?s=<token>; the token encodes group size and
             person plus a checksum, so a typo or an edited link is rejected.
   Completion code: 8 characters (e.g. 4K9P-Q2XM) that carry the group
             size, every answer, the decisions and the duration, plus a
             16-bit checksum. No server needed – each team types the code
             into its own app.
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, T = App.team = {};
  var ALPHA = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";   // Crockford base32: no I, L, O, U
  var SALT = "imoah-team-v1";

  function h32(s) {   // FNV-1a
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }
  function toBase32(value, len) {
    var out = "";
    for (var i = 0; i < len; i++) { out = ALPHA.charAt(value % 32) + out; value = Math.floor(value / 32); }
    return out;
  }
  function fromBase32(str) {
    var v = 0;
    for (var i = 0; i < str.length; i++) {
      var d = ALPHA.indexOf(str.charAt(i));
      if (d < 0) return null;
      v = v * 32 + d;
    }
    return v;
  }
  function clean(str) {
    return String(str || "").toUpperCase().replace(/[^0-9A-Z]/g, "").replace(/O/g, "0").replace(/[IL]/g, "1");
  }

  T.rounds = C.team.rounds;
  T.cardCount = function (r) { return T.rounds[r].cards.length; };

  /* ---------- dealing ---------- */
  T.owner = function (card, round, n) { return ((card - 1 + round) % n) + 1; };
  T.cardsFor = function (person, round, n) {
    var out = [];
    for (var c = 1; c <= T.cardCount(round); c++) if (T.owner(c, round, n) === person) out.push(c);
    return out;
  };

  /* ---------- seat tokens (4 characters) ---------- */
  T.seatToken = function (n, p) {
    var v = n * 8 + p;
    return toBase32(v * 16384 + (h32(SALT + ":seat:" + v) & 0x3FFF), 4);
  };
  T.parseSeat = function (tok) {
    var s = clean(tok);
    if (s.length !== 4) return null;
    var all = fromBase32(s); if (all == null) return null;
    var v = Math.floor(all / 16384), chk = all % 16384;
    if ((h32(SALT + ":seat:" + v) & 0x3FFF) !== chk) return null;
    var n = Math.floor(v / 8), p = v % 8;
    if (n < C.team.minPlayers || n > C.team.maxPlayers || p < 1 || p > n) return null;
    return { n: n, p: p };
  };

  /* ---------- completion code ----------
     result = { n, minutes, rounds: [{ q: [0/1 per question], d: 0|1|2 }] } */
  function payloadBits() {
    return 3 + T.rounds.reduce(function (s, r) { return s + r.questions.length + 2; }, 0) + 6;
  }
  T.codeLength = function () { return Math.ceil((payloadBits() + 16) / 5); };

  T.encode = function (res) {
    var v = res.n - 2;
    T.rounds.forEach(function (r, ri) {
      var rr = res.rounds[ri] || { q: [], d: 0 };
      r.questions.forEach(function (q, qi) { v = v * 2 + (rr.q[qi] ? 1 : 0); });
      v = v * 4 + Math.max(0, Math.min(2, rr.d || 0));
    });
    v = v * 64 + Math.max(0, Math.min(63, Math.round(res.minutes || 0)));
    var all = v * 65536 + (h32(SALT + ":" + v) & 0xFFFF);
    var s = toBase32(all, T.codeLength());
    return s.slice(0, 4) + "-" + s.slice(4);
  };

  T.decode = function (code) {
    var s = clean(code);
    if (s.length !== T.codeLength()) return null;
    var all = fromBase32(s); if (all == null) return null;
    var v = Math.floor(all / 65536), chk = all % 65536;
    if ((h32(SALT + ":" + v) & 0xFFFF) !== chk) return null;
    var res = { minutes: v % 64, rounds: [] };
    v = Math.floor(v / 64);
    for (var ri = T.rounds.length - 1; ri >= 0; ri--) {
      var d = v % 4; v = Math.floor(v / 4);
      if (d > 2) return null;
      var q = [];
      for (var qi = T.rounds[ri].questions.length - 1; qi >= 0; qi--) { q.unshift(v % 2); v = Math.floor(v / 2); }
      res.rounds.unshift({ q: q, d: d });
    }
    res.n = v + 2;
    if (res.n < C.team.minPlayers || res.n > C.team.maxPlayers) return null;
    res.code = s.slice(0, 4) + "-" + s.slice(4);
    return res;
  };

  /* ---------- scoring ---------- */
  T.decisionQuality = function (round, act) {
    var d = T.rounds[round].decision;
    return act === d.best ? 2 : ((d.accept || []).indexOf(act) > -1 ? 1 : 0);
  };
  T.roundScore = function (rr) { return rr.q.reduce(function (s, x) { return s + x; }, 0) + rr.d; };
  T.maxRound = function (ri) { return T.rounds[ri].questions.length + 2; };
  T.maxScore = function () { return T.rounds.reduce(function (s, r, ri) { return s + T.maxRound(ri); }, 0); };
  T.summary = function (res) {
    var q = 0, d = 0;
    res.rounds.forEach(function (rr) { q += rr.q.reduce(function (s, x) { return s + x; }, 0); d += rr.d; });
    return { score: q + d, questions: q, decisions: d };
  };
})(window.App);
