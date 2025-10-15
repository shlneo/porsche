document.addEventListener('DOMContentLoaded', function() {
    // Код для работы с видео
    const video = document.querySelector('video');
    const pauseBtn = document.querySelector('.video-cont-pouse-btn a');
    
    pauseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (video.paused) {
            video.play();
            this.textContent = '❚❚';
        } else {
            video.pause();
            this.textContent = '▶';
        }
    });
});