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
