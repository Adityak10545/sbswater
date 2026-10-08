(function () {
    "use strict";

    var form = document.getElementById("careers-form");
    if (!form) return;

    // keep in sync with MAX_RESUME_BYTES in the careers Code.gs
    var MAX_BYTES = 5 * 1024 * 1024;
    var ALLOWED = ["pdf", "doc", "docx"];
    var MIME_BY_EXT = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    var FALLBACK_EMAIL = "hr@sbswater.in";

    var status = form.querySelector(".careers-status");
    var button = form.querySelector('button[type="submit"]');
    var fileInput = form.querySelector("#cf-resume");

    function setStatus(text, kind) {
        status.textContent = text;
        status.className = "careers-status" + (kind ? " is-" + kind : "");
    }

    function value(id) {
        var el = document.getElementById(id);
        return el ? String(el.value || "").trim() : "";
    }

    function fileExt(file) {
        return file.name.split(".").pop().toLowerCase();
    }

    // data URL -> bare base64 string
    function readAsBase64(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                var result = String(reader.result || "");
                var comma = result.indexOf(",");
                if (comma === -1) {
                    reject(new Error("Unable to read your CV."));
                    return;
                }
                resolve(result.substring(comma + 1));
            };
            reader.onerror = function () {
                reject(new Error("Unable to read your CV."));
            };
            reader.readAsDataURL(file);
        });
    }

    // CV checks: extension + size, reported through the browser's own validation UI
    fileInput.addEventListener("change", function () {
        var file = fileInput.files[0];
        var message = "";
        if (file) {
            if (ALLOWED.indexOf(fileExt(file)) === -1) {
                message = "Please upload your CV as a PDF, DOC or DOCX file.";
            } else if (file.size <= 0 || file.size > MAX_BYTES) {
                message = "Your CV must be 5 MB or smaller.";
            }
        }
        fileInput.setCustomValidity(message);
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (button.disabled) return;
        setStatus("");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // spam trap filled in: pretend success, send nothing
        if (value("cf-hp")) {
            form.reset();
            setStatus(
                "Thank you! Your application has been received.",
                "success",
            );
            return;
        }

        // backend not connected yet: point applicants to email
        if (
            typeof submitCareerFormToGoogle !== "function" ||
            typeof isCareerBackendConfigured !== "function" ||
            !isCareerBackendConfigured()
        ) {
            setStatus(
                "Online applications will be available soon. Meanwhile, please email your CV to " +
                    FALLBACK_EMAIL +
                    ".",
                "pending",
            );
            return;
        }

        var file = fileInput.files[0];
        button.disabled = true;
        setStatus("Sending your application…", "pending");

        readAsBase64(file)
            .then(function (base64) {
                return submitCareerFormToGoogle({
                    formType: "career",
                    fullName: value("cf-name"),
                    email: value("cf-email").toLowerCase(),
                    mobile: value("cf-phone"),
                    position: value("cf-position"),
                    experience: value("cf-experience"),
                    organization: value("cf-organisation"),
                    noticePeriod: value("cf-notice"),
                    currentCtc: value("cf-current-ctc"),
                    expectedCtc: value("cf-expected-ctc"),
                    linkedin: value("cf-linkedin"),
                    reason: value("cf-message"),
                    honeypot: "",
                    resumeName: file.name,
                    resumeMimeType: file.type || MIME_BY_EXT[fileExt(file)],
                    resumeSize: String(file.size),
                    resumeBase64: base64,
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
                // only show messages written by Code.gs, never raw
                // browser/network errors
                var text =
                    error && error.fromServer && error.message
                        ? error.message
                        : "We couldn't send your application. Please try again.";
                setStatus(
                    text +
                        " You can also email your CV to " +
                        FALLBACK_EMAIL +
                        ".",
                    "error",
                );
            })
            .then(function () {
                button.disabled = false;
            });
    });
})();
