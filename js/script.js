document.addEventListener("DOMContentLoaded", function () {
    initGallerySlider();
    initAccordion();
    initSectionFadeTransition();
    initKakaoMap();
});

/* =========================
   섹션 이동 자연스러운 전환
   - 스크롤로 다음 섹션에 진입하면
   - 현재 섹션이 부드럽게 선명해짐
========================= */
function initSectionFadeTransition() {
    const sections = document.querySelectorAll(".page-section");

    if (!sections.length) {
        return;
    }

    sections.forEach(function (section, index) {
        section.classList.add("section-fade");

        if (index === 0) {
            section.classList.add("section-visible");
        }
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("section-visible");
            } else {
                entry.target.classList.remove("section-visible");
            }
        });
    }, {
        threshold: 0.42
    });

    sections.forEach(function (section) {
        observer.observe(section);
    });
}

/* =========================
   갤러리 슬라이드
   - 3초 간격 자동 전환
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
   - index.html에서 카카오 SDK 주석 해제 후 appkey 입력 필요
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
