// The sticky text column carries a caption naming whichever group of images
// is currently passing the reading line. Groups are ordered by where they
// actually sit on screen, not by source order, so grid layout can't confuse it.
// The text box scrolls up until its last line has come into view, then locks and
// rides down the page. Where it locks depends on its height: a box that fits the
// window settles 32px from the top; a taller one locks as soon as its bottom edge
// reaches the foot of the window, so its head runs off above rather than hiding
// the end of the paragraph. A sticky box can only be held a fixed distance from
// the top of the window, so that distance is measured here and kept up to date.
(function () {
  var box = document.querySelector(".p-text-in");
  if (!box) return;
  function place() {
    if (!matchMedia("(min-width: 901px)").matches) { box.style.top = ""; return; }
    box.style.top = "";
    var gap = 32;
    var top = window.innerHeight - box.offsetHeight - gap;
    box.style.top = Math.min(gap, top) + "px";
  }
  addEventListener("resize", place);
  addEventListener("load", place);
  place();
})();

(function () {
  var cap = document.getElementById("scroll-cap");
  if (!cap) return;
  var marks = [].slice.call(document.querySelectorAll("[data-cap]"));
  if (!marks.length) { cap.remove(); return; }
  var last = null, ticking = false;
  function pick() {
    ticking = false;
    var line = window.innerHeight * 0.45;
    // at the foot of the page the last group may never reach the line, so name it anyway
    var atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (atEnd) line = Infinity;
    var best = null, bestTop = -Infinity;
    for (var i = 0; i < marks.length; i++) {
      var top = marks[i].getBoundingClientRect().top;
      if (top <= line && top > bestTop) { bestTop = top; best = marks[i]; }
    }
    var found = best ? best.getAttribute("data-cap") : "";
    if (found === last) return;
    last = found;
    cap.textContent = found ? "/ " + found : "";
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(pick); } }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  addEventListener("load", pick);
  pick();
})();
