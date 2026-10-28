(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  // Stagger siblings, then reveal on scroll
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    var siblings = el.parentElement.querySelectorAll(":scope > .reveal");
    el.style.setProperty("--d", Array.prototype.indexOf.call(siblings, el) * 0.09 + "s");
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      var bar = e.target.querySelector(".bar i");
      if (bar) bar.style.width = e.target.dataset.level + "%";
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // Nav state, scroll progress
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 30);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active nav link
  var links = document.querySelectorAll(".nav nav a");
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });

  // Subtle photo tilt (desktop only)
  var tilt = document.getElementById("tilt");
  if (!reduce && tilt && window.matchMedia("(hover: hover)").matches) {
    var wrap = tilt.parentElement;
    wrap.addEventListener("mousemove", function (e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = "perspective(900px) rotateY(" + x * 10 + "deg) rotateX(" + -y * 10 + "deg)";
    });
    wrap.addEventListener("mouseleave", function () { tilt.style.transform = ""; });
  }
})();
