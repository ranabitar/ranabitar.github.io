/*
Program name: patient-form.js
Author: Rana Bitar
Date created: 10/22/2026
Date last edited: 10/22/2026
Version: 1.0
Description: JavaScript functions for Maré Skin patient registration.
*/

function truncateZip() {
    const zip = document.getElementById("zip");

    if (/^[0-9]{5}-[0-9]{4}$/.test(zip.value)) {
        zip.value = zip.value.substring(0, 5);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("zip")
        .addEventListener("change", truncateZip);
});


// Display the current health rating as the slider moves
function updateHealthRating() {
    const slider = document.getElementById("healthRating");
    const output = document.getElementById("ratingValue");

    output.textContent = slider.value;
}


// Convert the desired User ID to lowercase
function convertUserID() {
    const userID = document.getElementById("userID");

    userID.value = userID.value.toLowerCase();
}


