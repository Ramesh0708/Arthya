(() => {
  const MotionAPI = window.Motion;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!MotionAPI || !gsap || !ScrollTrigger) {
    document.documentElement.classList.remove("js-motion");
    return;
  }

  const { animate, hover, press } = MotionAPI;
  gsap.registerPlugin(ScrollTrigger);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  function bindGlow() {
    if (!document.querySelector(".glow")) return;

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

  function gsapIntro() {
    const header = document.querySelector(".site-header");
    const heroBits = gsap.utils.toArray(".hero-copy > *");
    const visual = document.querySelector(".hero-visual");
    const title = document.querySelector(".page-title");
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (header) {
      gsap.set(header, { opacity: 0, y: -16 });
      intro.to(header, { opacity: 1, y: 0, duration: 0.55 }, 0);
    }

    if (heroBits.length) {
      gsap.set(heroBits, { opacity: 0, y: 22 });
      intro.to(heroBits, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.08);
    }

    if (visual) {
      gsap.set(visual, { opacity: 0, y: 28, scale: 0.94 });
      intro.to(visual, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0.18);
      intro.to(
        visual,
        { y: -12, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" },
        ">-0.2"
      );
    }

    if (title) {
      gsap.set(title, { opacity: 0, y: 18 });
      intro.to(title, { opacity: 1, y: 0, duration: 0.65 }, 0.05);
    }
  }

  function revealNodes(nodes) {
    nodes.forEach((el) => {
      if (!el || el.dataset.gsapBound) return;
      el.dataset.gsapBound = "1";
      gsap.fromTo(
        el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    });
  }

  function gsapScroll() {
    const bar = document.querySelector(".scroll-progress");
    if (bar) {
      gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "max",
          scrub: 0.25,
        },
      });
    }

    revealNodes(gsap.utils.toArray(".reveal"));
  }

  function springLift(el) {
    if (!el || el.dataset.motionHover) return;
    el.dataset.motionHover = "1";
    hover(el, (node) => {
      animate(node, { y: -8, scale: 1.02 }, { type: "spring", stiffness: 380, damping: 22 });
      return () => animate(node, { y: 0, scale: 1 }, { type: "spring", stiffness: 320, damping: 26 });
    });
  }

  function motionUi(scope = document) {
    scope
      .querySelectorAll(".card, .blog-card, .signup-card, .founder-box, .article-card")
      .forEach(springLift);

    const mark = scope.querySelector(".brand img");
    if (mark && !mark.dataset.motionHover) {
      mark.dataset.motionHover = "1";
      hover(mark, (el) => {
        animate(el, { scale: 1.1, rotate: 8 }, { type: "spring", stiffness: 280, damping: 16 });
        return () => animate(el, { scale: 1, rotate: 0 }, { type: "spring", stiffness: 280, damping: 18 });
      });
    }

    const logo = scope.querySelector(".logo-mark");
    if (logo && !logo.dataset.motionHover) {
      logo.dataset.motionHover = "1";
      hover(logo, (el) => {
        animate(el, { scale: 1.05, rotate: -3 }, { type: "spring", stiffness: 220, damping: 16 });
        return () => animate(el, { scale: 1, rotate: 0 }, { type: "spring", stiffness: 240, damping: 18 });
      });
    }

    scope.querySelectorAll(".btn, button[type='submit']").forEach((btn) => {
      if (btn.dataset.motionHover) return;
      btn.dataset.motionHover = "1";
      hover(btn, (el) => {
        animate(el, { y: -2 }, { duration: 0.18 });
        return () => animate(el, { y: 0 }, { duration: 0.18 });
      });
      press(btn, (el) => {
        animate(el, { scale: 0.97 }, { type: "spring", stiffness: 500, damping: 22 });
        return () => animate(el, { scale: 1 }, { type: "spring", stiffness: 420, damping: 24 });
      });
    });
  }

  if (!reduce) {
    bindGlow();
    gsapIntro();
    gsapScroll();
    motionUi();
  }

  window.observeReveals = (nodes) => {
    if (reduce) return;
    const list = [...nodes];
    revealNodes(list);
    list.forEach(springLift);
  };
})();
