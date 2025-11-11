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
