document.addEventListener("DOMContentLoaded", function () {
    initGallerySlider();
    initAccordion();
    initKakaoMap();
});

/* =========================
   갤러리 슬라이드
   - 3초 자동 전환
   - 흐려지면서 자연스럽게 전환
   - 하단 화살표 수동 이동
   - 하단 점 버튼 이동
========================= */
function initGallerySlider() {
    const slides = document.querySelectorAll(".gallery-slide");
    const dots = document.querySelectorAll(".gallery-dot");
    const prevButton = document.querySelector(".gallery-prev");
    const nextButton = document.querySelector(".gallery-next");

    let currentIndex = 0;
    let slideTimer = null;

    if (!slides.length) {
        return;
    }

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

    function stopAutoSlide() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    function startAutoSlide() {
        stopAutoSlide();

        slideTimer = setInterval(function () {
            nextSlide();
        }, 3000);
    }

    function restartAutoSlide() {
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

    updateDots();
    startAutoSlide();
}

/* =========================
   계좌 접기 / 펼치기
========================= */
function initAccordion() {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(function (accordion) {
        const button = accordion.querySelector(".accordion-button");

        if (!button) {
            return;
        }

        button.addEventListener("click", function () {
            accordion.classList.toggle("active");
        });
    });
}

/* =========================
   카카오 지도
========================= */
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
