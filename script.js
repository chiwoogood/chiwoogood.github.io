document.addEventListener("DOMContentLoaded", function () {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(function (accordion) {
        const button = accordion.querySelector(".accordion-btn");

        button.addEventListener("click", function () {
            accordion.classList.toggle("active");
        });
    });
});
