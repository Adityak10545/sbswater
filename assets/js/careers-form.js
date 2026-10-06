/*------------------------------------------
    = CAREERS APPLICATION FORM (careers.html)
    Validates in the browser, then posts the form (including the CV file)
    to the URL in the form's action attribute and shows the result inline.
    Expected JSON reply: { "ok": true } or { "ok": false, "message": "…" }.
-------------------------------------------*/
(function () {
    "use strict";

    var form = document.getElementById("careers-form");
    if (!form) return;

    var MAX_BYTES = 5 * 1024 * 1024;
    var ALLOWED = ["pdf", "doc", "docx"];

    var status = form.querySelector(".careers-status");
    var button = form.querySelector('button[type="submit"]');
    var fileInput = form.querySelector("#cf-resume");

    function setStatus(text, kind) {
        status.textContent = text;
        status.className = "careers-status" + (kind ? " is-" + kind : "");
    }

    // CV checks: extension + size, reported through the browser's own validation UI
    fileInput.addEventListener("change", function () {
        var file = fileInput.files[0];
        var message = "";
        if (file) {
            var ext = file.name.split(".").pop().toLowerCase();
            if (ALLOWED.indexOf(ext) === -1) {
                message = "Please upload your CV as a PDF, DOC or DOCX file.";
            } else if (file.size > MAX_BYTES) {
                message = "Your CV must be 5 MB or smaller.";
            }
        }
        fileInput.setCustomValidity(message);
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        setStatus("");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // no backend connected yet (form action is empty): point applicants to email
        var endpoint = form.getAttribute("action");
        if (!endpoint) {
            setStatus(
                "Online applications will be available soon. Meanwhile, please email your CV to info@sbswater.in.",
                "pending",
            );
            return;
        }

        button.disabled = true;
        setStatus("Sending your application…", "pending");

        fetch(endpoint, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
        })
            .then(function (response) {
                return response
                    .json()
                    .catch(function () {
                        return {};
                    })
                    .then(function (data) {
                        if (!response.ok || !data.ok) {
                            var err = new Error(data.message || "");
                            err.fromServer = true;
                            throw err;
                        }
                        return data;
                    });
            })
            .then(function () {
                form.reset();
                setStatus(
                    "Thank you! Your application has been received. Our HR team will contact you if your profile matches an opening.",
                    "success",
                );
            })
            .catch(function (error) {
                // only show messages written by mail-careers.php, never raw
                // browser/network errors
                var text =
                    error && error.fromServer && error.message
                        ? error.message
                        : "We couldn't send your application. Please try again.";
                setStatus(
                    text + " You can also email your CV to info@sbswater.in.",
                    "error",
                );
            })
            .then(function () {
                button.disabled = false;
            });
    });
})();
