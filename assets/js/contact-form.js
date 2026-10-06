/*------------------------------------------
    = CONTACT FORM (contact.html)
    Validates, then sends to Google Sheets via submitFormToGoogle()
    (form-api.js) with formType "contact".
-------------------------------------------*/
$(document).ready(function () {
    const form = $("#contact_form");
    const wrap = $("#contact_form_wrap");
    const button = $("#send_message");
    const errorBox = $("#error_message");
    const successBox = $("#success_message");

    if (!form.length) {
        console.warn("Contact form not found.");
        return;
    }

    // plain-language reason shown under the error message
    function describeError(error) {
        const msg = String((error && error.message) || error || "");
        if (/failed to fetch|networkerror|load failed/i.test(msg)) {
            return "Reason: the form server could not be reached. Check your internet connection, or disable ad/privacy blockers for this site and try again.";
        }
        return msg ? "Reason: " + msg : "";
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;
    const BUTTON_TEXT = button.text();

    form.off("submit.sbsContact input.sbsContact change.sbsContact");

    form.on("input.sbsContact change.sbsContact", ".form-control", function () {
        $(this).removeClass("error_input").removeAttr("aria-invalid");
    });

    function flag(selector) {
        form.find(selector)
            .addClass("error_input")
            .attr("aria-invalid", "true");
    }

    form.on("submit.sbsContact", function (event) {
        event.preventDefault();
        if (button.prop("disabled")) return;

        let hasError = false;
        form.find(".form-control")
            .removeClass("error_input")
            .removeAttr("aria-invalid");
        errorBox.stop(true, true).hide();

        const name = String(form.find("#name").val() || "").trim();
        const email = String(form.find("#email").val() || "").trim();
        const phone = String(form.find("#phone").val() || "").trim();
        const message = String(form.find("#message").val() || "").trim();

        if (!name || name.length > 100) {
            flag("#name");
            hasError = true;
        }
        if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
            flag("#email");
            hasError = true;
        }
        if (!phone || phone.length > 20 || !PHONE_RE.test(phone)) {
            flag("#phone");
            hasError = true;
        }
        if (!message || message.length > 2000) {
            flag("#message");
            hasError = true;
        }

        if (hasError) {
            form.find(".error_input").first().trigger("focus");
            return;
        }

        button.prop("disabled", true).text("Sending...");

        const payload = {
            formType: "contact",
            name: name,
            email: email,
            phone: phone,
            message: message,
            honeypot: String(form.find("#contact_hp").val() || "").trim(),
        };

        console.log("Contact form submission started.");

        submitFormToGoogle(payload)
            .then(function (result) {
                console.log("Contact form request completed.", result);
                wrap.stop(true, true).fadeOut(300, function () {
                    form[0].reset();
                    successBox.removeClass("d-none").hide().fadeIn(500);
                });
            })
            .catch(function (error) {
                console.error("Contact form submission error:", error);
                errorBox.find(".form-msg-detail").text(describeError(error));
                errorBox.stop(true, true).fadeIn(300);
                button.prop("disabled", false).text(BUTTON_TEXT);
            });
    });
});
