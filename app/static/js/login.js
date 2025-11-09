function loadCaptcha() {
    fetch('/get_captcha')
        .then(response => response.json())
        .then(data => {
            const captchaImg = document.getElementById('captcha-image');
            captchaImg.src = data.captcha_image;
            captchaImg.style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading CAPTCHA:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const porscheIdInput = document.getElementById('porsche-id');
    const captchaInput = document.getElementById('captcha-input');
    const loginBtn = document.getElementById('login-btn');
    const refreshCaptchaBtn = document.getElementById('refresh-captcha');
    
    // Загружаем CAPTCHA при загрузке страницы
    loadCaptcha();
    
    // Обработчик для кнопки обновления CAPTCHA
    refreshCaptchaBtn.addEventListener('click', function() {
        loadCaptcha();
        captchaInput.value = ''; // Очищаем поле ввода CAPTCHA
        validateForm(); // Обновляем состояние кнопки
    });
    
    // Функция для проверки валидности формы
    function validateForm() {
        const isPorscheIdValid = porscheIdInput.value.trim() !== '';
        const isCaptchaValid = captchaInput.value.trim() !== '';
        
        loginBtn.disabled = !(isPorscheIdValid && isCaptchaValid);
    }
    
    // Слушатели событий для полей ввода
    porscheIdInput.addEventListener('input', validateForm);
    captchaInput.addEventListener('input', validateForm);
    
    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Дополнительная валидация перед отправкой
        if (!porscheIdInput.value.trim() || !captchaInput.value.trim()) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Отправка формы
        form.submit();
    });
    
    // Инициализация состояния кнопки
    validateForm();
});