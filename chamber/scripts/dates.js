document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const modEl = document.getElementById("lastModified");
    if (modEl) modEl.textContent = `Last Modified: ${document.lastModified}`;
});
