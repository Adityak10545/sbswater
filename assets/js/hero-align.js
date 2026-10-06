/*------------------------------------------
    = HERO SLIDE ALIGNMENT (index.html)
    The hero slides cross-fade on top of each other, so the heading,
    description and buttons must sit at the same height on every slide.
    Each block gets the min-height of the tallest matching block across
    slides; re-measured on resize and once web fonts have loaded.
-------------------------------------------*/
(function () {
    "use strict";

    var hero = document.querySelector(".hero-sbs");
    if (!hero) return;

    var BLOCKS = [".hero-eyebrow", ".hero-title", ".hero-sub"];

    function align() {
        BLOCKS.forEach(function (selector) {
            var els = hero.querySelectorAll(".swiper-slide " + selector);
            var tallest = 0;

            Array.prototype.forEach.call(els, function (el) {
                el.style.minHeight = "";
                tallest = Math.max(tallest, el.offsetHeight);
            });
            Array.prototype.forEach.call(els, function (el) {
                el.style.minHeight = tallest + "px";
            });
        });
    }

    var timer;
    function alignSoon() {
        clearTimeout(timer);
        timer = setTimeout(align, 100);
    }

    align();
    window.addEventListener("load", align);
    window.addEventListener("resize", alignSoon);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(align);
    }
})();
