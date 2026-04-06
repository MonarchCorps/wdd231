document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            const isExpanded = navMenu.classList.contains("active");
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
        });

        menuToggle.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }

    // Wayfinding – mark the current page link as active
    const homeLink = document.querySelector('#navMenu a[href="#"]');
    if (homeLink) {
        homeLink.classList.add("active");
        homeLink.setAttribute("aria-current", "page");
    }
});
