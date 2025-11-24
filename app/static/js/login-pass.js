document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const passwordInput = document.getElementById('password-input');
    const continueBtn = document.getElementById('continue-btn');
    
    console.log('Script loaded'); // Для отладки
    console.log('Password input:', passwordInput); // Для отладки
    console.log('Continue button:', continueBtn); // Для отладки
    
    // Функция для проверки валидности формы
    function validateForm() {
        const isPasswordValid = passwordInput.value.trim() !== '';
        
        console.log('Password value:', passwordInput.value); // Для отладки
        console.log('Is password valid:', isPasswordValid); // Для отладки
        
        continueBtn.disabled = !isPasswordValid;
        
        // Добавляем/убираем класс для визуального отображения состояния
        if (isPasswordValid) {
            continueBtn.classList.remove('disabled');
        } else {
            continueBtn.classList.add('disabled');
        }
    }
    
    // Слушатель события для поля пароля
    passwordInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('keyup', validateForm);
    passwordInput.addEventListener('change', validateForm);
    
    // Также проверяем при загрузке страницы (на случай автозаполнения)
    validateForm();
    
    // Дополнительная проверка при фокусе/потере фокуса
    passwordInput.addEventListener('focus', validateForm);
    passwordInput.addEventListener('blur', validateForm);
    
    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        // Дополнительная валидация перед отправкой
        if (!passwordInput.value.trim()) {
            e.preventDefault();
            alert('Please enter your password.');
            return;
        }
        
        // Если все хорошо, форма отправится автоматически
        console.log('Form submitting...');
    });
    
    // Принудительно вызываем валидацию после небольшой задержки
    // на случай автозаполнения браузером
    setTimeout(validateForm, 100);
});