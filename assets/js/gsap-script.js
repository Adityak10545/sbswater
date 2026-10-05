// ===================== Register GSAP Plugins =====================
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollSmoother);

// ===================== Rolling Text Hover =====================
document.querySelectorAll(".rolling-text").forEach((el) => {
  const text = el.dataset.text || el.textContent.trim();
  el.innerHTML = "";

  const wrapper = document.createElement("span");
  wrapper.className = "text-wrapper";

  ["line1", "line2"].forEach(() => {
    const span = document.createElement("span");
    span.className = "text-line";
    span.textContent = text;
    wrapper.appendChild(span);
  });

  el.appendChild(wrapper);

  el.addEventListener("mouseenter", () => {
    gsap.to(wrapper, { yPercent: -50, duration: 0.4, ease: "power2.out" });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(wrapper, { yPercent: 0, duration: 0.4, ease: "power2.out" });
  });
});

// ===================== Split Text Lines Scroll Animation =====================
$(function () {
  const splitTextLines = gsap.utils.toArray(".splittext-line");
  splitTextLines.forEach((splitTextLine) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: splitTextLine,
        start: "top 90%",
        duration: 2,
        end: "bottom 60%",
        scrub: false,
        markers: false,
        toggleActions: "play none none none",
      },
    });

    const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
    gsap.set(splitTextLine, { perspective: 400 });
    itemSplitted.split({ type: "lines" });

    tl.from(itemSplitted.lines, {
      duration: 1,
      delay: 0.5,
      opacity: 0,
      rotationX: -80,
      force3D: true,
      transformOrigin: "top center -50",
      stagger: 0.1,
    });
  });
});

// ===================== Poort Text Animations =====================
window.addEventListener("load", () => {
  const st = document.querySelectorAll(".poort-text");
  if (st.length === 0) return;

  st.forEach((el) => {
    el.split = new SplitText(el, { type: "lines,words,chars", linesClass: "poort-line" });
    gsap.set(el, { perspective: 600 });

    if (el.classList.contains("poort-in-right")) gsap.set(el.split.chars, { opacity: 0, x: 100 });
    if (el.classList.contains("poort-in-left")) gsap.set(el.split.chars, { opacity: 0, x: -100 });
    if (el.classList.contains("poort-in-up")) gsap.set(el.split.chars, { opacity: 0, y: 80 });
    if (el.classList.contains("poort-in-down")) gsap.set(el.split.chars, { opacity: 0, y: -80 });

    gsap.to(el.split.chars, {
      scrollTrigger: { trigger: el, start: "top 90%" },
      x: 0,
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.02,
      ease: "power2.out",
    });
  });
});

// ===================== Image Scroll Animation =====================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".new_img-animet").forEach((el) => {
    const image = el.querySelector("img");
    if (!image) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 50%",
        toggleActions: "play none none none",
      },
    })
      .set(el, { autoAlpha: 1 })
      .from(el, { xPercent: -100, duration: 2, ease: "power2.out" })
      .from(image, { xPercent: 100, duration: 2, ease: "power2.out" }, "<");
  });
});


// ===================== Horizontal Team Scroll =====================



function initTeamScroll() {
  const teamSection = document.querySelector(".wpo-team-section");
  const container = document.querySelector(".team-container");

  if (!teamSection || !container) return;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === teamSection) {
      trigger.kill();
    }
  });

  gsap.killTweensOf(container);

  if (window.innerWidth > 991) {

    const totalScroll =
      container.scrollWidth - container.parentElement.offsetWidth;

    gsap.set(container, { x: 0 });

    gsap.to(container, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: teamSection,
        start: "top top",
        end: () => "+=" + totalScroll,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

  } else {
    gsap.set(container, { clearProps: "all" });
  }

  ScrollTrigger.refresh();
}

window.addEventListener("load", initTeamScroll);
window.addEventListener("resize", initTeamScroll);


