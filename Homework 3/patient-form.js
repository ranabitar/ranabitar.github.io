/*
Program name: patient-form.js
Author: Rana Bitar
Date created: 10/22/2026
Date last edited: 10/22/2026
Version: 1.0
Description: JavaScript functions for Maré Skin patient registration.
*/

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("patientForm");

    const byId = id => document.getElementById(id);

    // Display today's date
    const today = new Date();

    byId("today").textContent = today.toLocaleDateString();

    // Date of birth limits
    function localDate(date) {
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    }

    const oldest = new Date(
        today.getFullYear() - 120,
        today.getMonth(),
        today.getDate()
    );

    byId("dob").min = localDate(oldest);
    byId("dob").max = localDate(today);

    // All fields to validate
    const ids = [
        "firstName",
        "middleInitial",
        "lastName",
        "dob",
        "ssn",
        "address1",
        "address2",
        "city",
        "state",
        "zip",
        "email",
        "phone",
        "symptoms",
        "visitReason",
        "gender",
        "vaccinated",
        "insurance",
        "healthRating",
        "userID",
        "password",
        "confirmPassword"
    ];

    const touched = new Set();

    let submitReady = false;

    const submit = byId("submitBtn");
    const status = byId("formStatus");


    // ===================================
    // VALIDATION RULES FOR EACH FIELD
    // ===================================

    function messageFor(id) {

        const val = byId(id)?.value ?? "";
        const value = val.trim();

        function required(name) {
            return name + " is required.";
        }

        switch (id) {

            // First and Last Name
            case "firstName":
            case "lastName":

                if (!value) {
                    return required(
                        id === "firstName" ? "First name" : "Last name"
                    );
                }

                if (!/^[A-Za-z'-]{1,30}$/.test(value)) {
                    return "Use 1 to 30 letters, apostrophes, or hyphens only.";
                }

                return "";


            // Middle Initial
            case "middleInitial":

                if (value && !/^[A-Za-z]$/.test(value)) {
                    return "Enter one letter only, or leave blank.";
                }

                return "";


            // Date of Birth
            case "dob":

                if (!value) {
                    return required("Date of birth");
                }

                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return "Choose a valid date.";
                }

                const [year, month, day] = value.split("-").map(Number);

                const date = new Date(year, month - 1, day);

                if (
                    date.getFullYear() !== year ||
                    date.getMonth() !== month - 1 ||
                    date.getDate() !== day
                ) {
                    return "Enter a real calendar date.";
                }

                if (
                    date > new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                    )
                ) {
                    return "Date of birth cannot be in the future.";
                }

                if (date < oldest) {
                    return "Date of birth cannot be more than 120 years ago.";
                }

                return "";


            // Nine-Digit Patient ID
            case "ssn":

                if (value && !/^\d{3}-\d{2}-\d{4}$/.test(value)) {
                    return "Enter exactly 9 digits (000-00-0000), or leave blank.";
                }

                return "";


            // Address
            case "address1":
            case "address2":

                if (!value && id === "address1") {
                    return required("Address line 1");
                }

                if (!value) {
                    return "";
                }

                if (
                    value.length < 2 ||
                    value.length > 30 ||
                    !/^[A-Za-z0-9 .,'#\/-]+$/.test(value)
                ) {
                    return "Use 2 to 30 valid address characters.";
                }

                return "";


            // City
            case "city":

                if (!value) {
                    return required("City");
                }

                if (!/^[A-Za-z .'-]{2,30}$/.test(value)) {
                    return "Use 2 to 30 letters, spaces, apostrophes, or hyphens.";
                }

                return "";


            // State
            case "state":

                if (
                    !value ||
                    !Array.from(byId("state").options).some(
                        option => option.value === value && value !== ""
                    )
                ) {
                    return "Please select a state, DC, or PR.";
                }

                return "";


            // ZIP Code
            case "zip":

                if (!value) {
                    return required("ZIP code");
                }

                if (!/^\d{5}$/.test(value)) {
                    return "ZIP code must contain exactly 5 digits.";
                }

                return "";


            // Email
            case "email":

                if (!value) {
                    return required("Email address");
                }

                if (
                    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value) ||
                    value.length > 254
                ) {
                    return "Enter a valid email in the format name@domain.tld.";
                }

                return "";


            // Phone Number
            case "phone":

                if (!value) {
                    return required("Phone number");
                }

                if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) {
                    return "Enter 10 digits in the format 000-000-0000.";
                }

                return "";


            // Symptoms
            case "symptoms":

                if (!value) {
                    return "";
                }

                if (
                    value.length > 500 ||
                    /[<>]/.test(value) ||
                    /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)
                ) {
                    return "Use up to 500 normal text characters without HTML tags.";
                }

                return "";


            // Checkboxes and Radio Buttons
            case "visitReason":
            case "gender":
            case "vaccinated":
            case "insurance":

                const selected = Array.from(
                    form.querySelectorAll(`[name="${id}"]:checked`)
                );

                const options = Array.from(
                    form.querySelectorAll(`[name="${id}"]`)
                );

                if (
                    selected.some(item => !options.includes(item))
                ) {
                    return "Please select an available option.";
                }

                return "";


            // Health Rating Slider
            case "healthRating":

                if (
                    /^\d+$/.test(value) &&
                    Number(value) >= 0 &&
                    Number(value) <= 10 &&
                    Number.isInteger(Number(value))
                ) {
                    return "";
                }

                return "Choose a whole number between 0 and 10.";


            // Desired User ID
            case "userID":

                if (!value) {
                    return required("User ID");
                }

                if (value.length < 5 || value.length > 20) {
                    return "User ID must contain 5 to 20 characters.";
                }

                if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(value)) {
                    return "Start with a letter. Only letters, numbers, underscores, and dashes are allowed.";
                }

                return "";


            // Password
            case "password":

                if (!val) {
                    return required("Password");
                }

                if (val.length < 8 || val.length > 30) {
                    return "Password must contain 8 to 30 characters.";
                }

                if (
                    !/[A-Z]/.test(val) ||
                    !/[a-z]/.test(val) ||
                    !/[0-9]/.test(val)
                ) {
                    return "Include an uppercase letter, lowercase letter, and number.";
                }

                if (!/[!@#%^&*()_+=.,`~<>/\\-]/.test(val)) {
                    return "Include at least one special character.";
                }

                if (!/^[A-Za-z0-9!@#%^&*()_+=.,`~<>/\\-]+$/.test(val)) {
                    return "Spaces, quotes, or unsupported characters are not allowed.";
                }

                if (
                    val.toLowerCase() ===
                    byId("userID").value.trim().toLowerCase()
                ) {
                    return "Password cannot be the same as your User ID.";
                }

                return "";


            // Confirm Password
            case "confirmPassword":

                if (!val) {
                    return required("Password confirmation");
                }

                if (val !== byId("password").value) {
                    return "Passwords do not match.";
                }

                return "";


            default:
                return "";
        }
    }


    // ===================================
    // DISPLAY ERROR MESSAGES
    // ===================================

    function showValidation(id) {

        const message = messageFor(id);

        byId(id + "Error").textContent = message;

        const field = byId(id);

        if (field) {
            field.setAttribute(
                "aria-invalid",
                message ? "true" : "false"
            );
        }

        return message === "";
    }


    // ===================================
    // HIDE SUBMIT WHEN DATA CHANGES
    // ===================================

    function invalidateApproval() {

        if (!submitReady) {
            return;
        }

        submitReady = false;

        submit.hidden = true;
        submit.disabled = true;

        status.textContent =
            "Information changed. Click Validate again before submitting.";

        status.className = "";
    }


    // ===================================
    // AUTOMATIC NUMBER FORMATTING
    // ===================================

    function formatDigits(id, chunks, limit) {

        const field = byId(id);

        const digits = field.value
            .replace(/\D/g, "")
            .slice(0, limit);

        let cursor = 0;
        let formatted = "";

        for (const size of chunks) {

            const portion = digits.slice(cursor, cursor + size);

            if (!portion) {
                break;
            }

            if (formatted) {
                formatted += "-";
            }

            formatted += portion;

            cursor += size;
        }

        field.value = formatted;
    }


    // ===================================
    // LIVE VALIDATION
    // ===================================

    const fieldIds = ids.filter(id => byId(id));

    for (const id of fieldIds) {

        const field = byId(id);

        function checkLive() {

            invalidateApproval();

            touched.add(id);

            // Force email and User ID to lowercase
            if (id === "email" || id === "userID") {
                field.value = field.value.toLowerCase();
            }

            // Format patient ID
            if (id === "ssn") {
                formatDigits("ssn", [3, 2, 4], 9);
            }

            // Format phone number
            if (id === "phone") {
                formatDigits("phone", [3, 3, 4], 10);
            }

            // Update slider value
            if (id === "healthRating") {
                byId("ratingValue").textContent = field.value;
            }

            // Validate current field
            showValidation(id);

            // Recheck password if User ID changes
            if (id === "userID" && touched.has("password")) {
                showValidation("password");
            }

            // Recheck confirmation if password changes
            if (
                id === "password" &&
                touched.has("confirmPassword")
            ) {
                showValidation("confirmPassword");
            }
        }

        // Validate while typing
        field.addEventListener("input", checkLive);

        // Validate when changed
        field.addEventListener("change", checkLive);

        // Validate when leaving field
        field.addEventListener("blur", function () {

            touched.add(id);

            showValidation(id);
        });
    }


    // ===================================
    // CHECKBOX AND RADIO VALIDATION
    // ===================================

    for (const name of [
        "visitReason",
        "gender",
        "vaccinated",
        "insurance"
    ]) {

        const options = form.querySelectorAll(
            `[name="${name}"]`
        );

        for (const item of options) {

            item.addEventListener("change", function () {

                invalidateApproval();

                touched.add(name);

                showValidation(name);
            });
        }
    }


    // ===================================
    // VALIDATE ENTIRE FORM
    // ===================================

    function validateAll() {

        // Retrieve all form data
        const values = Object.fromEntries(
            new FormData(form).entries()
        );

        values.visitReason = Array.from(
            form.querySelectorAll(
                '[name="visitReason"]:checked'
            )
        ).map(item => item.value);

        let errorCount = 0;
        let firstBad = null;

        // Check every field
        for (const id of ids) {

            touched.add(id);

            if (!showValidation(id)) {

                errorCount++;

                if (!firstBad) {
                    firstBad =
                        byId(id) ||
                        form.querySelector(`[name="${id}"]`);
                }
            }
        }

        // Only allow Submit when there are no errors
        submitReady = errorCount === 0;

        submit.disabled = !submitReady;
        submit.hidden = !submitReady;

        status.className = submitReady ? "success" : "error";

        if (submitReady) {

            status.textContent =
                "All fields passed JavaScript validation. You can now click Submit.";

        } else {

            status.textContent =
                errorCount +
                " field(s) need attention. Please correct the errors and click Validate again.";
        }

        if (firstBad) {
            firstBad.focus();
        }

        return submitReady;
    }


    // ===================================
    // VALIDATE BUTTON
    // ===================================

    byId("validateBtn").addEventListener(
        "click",
        validateAll
    );


    // ===================================
    // SUBMIT BUTTON
    // ===================================

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Validate everything again before submitting
        if (!validateAll()) {
            return;
        }

        // Open thank-you page
        window.location.assign("thankyou.html");
    });


    // ===================================
    // RESET BUTTON
    // ===================================

    form.addEventListener("reset", function () {

        setTimeout(function () {

            touched.clear();

            submitReady = false;

            submit.hidden = true;
            submit.disabled = true;

            // Reset slider display
            byId("ratingValue").textContent =
                byId("healthRating").value;

            // Remove all errors
            ids.forEach(function (id) {

                byId(id + "Error").textContent = "";

                const field = byId(id);

                if (field) {
                    field.removeAttribute("aria-invalid");
                }
            });

            status.className = "";

            status.textContent =
                "Complete the form, then click Validate.";

        }, 0);
    });

});
