class ModelLoader {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.currentSeries = this.getSeriesFromURL();
        this.currentFilters = this.getFiltersFromURL();
        this.seriesContainers = {};
        this.init();
    }

    init() {
        this.initializeSeriesContainers();
        this.loadSeriesCounts();
        this.loadModels();
        this.setupInfiniteScroll();
        this.setupFilterListeners();
        this.setInitialSelected();
        this.updateURL();
        this.showSelectedSeries();
    }

    initializeSeriesContainers() {
        const seriesElements = document.querySelectorAll('.model-catalog-series');
        seriesElements.forEach(container => {
            const series = container.dataset.series;
            this.seriesContainers[series] = {
                element: container,
                grid: container.querySelector('.model-catalog-grid'),
                header: container.querySelector('.models-catalog-header h2')
            };
        });
        
        this.seriesContainers['All'] = {
            element: document.querySelector('.models-catalog'),
            grid: null,
            header: null
        };
    }

    getSeriesFromURL() {
        const path = window.location.pathname;
        const seriesMatch = path.match(/\/models\/([^\/]+)/);
        return seriesMatch ? seriesMatch[1] : 'All';
    }

    getFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            bodyType: urlParams.get('bodyType') || '',
            wheelDrive: urlParams.get('wheelDrive') || ''
        };
    }

    setInitialSelected() {
        const radioToSelect = document.querySelector(`input[value="${this.currentSeries}"]`);
        if (radioToSelect) {
            radioToSelect.checked = true;
        } else {
            const allRadio = document.querySelector('input[value="All"]');
            if (allRadio) allRadio.checked = true;
        }
    }

    showSelectedSeries() {
        Object.keys(this.seriesContainers).forEach(series => {
            if (series === 'All') return;
            
            const container = this.seriesContainers[series].element;
            if (this.currentSeries === 'All' || this.currentSeries === series) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
    }

    async loadSeriesCounts() {
        try {
            const response = await fetch('/api/models/series-counts');
            const counts = await response.json();
            this.updateSeriesCounts(counts);
        } catch (error) {
            console.error('Error loading series counts:', error);
        }
    }

    updateSeriesCounts(counts) {
        const radioButtons = document.querySelectorAll('input[name="series"]');
        
        radioButtons.forEach(radio => {
            const value = radio.value;
            const span = radio.nextElementSibling.querySelector('.gray-text');
            if (counts[value]) {
                span.textContent = `(${counts[value]})`;
            }
        });
    }

    setupFilterListeners() {
        const radioButtons = document.querySelectorAll('input[name="series"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.currentSeries = e.target.value;
                    this.resetAndLoad();
                    this.updateURL();
                    this.showSelectedSeries();
                }
            });
        });
    }

    updateURL() {
        let newUrl = '/models';
        
        if (this.currentSeries !== 'All') {
            newUrl += `/${this.currentSeries}`;
        }
        
        const params = new URLSearchParams();
        if (this.currentFilters.bodyType) {
            params.set('bodyType', this.currentFilters.bodyType);
        }
        if (this.currentFilters.wheelDrive) {
            params.set('wheelDrive', this.currentFilters.wheelDrive);
        }
        
        const queryString = params.toString();
        if (queryString) {
            newUrl += `?${queryString}`;
        }
        
        window.history.pushState({}, '', newUrl);
    }

    resetAndLoad() {
        this.currentPage = 1;
        this.hasMore = true;
        
        Object.values(this.seriesContainers).forEach(container => {
            if (container.grid) {
                container.grid.innerHTML = '';
            }
        });
        
        this.loadModels();
    }

    setupInfiniteScroll() {
        const scrollHandler = () => {
            if (this.isLoading || !this.hasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollThreshold = 1000;

            if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
                this.loadModels();
            }
        };

        let isThrottled = false;
        window.addEventListener('scroll', () => {
            if (!isThrottled) {
                scrollHandler();
                isThrottled = true;
                setTimeout(() => { isThrottled = false; }, 100);
            }
        });
    }

    async loadModels() {
        if (this.isLoading || !this.hasMore) return;

        this.isLoading = true;
        this.showLoadingIndicator();

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                series: this.currentSeries
            });

            const response = await fetch(`/api/models?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            if (data.models && data.models.length > 0) {
                this.renderModels(data.models);
                this.currentPage++;
                this.hasMore = data.has_next;
            } else {
                this.hasMore = false;
                if (this.currentPage === 1) {
                    this.showNoModelsMessage();
                } else {
                    this.showNoMoreMessage();
                }
            }
        } catch (error) {
            console.error('Error loading models:', error);
            this.showErrorMessage();
        } finally {
            this.isLoading = false;
            this.hideLoadingIndicator();
        }
    }

    renderModels(models) {
        models.forEach(model => {
            const modelCard = this.createModelCard(model);
            
            let targetContainer = null;
            
            if (this.currentSeries === 'All') {
                targetContainer = this.seriesContainers[model.series];
                if (!targetContainer || !targetContainer.grid) {
                    console.warn(`No container found for series: ${model.series}, model: ${model.subseries}`);
                    return;
                }
            } else {
                targetContainer = this.seriesContainers[this.currentSeries];
            }
            
            if (targetContainer && targetContainer.grid) {
                targetContainer.grid.appendChild(modelCard);
            } else {
                console.warn(`No grid container found for series: ${model.series}`);
            }
        });
    }

    createModelCard(model) {
        const card = document.createElement('a');
        card.className = 'model-card';
        card.href = `#`;
        
        const engineType = this.getEngineType(model);
        const engineBadge = engineType === 'Electric' ? 'Electric' : 
                           engineType === 'Hybrid' ? 'Hybrid' : 'Gasoline';

        card.innerHTML = `
            <div class="model-card-header">
                <div class="car-type">
                    <span>${engineBadge}</span>
                </div>
                <img src="${this.getImageUrl(model)}" alt="${model.subseries}">
                <h2>${model.subseries}</h2>
            </div>
            <div class="dis-text">
                <p>${model.description}</p>
            </div>
            <ul class="top-spesh">
                <li>
                    <div class="top-spesh-bold">${model.to100} s</div>
                    <div class="top-spesh-nobold">Acceleration 0 - 100 km/h</div>
                </li>
                <li>
                    <div class="top-spesh-bold">${model.power}</div>
                    <div class="top-spesh-nobold">Power (kW) / Power (PS)</div>
                </li>
                <li>
                    <div class="top-spesh-bold">${model.top_speed} km/h</div>
                    <div class="top-spesh-nobold">Top speed</div>
                </li>
            </ul>
            <div class="model-btns">
                <button class="black-btn">Select Model</button>
                <button class="black-border-btn">Compare</button>
            </div>
        `;

        this.addButtonHandlers(card, model);
        return card;
    }

    getEngineType(model) {
        if (model.is_electric) return 'Electric';
        if (model.is_hybrid) return 'Hybrid';
        if (model.is_gazoline) return 'Gasoline';
        return 'Gasoline';
    }

    getImageUrl(model) {
        const modelName = model.subseries.replace(/\s+/g, '_');
        return `/static/img/cars/${model.series}/${modelName}.png`;
    }

    addButtonHandlers(card, model) {
        const selectBtn = card.querySelector('.black-btn');
        const compareBtn = card.querySelector('.black-border-btn');

        selectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSelectModel(model);
        });

        compareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCompareModel(model);
        });
    }

    handleSelectModel(model) {
        console.log('Selected model:', model);
    }

    handleCompareModel(model) {
        console.log('Compare model:', model);
    }

    showLoadingIndicator() {
        if (this.currentSeries === 'All') {
            Object.values(this.seriesContainers).forEach(container => {
                if (container.grid && container.element.style.display !== 'none') {
                    this.createLoadingIndicator(container.grid);
                }
            });
        } else {
            const activeContainer = this.seriesContainers[this.currentSeries];
            if (activeContainer && activeContainer.grid) {
                this.createLoadingIndicator(activeContainer.grid);
            }
        }
    }

    createLoadingIndicator(container) {
        let loader = container.querySelector('.loading-indicator');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'loading-indicator';
            loader.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Loading more models...</p>
            `;
            container.appendChild(loader);
        }
    }

    hideLoadingIndicator() {
        document.querySelectorAll('.loading-indicator').forEach(loader => {
            loader.remove();
        });
    }

    showNoMoreMessage() {
        if (this.currentSeries === 'All') {
            Object.values(this.seriesContainers).forEach(container => {
                if (container.grid && container.element.style.display !== 'none') {
                    this.createNoMoreMessage(container.grid);
                }
            });
        } else {
            const activeContainer = this.seriesContainers[this.currentSeries];
            if (activeContainer && activeContainer.grid) {
                this.createNoMoreMessage(activeContainer.grid);
            }
        }
    }

    createNoMoreMessage(container) {
        const message = document.createElement('div');
        message.className = 'no-more-message';
        message.innerHTML = '<p>All models loaded</p>';
        container.appendChild(message);
    }

    showNoModelsMessage() {
        const message = document.createElement('div');
        message.className = 'no-models-message';
        message.innerHTML = '<p>No models found in this category</p>';
        
        if (this.currentSeries === 'All') {
            Object.values(this.seriesContainers).forEach(container => {
                if (container.grid && container.element.style.display !== 'none') {
                    container.grid.appendChild(message.cloneNode(true));
                }
            });
        } else {
            const activeContainer = this.seriesContainers[this.currentSeries];
            if (activeContainer && activeContainer.grid) {
                activeContainer.grid.appendChild(message);
            }
        }
    }

    showErrorMessage() {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = '<p>Error loading models. Please try again.</p>';
        
        if (this.currentSeries === 'All') {
            Object.values(this.seriesContainers).forEach(container => {
                if (container.grid && container.element.style.display !== 'none') {
                    container.grid.appendChild(error.cloneNode(true));
                }
            });
        } else {
            const activeContainer = this.seriesContainers[this.currentSeries];
            if (activeContainer && activeContainer.grid) {
                activeContainer.grid.appendChild(error);
            }
        }
    }
}

window.addEventListener('popstate', () => {
    new ModelLoader();
});

document.addEventListener('DOMContentLoaded', () => {
    new ModelLoader();
});