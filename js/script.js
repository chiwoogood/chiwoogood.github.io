document.addEventListener("DOMContentLoaded", function () {
    initGallerySlider();
    initAccordion();
    initSlowSectionMove();
    initKakaoMap();
});

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
   느린 섹션 이동
   - 모바일 청첩장용
   - 한 번 스와이프하면 다음/이전 구역으로 천천히 이동
========================= */
function initSlowSectionMove() {
    const sections = document.querySelectorAll(".page-section");

    let currentSectionIndex = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isMoving = false;

    if (!sections.length) {
        return;
    }

    function easeInOutCubic(t) {
        if (t < 0.5) {
            return 4 * t * t * t;
        }

        return 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function moveToSection(targetIndex) {
        if (isMoving) {
            return;
        }

        if (targetIndex < 0 || targetIndex >= sections.length) {
            return;
        }

        isMoving = true;

        const startY = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = sections[targetIndex].offsetTop;
        const distance = targetY - startY;
        const duration = 850;
        let startTime = null;

        function animateScroll(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * easedProgress);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                currentSectionIndex = targetIndex;
                isMoving = false;
            }
        }

        requestAnimationFrame(animateScroll);
    }

    function updateCurrentSectionIndex() {
        const currentY = window.pageYOffset || document.documentElement.scrollTop;
        let closestIndex = 0;
        let closestDistance = Infinity;

        sections.forEach(function (section, index) {
            const distance = Math.abs(section.offsetTop - currentY);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        currentSectionIndex = closestIndex;
    }

    window.addEventListener("touchstart", function (event) {
        if (!event.touches || !event.touches.length) {
            return;
        }

        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", function (event) {
        if (!event.changedTouches || !event.changedTouches.length) {
            return;
        }

        touchEndY = event.changedTouches[0].clientY;

        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffY) < 45) {
            return;
        }

        updateCurrentSectionIndex();

        if (diffY > 0) {
            moveToSection(currentSectionIndex + 1);
        } else {
            moveToSection(currentSectionIndex - 1);
        }
    }, { passive: true });

    window.addEventListener("wheel", function (event) {
        if (Math.abs(event.deltaY) < 20) {
            return;
        }

        event.preventDefault();

        updateCurrentSectionIndex();

        if (event.deltaY > 0) {
            moveToSection(currentSectionIndex + 1);
        } else {
            moveToSection(currentSectionIndex - 1);
        }
    }, { passive: false });
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
