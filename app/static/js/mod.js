document.addEventListener('DOMContentLoaded', function() {
    const rollers = document.querySelectorAll('.counter-roller');
    const animateRoller = (roller) => {
        const target = parseFloat(roller.getAttribute('data-target'));
        const digitWrapper = roller.querySelector('.digit-wrapper');
        const isFloat = roller.getAttribute('data-type') === 'float';
        
        const itemHeight = 75;
        const targetIndex = isFloat ? Math.round(target * 10) : target;
        const offset = -(targetIndex * itemHeight);
        
        digitWrapper.style.transform = `translateY(${offset}px)`;
    };
    
    setTimeout(() => {
        rollers.forEach(roller => {
            animateRoller(roller);
        });
    }, 500);
});

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const sliderContainer = document.querySelector('.body-slider-container');
    const slides = document.querySelectorAll('.body-slider-card');
    const bullets = document.querySelectorAll('.bullet');
    const tabButtons = document.querySelectorAll('.tab-button');
    const prevButton = document.querySelector('.before');
    const nextButton = document.querySelector('.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideWidth = 700 + 40; 
    
    let isDragging = false;
    let startPos = 0;
    let startScrollLeft = 0;
    
    function scrollToSlide(index) {
        const scrollPosition = index * slideWidth;
        slider.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateActiveState(index);
    }

    function updateActiveState(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
        
        bullets.forEach(bullet => {
            bullet.classList.remove('active');
        });
        bullets[index].classList.add('active');
        
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        tabButtons[index].classList.add('active');
        
        prevButton.disabled = index === 0;
        nextButton.disabled = index === totalSlides - 1;
        
        currentSlide = index;
    }
    
    // Функция для определения ближайшего слайда к центру
    function getNearestSlideIndex() {
        const sliderRect = slider.getBoundingClientRect();
        const sliderCenter = sliderRect.left + sliderRect.width / 2;
        
        let minDistance = Infinity;
        let nearestIndex = currentSlide;
        
        slides.forEach((slide, index) => {
            const slideRect = slide.getBoundingClientRect();
            const slideCenter = slideRect.left + slideRect.width / 2;
            const distance = Math.abs(slideCenter - sliderCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = index;
            }
        });
        
        return nearestIndex;
    }
    
    // Функции для drag & drop
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function startDrag(event) {
        if (event.type === 'touchstart') event.preventDefault();
        isDragging = true;
        startPos = getPositionX(event);
        startScrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
        slider.style.scrollBehavior = 'auto';
    }
    
    function drag(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const walk = currentPosition - startPos;
            slider.scrollLeft = startScrollLeft - walk;
        }
    }
    
    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        slider.style.cursor = 'grab';
        slider.style.scrollBehavior = 'smooth';
        
        const nearestIndex = getNearestSlideIndex();
        scrollToSlide(nearestIndex);
    }
    
    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag);
    
    slider.addEventListener('mousemove', drag);
    slider.addEventListener('touchmove', drag);
    
    slider.addEventListener('mouseup', endDrag);
    slider.addEventListener('mouseleave', endDrag);
    slider.addEventListener('touchend', endDrag);
    
    slider.style.cursor = 'grab';

    bullets.forEach(bullet => {
        bullet.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            scrollToSlide(slideIndex);
        });
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabIndex = parseInt(this.getAttribute('data-tab'));
            scrollToSlide(tabIndex);
        });
    });
    
    prevButton.addEventListener('click', function() {
        if (currentSlide > 0) {
            scrollToSlide(currentSlide - 1);
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentSlide < totalSlides - 1) {
            scrollToSlide(currentSlide + 1);
        }
    });
    
    slider.addEventListener('scroll', function() {
        if (!isDragging) {
            const scrollPos = slider.scrollLeft;
            const newIndex = Math.round(scrollPos / slideWidth);
            if (newIndex !== currentSlide && newIndex >= 0 && newIndex < totalSlides) {
                updateActiveState(newIndex);
            }
        }
    });
    
    setTimeout(() => {
        scrollToSlide(0);
    }, 100);
    
    updateActiveState(0);
});