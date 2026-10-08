/*------------------------------------------
    = PROJECTS PAGE (portfolio.html)
    - Featured projects: type filter + photo lightbox
    - Project register: type filter, search, show more
    - Missing photos: any .project-photo whose image fails to load shows a
      "Photo coming soon" placeholder instead of a broken image.

    PHOTOS: drop files into assets/images/projects/ named
    <data-project>-1.jpg … <data-project>-<data-photos>.jpg
    (e.g. satish-1.jpg … satish-5.jpg), plus satva-2.jpg and panel-1.jpg.
-------------------------------------------*/
(function () {
    "use strict";

    var PHOTO_DIR = "assets/images/projects/";

    function photoSrc(id, index) {
        return PHOTO_DIR + id + "-" + (index + 1) + ".jpg";
    }

    /* ---------- photo placeholders ---------- */
    function watchPhoto(img) {
        var holder = img.closest(".project-photo");
        if (!holder) return;

        function missing() {
            holder.classList.add("is-placeholder");
        }

        img.addEventListener("error", missing);
        img.addEventListener("load", function () {
            holder.classList.remove("is-placeholder");
        });
        // already failed before this script ran
        if (img.complete && img.getAttribute("src") && img.naturalWidth === 0) {
            missing();
        }
    }

    document.querySelectorAll(".project-photo img").forEach(watchPhoto);

    /* ---------- shared filter buttons ---------- */
    function setActive(buttons, active) {
        buttons.forEach(function (b) {
            var on = b === active;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-pressed", on ? "true" : "false");
        });
    }

    /* ---------- featured projects ---------- */
    var cards = Array.prototype.slice.call(
        document.querySelectorAll(".project-card"),
    );
    var cardButtons = Array.prototype.slice.call(
        document.querySelectorAll("[data-filter]"),
    );
    var featuredCount = document.getElementById("featured-count");

    function filterCards(filter) {
        var shown = 0;
        cards.forEach(function (card) {
            var tags = card.getAttribute("data-tags").split(" ");
            var ok = filter === "all" || tags.indexOf(filter) !== -1;
            card.hidden = !ok;
            if (ok) shown++;
        });
        if (featuredCount) {
            featuredCount.textContent =
                shown + " project" + (shown === 1 ? "" : "s");
        }
    }

    cardButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            setActive(cardButtons, button);
            filterCards(button.getAttribute("data-filter"));
        });
    });

    if (cards.length) filterCards("all");

    /* ---------- project register ---------- */
    var rows = Array.prototype.slice.call(
        document.querySelectorAll("#register-table tbody tr"),
    );
    var registerButtons = Array.prototype.slice.call(
        document.querySelectorAll("[data-register-filter]"),
    );
    var search = document.getElementById("register-search");
    var registerCount = document.getElementById("register-count");
    var moreButton = document.getElementById("register-more");
    var emptyNote = document.getElementById("register-empty");
    var ROWS_COLLAPSED = 12;
    var registerFilter = "all";
    var expanded = false;

    function filterRegister() {
        var query = search ? search.value.trim().toLowerCase() : "";
        var matches = 0;
        var shown = 0;

        rows.forEach(function (row) {
            var types = row.getAttribute("data-type").split(" ");
            var ok =
                (registerFilter === "all" ||
                    types.indexOf(registerFilter) !== -1) &&
                (!query || row.textContent.toLowerCase().indexOf(query) !== -1);
            if (ok) matches++;
            // searching always shows every match
            var visible = ok && (expanded || query || matches <= ROWS_COLLAPSED);
            row.hidden = !visible;
            if (visible) shown++;
        });

        registerCount.textContent =
            "Showing " +
            shown +
            " of " +
            matches +
            " plant" +
            (matches === 1 ? "" : "s");
        emptyNote.hidden = matches !== 0;
        moreButton.hidden = !!query || (matches <= ROWS_COLLAPSED && !expanded);
        moreButton.textContent = expanded
            ? "Show fewer"
            : "Show all " + matches + " plants";
    }

    if (rows.length) {
        registerButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                setActive(registerButtons, button);
                registerFilter = button.getAttribute("data-register-filter");
                filterRegister();
            });
        });

        search.addEventListener("input", filterRegister);

        moreButton.addEventListener("click", function () {
            expanded = !expanded;
            filterRegister();
            if (!expanded) {
                document.getElementById("register").scrollIntoView();
            }
        });

        filterRegister();
    }

    /* ---------- lightbox ---------- */
    var lightbox = document.getElementById("project-lightbox");
    if (!lightbox || !cards.length) return;

    var image = document.getElementById("lightbox-image");
    var counter = document.getElementById("lightbox-counter");
    var thumbs = document.getElementById("lightbox-thumbs");
    var prev = document.getElementById("lightbox-prev");
    var next = document.getElementById("lightbox-next");
    var closeButton = document.getElementById("lightbox-close");
    var current = null;
    var index = 0;
    var lastFocus = null;

    watchPhoto(image);

    function text(el, selector) {
        var found = el.querySelector(selector);
        return found ? found.textContent.trim() : "";
    }

    // text of the card's location / capacity line, found by its icon
    function metaText(card, icon) {
        var i = card.querySelector(".project-meta ." + icon);
        return i ? i.parentNode.textContent.trim() : "";
    }

    function show(i) {
        index = (i + current.count) % current.count;
        image.src = photoSrc(current.id, index);
        image.alt =
            current.scope + " at " + current.client + ", photo " + (index + 1);
        counter.textContent = index + 1 + " / " + current.count;
        Array.prototype.forEach.call(thumbs.children, function (b, j) {
            b.classList.toggle("is-active", j === index);
        });
    }

    function addMeta(term, value) {
        if (!value) return;
        var row = document.createElement("div");
        var dt = document.createElement("dt");
        var dd = document.createElement("dd");
        dt.textContent = term;
        dd.textContent = value;
        row.appendChild(dt);
        row.appendChild(dd);
        document.getElementById("lightbox-meta").appendChild(row);
    }

    function open(card) {
        current = {
            id: card.getAttribute("data-project"),
            count: parseInt(card.getAttribute("data-photos"), 10) || 1,
            scope: text(card, ".project-scope"),
            client: text(card, "h3"),
        };
        lastFocus = document.activeElement;

        document.getElementById("lightbox-scope").textContent = current.scope;
        document.getElementById("lightbox-title").textContent = current.client;
        document.getElementById("lightbox-text").textContent = text(card, "p");
        document.getElementById("lightbox-meta").innerHTML = "";
        addMeta("Location", metaText(card, "ti-location-pin"));
        addMeta("Status", text(card, ".project-status"));
        addMeta("Capacity", metaText(card, "ti-dashboard"));

        thumbs.innerHTML = "";
        for (var j = 0; j < current.count; j++) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "project-photo";
            b.setAttribute("aria-label", "Photo " + (j + 1));
            var img = document.createElement("img");
            img.src = photoSrc(current.id, j);
            img.alt = "";
            b.appendChild(img);
            watchPhoto(img);
            b.addEventListener("click", show.bind(null, j));
            thumbs.appendChild(b);
        }

        var many = current.count > 1;
        thumbs.hidden = !many;
        prev.hidden = !many;
        next.hidden = !many;

        show(0);
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function close() {
        lightbox.hidden = true;
        document.body.style.overflow = "";
        if (lastFocus) lastFocus.focus();
    }

    cards.forEach(function (card) {
        card.querySelector(".project-card-image").addEventListener(
            "click",
            function () {
                open(card);
            },
        );
    });

    closeButton.addEventListener("click", close);
    prev.addEventListener("click", function () {
        show(index - 1);
    });
    next.addEventListener("click", function () {
        show(index + 1);
    });
    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
        if (lightbox.hidden) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft" && current.count > 1) show(index - 1);
        if (e.key === "ArrowRight" && current.count > 1) show(index + 1);
    });
})();
