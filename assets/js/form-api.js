/*------------------------------------------
    = FORM API (shared by contact-form.js and quote-form.js)
    Sends form data to the SBS Google Apps Script web app, which saves it to
    the Google Sheet and emails marketing@sbswater.in.

    SETUP: deploy Code.gs as a web app, then paste its /exec URL below.
-------------------------------------------*/
const GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbx1dx0LfcQzmnDjTtDFAnaM4fd4TbL-V40RY0VXi2JR6s0AyDSTZLAT-rSLo7ulsicB/exec";

const SBS_FORM_TYPES = ["contact", "quote"];

function submitFormToGoogle(formData) {
    return new Promise(function (resolve, reject) {
        if (!formData || typeof formData !== "object") {
            reject(new Error("Invalid form data."));
            return;
        }

        const formType = String(formData.formType || "")
            .trim()
            .toLowerCase();

        if (SBS_FORM_TYPES.indexOf(formType) === -1) {
            reject(new Error("Invalid form type."));
            return;
        }

        if (
            !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(
                GOOGLE_APPS_SCRIPT_URL,
            )
        ) {
            reject(new Error("Form backend URL is not configured."));
            return;
        }

        const body = new URLSearchParams();

        Object.keys(formData).forEach(function (key) {
            const value = formData[key];
            if (value !== null && value !== undefined) {
                body.append(key, String(value));
            }
        });

        console.log("Submitting form:", formType);

        // Apps Script replies with Access-Control-Allow-Origin: *, so the
        // JSON reply is readable. A url-encoded POST is a "simple" request
        // (no CORS preflight). Resolve only when the script confirms it saved
        // the submission ({ success: true }), so the thank-you message is never
        // shown for a submission that failed on the server.
        fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: body.toString(),
            cache: "no-store",
            credentials: "omit",
            redirect: "follow",
        })
            .then(function (response) {
                return response.json().catch(function () {
                    throw new Error(
                        "Unexpected response from the form backend (HTTP " +
                            response.status +
                            ").",
                    );
                });
            })
            .then(function (data) {
                if (!data || data.success !== true) {
                    throw new Error(
                        (data && data.message) || "Submission was not saved.",
                    );
                }
                console.log("Form saved:", data.submissionId);
                resolve({
                    success: true,
                    formType: formType,
                    submissionId: data.submissionId,
                });
            })
            .catch(function (error) {
                console.error(
                    "Form submission failed:",
                    error.message || error,
                );
                reject(error);
            });
    });
}
