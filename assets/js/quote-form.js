/*------------------------------------------
    = GET A QUOTE FORM (get-a-quote.html)
    Validates, then sends to Google Sheets via submitFormToGoogle()
    (form-api.js) with formType "quote".
    Service and time lists must match ALLOWED_SERVICES / ALLOWED_TIMES in Code.gs.
-------------------------------------------*/
$(document).ready(function () {
    const form = $("#quote_form");
    const wrap = $("#quote_form_wrap");
    const button = $("#send_quote");
    const errorBox = $("#quote_error");
    const successBox = $("#quote_success");

    if (!form.length) {
        console.warn("Quote form not found.");
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
    const TIMES = [
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
    ];
    const BUTTON_TEXT = button.text();

    // earliest selectable date: today (local time)
    const today = (function () {
        const d = new Date();
        return (
            d.getFullYear() +
            "-" +
            String(d.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d.getDate()).padStart(2, "0")
        );
    })();
    $("#preferred_date").attr("min", today);

    form.off("submit.sbsQuote input.sbsQuote change.sbsQuote");

    form.on("input.sbsQuote change.sbsQuote", ".form-control", function () {
        $(this).removeClass("error_input").removeAttr("aria-invalid");
    });

    function flag(selector) {
        $(selector).addClass("error_input").attr("aria-invalid", "true");
    }

    form.on("submit.sbsQuote", function (event) {
        event.preventDefault();
        if (button.prop("disabled")) return;

        let hasError = false;
        form.find(".form-control")
            .removeClass("error_input")
            .removeAttr("aria-invalid");
        errorBox.stop(true, true).hide();

        const companyName = String($("#company_name").val() || "").trim();
        const service = String($("#service").val() || "").trim();
        const preferredDate = String($("#preferred_date").val() || "").trim();
        const preferredTime = String($("#preferred_time").val() || "").trim();
        const contactPerson = String($("#contact_person").val() || "").trim();
        const email = String($("#quote_email").val() || "").trim();
        const phone = String($("#quote_phone").val() || "").trim();
        const message = String($("#quote_message").val() || "").trim();

        if (!companyName || companyName.length > 150) {
            flag("#company_name");
            hasError = true;
        }
        if (!service) {
            flag("#service");
            hasError = true;
        }
        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ||
            preferredDate < today
        ) {
            flag("#preferred_date");
            hasError = true;
        }
        if (TIMES.indexOf(preferredTime) === -1) {
            flag("#preferred_time");
            hasError = true;
        }
        if (!contactPerson || contactPerson.length > 100) {
            flag("#contact_person");
            hasError = true;
        }
        if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
            flag("#quote_email");
            hasError = true;
        }
        if (!phone || !PHONE_RE.test(phone)) {
            flag("#quote_phone");
            hasError = true;
        }
        if (message.length > 2000) {
            flag("#quote_message");
            hasError = true;
        }

        if (hasError) {
            form.find(".error_input").first().trigger("focus");
            return;
        }

        button.prop("disabled", true).text("Submitting...");

        const payload = {
            formType: "quote",
            companyName: companyName,
            service: service,
            preferredDate: preferredDate,
            preferredTime: preferredTime,
            contactPerson: contactPerson,
            email: email,
            phone: phone,
            message: message,
            honeypot: String($("#quote_hp").val() || "").trim(),
        };

        console.log("Quote form submission started.");

        submitFormToGoogle(payload)
            .then(function (result) {
                console.log("Quote form request completed.", result);
                // after submitting, the card shows only the thank-you message
                const others = $(".quote-card .quote-head, .quote-card .quote-intro, .quote-card .quote-contact");
                others.stop(true, true).fadeOut(300);
                wrap.stop(true, true).fadeOut(300, function () {
                    form[0].reset();
                    $(".quote-card").addClass("is-submitted");
                    successBox.removeClass("d-none").hide().fadeIn(500);
                    $("html, body").animate(
                        { scrollTop: $(".quote-card").offset().top - 120 },
                        300
                    );
                });
            })
            .catch(function (error) {
                console.error("Quote form submission error:", error);
                errorBox.find(".form-msg-detail").text(describeError(error));
                errorBox.stop(true, true).fadeIn(300);
                button.prop("disabled", false).text(BUTTON_TEXT);
            });
    });
});
