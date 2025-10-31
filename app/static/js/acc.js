document.querySelectorAll('.input-strange').forEach(input => {
    // Для демонстрации добавляем обработчик фокуса
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});