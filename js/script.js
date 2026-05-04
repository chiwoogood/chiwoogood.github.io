document.addEventListener("DOMContentLoaded", function () {
    initSectionEase();
    initGallerySlider();
    initAccordion();
    initKakaoMap();
});

/* =========================
   섹션 이지인 효과
   - 섹션 전체를 움직이지 않음
   - 내부 내용만 자연스럽게 들어옴
   - 화면에 들어올 때마다 다시 적용됨
========================= */
function initSectionEase() {
    const targets = document.querySelectorAll(
        ".main-content, .intro-content, .gallery-slider, .location-content, .account-content"
    );

    if (!targets.length) {
        return;
    }

    targets.forEach(function (target) {
        target.classList.add("ease-target");
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("ease-visible");
            } else {
                entry.target.classList.remove("ease-visible");
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
    });

    targets.forEach(function (target) {
        observer.observe(target);
    });
}

/* =========================
   갤러리 슬라이드
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
        }, 1600);
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
   신랑측 / 신부측 계좌 접기 펼치기
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
