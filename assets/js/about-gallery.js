/*------------------------------------------
    = ABOUT PAGE GALLERY (about.html)
    - Large stage photo with caption, prev/next and auto-advance
    - Thumbnail strip scrolls continuously; the list is cloned once so
      the CSS loop is seamless (the copy is hidden from screen readers)
    - Both only run while the gallery is on screen, so it starts at photo 1
      when the visitor reaches it; hovering or focusing it pauses both

    PHOTOS: assets/images/about/gallery/gallery-NN.jpg (stage) and
    gallery-NN-thumb.jpg (400x300 strip thumbnail).
-------------------------------------------*/
(function () {
    "use strict";

    var gallery = document.getElementById("recognition-gallery");
    if (!gallery) return;

    var list = document.getElementById("gallery-strip-list");
    var main = document.getElementById("gallery-main");
    var backdrop = document.getElementById("gallery-backdrop");
    var caption = document.getElementById("gallery-caption");
    var counter = document.getElementById("gallery-counter");
    var AUTOPLAY_MS = 4000;

    var items = Array.prototype.map.call(
        list.querySelectorAll("button"),
        function (b) {
            return {
                src: b.getAttribute("data-full"),
                caption: b.getAttribute("data-caption"),
                alt: b.querySelector("img").getAttribute("alt"),
            };
        },
    );
    if (!items.length) return;

    // copy of the strip for the seamless loop
    var clone = list.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("button").forEach(function (b) {
        b.tabIndex = -1;
    });
    list.parentNode.appendChild(clone);

    var buttons = Array.prototype.slice.call(
        gallery.querySelectorAll(".gallery-strip-list button"),
    );
    var index = 0;
    var timer = null;
    var paused = false;
    var visible = false;

    function show(i) {
        index = (i + items.length) % items.length;
        var item = items[index];

        main.classList.add("is-fading");
        window.setTimeout(function () {
            main.src = item.src;
            main.alt = item.alt;
            backdrop.src = item.src;
            caption.textContent = item.caption;
            main.classList.remove("is-fading");
        }, 200);

        counter.textContent = index + 1 + " / " + items.length;
        buttons.forEach(function (b, j) {
            b.classList.toggle("is-active", j % items.length === index);
        });
    }

    function restart() {
        window.clearInterval(timer);
        if (paused || !visible) return;
        timer = window.setInterval(function () {
            show(index + 1);
        }, AUTOPLAY_MS);
    }

    buttons.forEach(function (b, j) {
        b.addEventListener("click", function () {
            show(j % items.length);
            restart();
        });
    });

    document.getElementById("gallery-prev").addEventListener("click", function () {
        show(index - 1);
        restart();
    });
    document.getElementById("gallery-next").addEventListener("click", function () {
        show(index + 1);
        restart();
    });

    gallery.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") show(index - 1);
        else if (e.key === "ArrowRight") show(index + 1);
        else return;
        restart();
    });

    // the strip and autoplay only run while the gallery is on screen and
    // not hovered/focused, so it always starts from photo 1 when reached
    function update() {
        gallery.classList.toggle("is-paused", paused || !visible);
        restart();
    }

    function pause(on) {
        paused = on;
        update();
    }

    gallery.addEventListener("mouseenter", function () {
        pause(true);
    });
    gallery.addEventListener("mouseleave", function () {
        pause(false);
    });
    gallery.addEventListener("focusin", function () {
        pause(true);
    });
    gallery.addEventListener("focusout", function (e) {
        if (!gallery.contains(e.relatedTarget)) pause(false);
    });

    // preload the stage photos (after the page has loaded) so switching
    // doesn't flash
    window.addEventListener("load", function () {
        items.forEach(function (item) {
            new Image().src = item.src;
        });
    });

    show(0);
    // on screen = at least a third of the gallery inside the viewport
    function checkVisible() {
        var r = gallery.getBoundingClientRect();
        var shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        var now = shown > Math.min(r.height, window.innerHeight) / 3;
        if (now !== visible) {
            visible = now;
            update();
        }
    }
    window.addEventListener("scroll", checkVisible, { passive: true });
    window.addEventListener("resize", checkVisible);
    update();
    checkVisible();
})();
