const messageFlash = (function() {
    const containerId = 'flash-container';
    let container;
    let messages = []; 
    const DISPLAY_TIME = 10000; 

    function init() {
        container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);
        }

        const storedMessages = JSON.parse(localStorage.getItem('flashMessages') || '[]');
        const now = Date.now();
        messages = storedMessages.filter(msg => now - msg.createdAt < DISPLAY_TIME);

        localStorage.setItem('flashMessages', JSON.stringify(messages));
        renderMessages();
    }

    function _showMessage(msgObj) {
    }

    function removeMessage(alertBox, msgObj) {
    }

    function addMessage(msg, type='success') {
    }

    function renderMessages() {
    }

    return { init, addMessage };
})();


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
  const carCards = document.querySelectorAll('.car-card');
  const modelDetailTab = document.getElementById('model-detail-tab');
  const modelDetailContent = document.querySelector('.model-detail-content');
  
  const modelData = {
    '718': {
      title: '718',
      fuelType: 'Gasoline',
      variants: [
        {
          name: 'Cayman',
          variantsCount: '4 Model variants',
          fuelType: 'Gasoline'
        },
        {
          name: 'Boxster', 
          variantsCount: '4 Model variants',
          fuelType: 'Gasoline'
        }
      ]
    },
    '911': {
      title: '911',
      fuelType: 'Gasoline',
      variants: [
        {
          name: 'Carrera',
          variantsCount: '6 Model variants',
          fuelType: 'Gasoline'
        },
        {
          name: 'Carrera Cabriolet',
          variantsCount: '6 Model variants', 
          fuelType: 'Gasoline'
        },
        {
          name: 'Targa 4S',
          variantsCount: '2 Model variants',
          fuelType: 'Gasoline'
        }
      ]
    },
    'taycan': {
      title: 'Taycan',
      fuelType: 'Electric',
      variants: [
        {
          name: 'Taycan',
          variantsCount: '5 Model variants',
          fuelType: 'Electric'
        },
        {
          name: 'Taycan Sport Turismo',
          variantsCount: '4 Model variants',
          fuelType: 'Electric'
        }
      ]
    },
    'panamera': {
      title: 'Panamera',
      fuelType: 'Hybrid | Gasoline',
      variants: [
        {
          name: 'Panamera',
          variantsCount: '8 Model variants',
          fuelType: 'Hybrid | Gasoline'
        },
        {
          name: 'Panamera 4 E-Hybrid',
          variantsCount: '6 Model variants',
          fuelType: 'Hybrid | Gasoline'
        }
      ]
    },
    'macan': {
      title: 'Macan',
      fuelType: 'Electric',
      variants: [
        {
          name: 'Macan Electric',
          variantsCount: '3 Model variants',
          fuelType: 'Electric'
        }
      ]
    },
    'cayenne': {
      title: 'Cayenne',
      fuelType: 'Hybrid | Gasoline',
      variants: [
        {
          name: 'Cayenne',
          variantsCount: '7 Model variants',
          fuelType: 'Hybrid | Gasoline'
        },
        {
          name: 'Cayenne Coupé',
          variantsCount: '5 Model variants',
          fuelType: 'Hybrid | Gasoline'
        }
      ]
    }
  };

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab') + '-tab';
      modelDetailTab.classList.remove('active');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  carCards.forEach(card => {
    card.addEventListener('click', function() {
      const modelId = this.getAttribute('data-model');
      const model = modelData[modelId];
      
      if (model) {
        modelDetailContent.innerHTML = `
          <div class="model-signatures-menu">
            <img src="/static/img/model-signatures/${model.title}.svg">
            <button class="back-btn arrow-area" onclick="window.location.href='/models'">
              <p>Model overview</p>
              <img style="transform: rotate(180deg);" src="/static/img/back-icon.svg">
            </button>
          </div>
          <div class="model-variants-list">
            ${model.variants.map(variant => `     
              <div class="car-card">
                <p class="model-name">${variant.name}</p>
                <p class="model-count">${variant.variantsCount}</p>
                <img src="/static/img/cars/${model.title}/${variant.name}.png">
                <div class="car-types">
                  ${variant.fuelType.split(' | ').map(fuel => 
                    `<span>${fuel.trim()}</span>`
                  ).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `;
        
        tabContents.forEach(content => content.classList.remove('active'));
        modelDetailTab.classList.add('active');
        updateLeftSideForModel(modelId);
      }
    });
  });

  function updateLeftSideForModel(activeModelId) {
    const leftSideButtons = document.querySelector('.left-side-buttons');

    if (!window.originalLeftSideButtons) {
      window.originalLeftSideButtons = leftSideButtons.innerHTML;
    }
    
    let newLeftSideHTML = '';
    newLeftSideHTML += `
      <button class="back-btn arrow-area back-to-models">
        <img src="/static/img/back-icon.svg">
        <p>Models</p>
      </button>
    `;

    Object.keys(modelData).forEach(modelId => {
      const isActive = modelId === activeModelId;
      newLeftSideHTML += `
        <button class="side-button ${isActive ? 'active' : ''}" data-model="${modelId}">
          <div class = "side-button-info">
            <p>${modelData[modelId].title}</p>
            <img src="/static/img/arrow2.svg">
          </div>
        </button>
      `;
    });
    
    leftSideButtons.innerHTML = newLeftSideHTML;
    
    const backButton = leftSideButtons.querySelector('.back-to-models');
    backButton.addEventListener('click', function() {
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById('models-tab').classList.add('active');
      resetLeftSide();
    });

    const modelButtons = leftSideButtons.querySelectorAll('.side-button[data-model]');
    modelButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modelId = this.getAttribute('data-model');
        const model = modelData[modelId];
        
        if (model) {
          modelDetailContent.innerHTML = `
            <div class="model-signatures-menu">
              <img src="/static/img/model-signatures/${model.title}.svg">
              <button class="back-btn arrow-area" onclick="window.location.href='/models'">
                <p>Model overview</p>
                <img style="transform: rotate(180deg);" src="/static/img/back-icon.svg">
              </button>
            </div>
            <div class="model-variants-list">
              ${model.variants.map(variant => `     
                <div class="car-card">
                  <p class="model-name">${variant.name}</p>
                  <p class="model-count">${variant.variantsCount}</p>
                  <img src="/static/img/cars/${model.title}/${variant.name}.png">
                  <div class="car-types">
                    ${variant.fuelType.split(' | ').map(fuel => 
                      `<span>${fuel.trim()}</span>`
                    ).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          `;
          
          tabContents.forEach(content => content.classList.remove('active'));
          modelDetailTab.classList.add('active');
          updateLeftSideForModel(modelId);
        }
      });
    });
  }

  function resetLeftSide() {
    if (window.originalLeftSideButtons) {
      document.querySelector('.left-side-buttons').innerHTML = window.originalLeftSideButtons;

      const originalButtons = document.querySelectorAll('.side-button');
      originalButtons.forEach(button => {
        button.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab') + '-tab';
          
          modelDetailTab.classList.remove('active');
          
          originalButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          tabContents.forEach(content => content.classList.remove('active'));
          document.getElementById(tabId).classList.add('active');
        });
      });
      
      const restoredCarCards = document.querySelectorAll('.car-card');
      restoredCarCards.forEach(card => {
        card.addEventListener('click', function() {
          const modelId = this.getAttribute('data-model');
          const model = modelData[modelId];
          
          if (model) {
            modelDetailContent.innerHTML = `
              <div class="model-signatures-menu">
                <img src="/static/img/model-signatures/${model.title}.svg">
                <button class="back-btn arrow-area" onclick="window.location.href='/models'">
                  <p>Model overview</p>
                  <img style="transform: rotate(180deg);" src="/static/img/back-icon.svg">
                </button>
              </div>
              <div class="model-variants-list">
                ${model.variants.map(variant => `     
                  <div class="car-card">
                    <p class="model-name">${variant.name}</p>
                    <p class="model-count">${variant.variantsCount}</p>
                    <img src="/static/img/cars/${model.title}/${variant.name}.png">
                    <div class="car-types">
                      ${variant.fuelType.split(' | ').map(fuel => 
                        `<span>${fuel.trim()}</span>`
                      ).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            `;
            
            tabContents.forEach(content => content.classList.remove('active'));
            modelDetailTab.classList.add('active');
            updateLeftSideForModel(modelId);
          }
        });
      });
    }
  }
});