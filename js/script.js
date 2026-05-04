document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".gallery-slide");
    const dots = document.querySelectorAll(".gallery-dot");
    const prevButton = document.querySelector(".gallery-prev");
    const nextButton = document.querySelector(".gallery-next");

    let currentIndex = 0;
    let slideTimer = null;

    function removeLeavingClass() {
        slides.forEach(function (slide) {
            slide.classList.remove("leaving");
        });
    }

    function updateDots() {
        dots.forEach(function (dot, index) {
            if (index === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    function showSlide(nextIndex) {
        if (!slides.length) {
            return;
        }

        removeLeavingClass();

        slides[currentIndex].classList.remove("active");
        slides[currentIndex].classList.add("leaving");

        currentIndex = nextIndex;

        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        }

        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }

        slides[currentIndex].classList.add("active");
        updateDots();

        setTimeout(function () {
            removeLeavingClass();
        }, 1200);
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();

        slideTimer = setInterval(function () {
            nextSlide();
        }, 3000);
    }

    function stopAutoSlide() {
        if (slideTimer) {
            clearInterval(slideTimer);
        }
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            nextSlide();
            restartAutoSlide();
        });
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            prevSlide();
            restartAutoSlide();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            restartAutoSlide();
        });
    });

    if (slides.length) {
        startAutoSlide();
    }

    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(function (accordion) {
        const button = accordion.querySelector(".accordion-button");

        button.addEventListener("click", function () {
            accordion.classList.toggle("active");
        });
    });

    initKakaoMap();
});

function initKakaoMap() {
    const mapContainer = document.getElementById("map");

    if (!mapContainer) {
        return;
    }

    if (!window.kakao || !window.kakao.maps) {
        return;
    }

    const weddingHallPosition = new kakao.maps.LatLng(37.5665, 126.9780);

    const mapOption = {
        center: weddingHallPosition,
        level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const marker = new kakao.maps.Marker({
        position: weddingHallPosition
    });

    marker.setMap(map);
}
