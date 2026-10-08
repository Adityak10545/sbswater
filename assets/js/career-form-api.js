const CAREER_GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyDx5VXoEr9gdv-eqLXTwoGPSjLXW14DnunF8yVSwLl9uhGZU9XpE5OmUOOdr3rkogI/exec";

function isCareerBackendConfigured() {
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(
        CAREER_GOOGLE_APPS_SCRIPT_URL,
    );
}

function submitCareerFormToGoogle(formData) {
    return new Promise(function (resolve, reject) {
        if (!formData || typeof formData !== "object") {
            reject(new Error("Invalid career form data."));
            return;
        }

        if (
            String(formData.formType || "")
                .trim()
                .toLowerCase() !== "career"
        ) {
            reject(new Error("Invalid career form type."));
            return;
        }

        if (!isCareerBackendConfigured()) {
            reject(new Error("Career form backend URL is not configured."));
            return;
        }

        const body = new URLSearchParams();

        Object.keys(formData).forEach(function (key) {
            const value = formData[key];
            if (value !== null && value !== undefined) {
                body.append(key, String(value));
            }
        });

        console.log("Submitting career application.");

        // Same pattern as form-api.js: a url-encoded POST is a "simple"
        // request (no CORS preflight) and Apps Script's JSON reply is
        // readable, so we resolve only when the script confirms it saved the
        // application ({ success: true }).
        fetch(CAREER_GOOGLE_APPS_SCRIPT_URL, {
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
                        "Unexpected response from the career form backend (HTTP " +
                            response.status +
                            ").",
                    );
                });
            })
            .then(function (data) {
                if (!data || data.success !== true) {
                    const err = new Error(
                        (data && data.message) || "Application was not saved.",
                    );
                    // message written by Code.gs, safe to show the applicant
                    err.fromServer = Boolean(data && data.message);
                    throw err;
                }
                console.log("Career application saved:", data.submissionId);
                resolve({
                    success: true,
                    formType: "career",
                    submissionId: data.submissionId,
                });
            })
            .catch(function (error) {
                console.error(
                    "Career application submission failed:",
                    error.message || error,
                );
                reject(error);
            });
    });
}
