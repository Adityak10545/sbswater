/*------------------------------------------
    = WHATSAPP CHAT WIDGET
    Builds the floating WhatsApp button + "Start a Conversation" panel.
    Styles: assets/sass/components/_whatsapp-widget.scss
-------------------------------------------*/
(function () {
    "use strict";

    // ---- settings -------------------------------------------------------
    var WHATSAPP_NUMBER = "918799949599"; // +91 87999 49599 (country code, no + or spaces)
    var GREETING = "Hello SBS Water & Infra, I would like to know more about your " +
        "water and wastewater treatment solutions.";
    var TEAM_NAME = "SBS Water & Infra";
    var TEAM_ROLE = "Chat with our Team";
    // ---------------------------------------------------------------------

    var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function init() {
        if (document.querySelector(".sbs-wa")) return;

        var link = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(GREETING);

        var root = document.createElement("div");
        root.className = "sbs-wa";
        root.innerHTML =
            '<div class="sbs-wa__panel" id="sbs-wa-panel" role="dialog" aria-labelledby="sbs-wa-title" aria-hidden="true">' +
                '<div class="sbs-wa__head">' + ICON +
                    '<div>' +
                        '<p class="sbs-wa__title" id="sbs-wa-title">Start a Conversation</p>' +
                        '<p class="sbs-wa__subtitle">Hi! Click our member below to chat on <strong>WhatsApp</strong></p>' +
                    '</div>' +
                    '<button type="button" class="sbs-wa__close" aria-label="Close chat panel">&times;</button>' +
                '</div>' +
                '<div class="sbs-wa__body">' +
                    '<p class="sbs-wa__note">The team typically replies in a few minutes.</p>' +
                    '<a class="sbs-wa__member" href="' + link + '" target="_blank" rel="noopener">' +
                        '<span class="sbs-wa__avatar">' + ICON + '</span>' +
                        '<span>' +
                            '<span class="sbs-wa__name">' + escapeHtml(TEAM_NAME) + '</span>' +
                            '<span class="sbs-wa__role">' + escapeHtml(TEAM_ROLE) + '</span>' +
                        '</span>' +
                    '</a>' +
                '</div>' +
            '</div>' +
            '<button type="button" class="sbs-wa__toggle" aria-label="Chat with us on WhatsApp" ' +
                'aria-expanded="false" aria-controls="sbs-wa-panel">' + ICON + '</button>';

        document.body.appendChild(root);

        var panel = root.querySelector(".sbs-wa__panel");
        var toggle = root.querySelector(".sbs-wa__toggle");

        function setOpen(open) {
            root.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            panel.setAttribute("aria-hidden", open ? "false" : "true");
        }

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            setOpen(!root.classList.contains("is-open"));
        });
        root.querySelector(".sbs-wa__close").addEventListener("click", function (e) {
            e.stopPropagation();
            setOpen(false);
            toggle.focus();
        });
        panel.addEventListener("click", function (e) {
            e.stopPropagation();
        });
        document.addEventListener("click", function () {
            setOpen(false);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && root.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
