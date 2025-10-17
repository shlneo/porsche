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

document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.Car-Range-row');

  rows.forEach(row => {
    const models = row.querySelectorAll('.car-model');

    models.forEach(model => {
      const video = model.querySelector('.car-video');
      const videoSrc = model.dataset.video;

      model.addEventListener('mouseenter', () => {
        model.classList.add('active');
        models.forEach(m => {
          if (m !== model) m.classList.add('shrink');
        });
        video.src = videoSrc;
        video.play();
      });

      model.addEventListener('mouseleave', () => {
        model.classList.remove('active');
        models.forEach(m => m.classList.remove('shrink'));
        video.pause();
        video.currentTime = 0;
      });
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
    const cardsGrid = document.querySelector('.text-under-cards');
    const yourP = document.querySelector('.yuor-p');
    const discover = document.querySelector('.discover-cont');
    const body = document.body;
    
    if (!cardsGrid) return;
    
    function handleScroll() {
        const rect = cardsGrid.getBoundingClientRect();
        const rect2 = discover.getBoundingClientRect();
        if (rect.top < 0 ) {
            body.style.backgroundColor = '#0e0e12';
            body.style.transition = 'background-color 0.8s ease';
            if (yourP) {
                yourP.style.color = '#ffffff';
                yourP.style.transition = 'color 0.8s ease';
            }
        } else {
            body.style.backgroundColor = '#ffffff';
            body.style.transition = 'background-color 0.8s ease';
            if (yourP) {
                yourP.style.color = '#000000';
                yourP.style.transition = 'color 0.8s ease';
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
});