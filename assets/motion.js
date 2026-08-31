(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  if (!reduce) {
    const glow = document.querySelector(".glow");
    if (glow) {
      let x = window.innerWidth * 0.5;
      let y = window.innerHeight * 0.2;
      let tx = x;
      let ty = y;
      let raf = 0;

      const tick = () => {
        x += (tx - x) * 0.16;
        y += (ty - y) * 0.16;
        root.style.setProperty("--glow-x", `${x}px`);
        root.style.setProperty("--glow-y", `${y}px`);
        raf = 0;
      };

      window.addEventListener(
        "pointermove",
        (e) => {
          tx = e.clientX;
          ty = e.clientY;
          if (!raf) raf = requestAnimationFrame(tick);
        },
        { passive: true }
      );
    }
  }

  const nativeViewTimeline =
    CSS.supports("animation-timeline", "view()") ||
    CSS.supports("(animation-timeline: view())");
  if (!nativeViewTimeline && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    window.observeReveals = (nodes) => {
      nodes.forEach((el) => io.observe(el));
    };
  }

  const nativeScrollTimeline =
    CSS.supports("animation-timeline", "scroll()") ||
    CSS.supports("(animation-timeline: scroll())");
  const bar = document.querySelector(".scroll-progress");
  if (bar && !nativeScrollTimeline && !reduce) {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
