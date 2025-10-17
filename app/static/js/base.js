const menuBtn = document.getElementById('dop-menu-btn');
const closeBtn = document.getElementById('close-menu');
const overlay = document.getElementById('overlay');
const body = document.body;

function disableScroll() {
    body.style.overflow = 'hidden';
    body.style.height = '100vh';
}

function enableScroll() {
    body.style.overflow = '';
    body.style.height = '';
}

menuBtn.addEventListener('click', function() {
    body.classList.add('menu-open');
    disableScroll();
});

closeBtn.addEventListener('click', function() {
    body.classList.remove('menu-open');
    enableScroll();
});

overlay.addEventListener('click', function() {
    body.classList.remove('menu-open');
    enableScroll();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        body.classList.remove('menu-open');
        enableScroll();
    }
});


document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.side-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab') + '-tab';
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
});