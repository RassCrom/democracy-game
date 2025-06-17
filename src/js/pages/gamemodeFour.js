import maplibregl from 'maplibre-gl';

document.title = '🗺️ MapLe'

class GeographyGame {
    constructor() {
        this.countries = [];
        this.currentCountry = null;
        this.revealedFacts = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.gameActive = false;
        this.gameStarted = false;
        this.timer = null;
        this.map = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeMap();
        this.loadCountryData();
        this.geojsonLoaded = false;
        this.highlightedCountry = null;
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.factsContainer = document.getElementById('factsContainer');
        this.guessInput = document.getElementById('guessInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.helpModal = document.getElementById('helpModal');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.closeHelpBtn = document.getElementById('closeHelpBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.gameStartMessage = document.getElementById('gameStartMessage');
        this.guessSection = document.getElementById('guessSection');
    }

    setupEventListeners() {
        this.guessBtn.addEventListener('click', () => this.makeGuess());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
        this.startBtn.addEventListener('click', () => this.startNewGame());
        this.restartBtn.addEventListener('click', () => this.startNewGame());
        this.helpBtn.addEventListener('click', () => this.showModal('helpModal'));
        this.closeHelpBtn.addEventListener('click', () => this.hideModal('helpModal'));
        this.playAgainBtn.addEventListener('click', () => {
            this.hideModal('gameOverModal');
            this.startNewGame();
        });
    }

    initializeMap() {
        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [0, 20],
            zoom: 2,
            renderWorldCopies: false,
        });
    }

    async loadCountryData() {
        try {
            const response = await fetch('/democracy-game/assets/data/wm4.geojson');
            const geojsonData = await response.json();
            
            this.countries = geojsonData.features.map(feature => ({
                name: feature.properties.NAME || feature.properties.name,
                capital_name: feature.properties.city,
                country_population: feature.properties.POP_EST,
                gdp: feature.properties.GDP_MD,
                capital_population: feature.properties.population,
                main_language: feature.properties.WORLD_LANG,
                POLITICAL_: feature.properties.Political_,
                coordinates: feature.geometry ? this.getCentroid(feature.geometry) : [0, 0],
                geometry: feature.geometry
            })).filter(country => 
                country.name && 
                country.capital_name && 
                country.country_population
            );
            
            this.addGeojsonToMap(geojsonData);
            
            console.log(`Loaded ${this.countries.length} countries`);
        } catch (error) {
            console.error('Error loading country data:', error);
        }
    }

    addGeojsonToMap(geojsonData) {
        this.map.on('load', () => {
            // Add IDs to features
            geojsonData.features.forEach((feature, index) => {
                feature.id = index;
            });

            this.map.addSource('countries', {
                type: 'geojson',
                data: geojsonData
            });

            this.map.addLayer({
                id: 'countries-fill',
                type: 'fill',
                source: 'countries',
                paint: {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        '#16213e',
                        ['boolean', ['feature-state', 'selected'], false],
                        '#ff4757',
                        '#E39B6B'
                    ],
                    'fill-opacity': 0.7
                }
            });

            this.map.addLayer({
                id: 'countries-border',
                type: 'line',
                source: 'countries',
                paint: {
                    'line-color': '#ffffff',
                    'line-width': 1,
                    'line-opacity': 0.8
                }
            });

            this.setupMapInteractions();
            this.geojsonLoaded = true;
        });
    }

    setupMapInteractions() {
        let hoveredStateId = null;

        this.map.on('mousemove', 'countries-fill', (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    this.map.setFeatureState(
                        { source: 'countries', id: hoveredStateId },
                        { hover: false }
                    );
                }

                hoveredStateId = e.features[0].id;
                this.map.setFeatureState(
                    { source: 'countries', id: hoveredStateId },
                    { hover: true }
                );
            }

            this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', 'countries-fill', () => {
            if (hoveredStateId !== null) {
                this.map.setFeatureState(
                    { source: 'countries', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = null;
            this.map.getCanvas().style.cursor = '';
        });

        this.map.on('click', 'countries-fill', (e) => {
            if (!this.gameActive || !this.gameStarted) return;

            const feature = e.features[0];
            const countryName = feature.properties.NAME || feature.properties.name;
            
            if (countryName) {
                this.guessInput.value = countryName;
                this.highlightSelectedCountry(feature);
                this.makeGuess();
            }
        });
    }

    highlightSelectedCountry(feature) {
        // Clear previous selection
        if (this.highlightedCountry !== null) {
            this.map.setFeatureState(
                { source: 'countries', id: this.highlightedCountry },
                { selected: false }
            );
        }

        // Set new selection
        this.highlightedCountry = feature.id;
        this.map.setFeatureState(
            { source: 'countries', id: this.highlightedCountry },
            { selected: true }
        );
    }

    getCentroid(geometry) {
        if (geometry.type === 'Point') {
            return geometry.coordinates;
        }
        if (geometry.type === 'Polygon') {
            const coords = geometry.coordinates[0];
            let x = 0, y = 0;
            for (let coord of coords) {
                x += coord[0];
                y += coord[1];
            }
            return [x / coords.length, y / coords.length];
        }
        if (geometry.type === 'MultiPolygon') {
            const coords = geometry.coordinates[0][0];
            let x = 0, y = 0;
            for (let coord of coords) {
                x += coord[0];
                y += coord[1];
            }
            return [x / coords.length, y / coords.length];
        }
        return [0, 0];
    }

    generateRandomFacts(country) {
        const facts = [];
        
        const factGenerators = [
            () => `The capital city is ${country.capital_name}`,
            () => `The country is in ${country.Continent}`,
            () => `The population is approximately ${this.formatPopulation(country.country_population)}`,
            () => `The main language spoken is ${country.main_language}`,
            () => `The political system is ${country.POLITICAL_}`,
            () => `The capital has a population of about ${this.formatPopulation(country.capital_population)}`,
            () => `The GDP is approximately $${this.formatGDP(country.gdp)}`,
            () => `The country name starts with "${country.name.charAt(0)}"`,
            () => `The capital name starts with "${country.capital_name.charAt(0)}"`,
            () => country.country_population > 50000000 ? 
                "The population is more than 50 million" : 
                "The population is less than 50 million",
            () => country.capital_population > 2000000 ? 
                "The capital has more than 2 million residents" : 
                "The capital has less than 2 million residents"
        ];

        const shuffled = factGenerators.sort(() => 0.5 - Math.random());
        for (let i = 0; i < Math.min(5, shuffled.length); i++) {
            facts.push(shuffled[i]());
        }

        return facts;
    }

    formatPopulation(pop) {
        if (pop >= 1000000) {
            return (pop / 1000000).toFixed(1) + ' million';
        }
        return pop.toLocaleString();
    }

    formatGDP(gdp) {
        if (gdp >= 1000000000000) {
            return (gdp / 1000000000000).toFixed(1) + ' trillion';
        }
        if (gdp >= 1000000000) {
            return (gdp / 1000000000).toFixed(1) + ' billion';
        }
        return gdp.toLocaleString();
    }

    startNewGame() {
        if (this.countries.length === 0) {
            console.error('No countries loaded');
            return;
        }

        this.gameActive = true;
        this.gameStarted = true;
        this.revealedFacts = 0;
        this.timeLeft = 60;
        this.currentCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
        this.currentFacts = this.generateRandomFacts(this.currentCountry);
        
        this.gameStartMessage.style.display = 'none';
        this.factsContainer.style.display = 'block';
        this.guessSection.style.display = 'flex';
        this.startBtn.style.display = 'none';
        this.restartBtn.style.display = 'inline-block';
        
        this.factsContainer.innerHTML = '';
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;
        this.guessInput.classList.remove('correct-answer', 'wrong-answer');
        
        this.updateTimer();
        this.startTimer();
        this.revealNextFact();

        if (this.geojsonLoaded && this.highlightedCountry !== null) {
            this.map.setFeatureState(
                { source: 'countries', id: this.highlightedCountry },
                { selected: false }
            );
            this.highlightedCountry = null;
        }
        
        // Center map on the country
        // if (this.currentCountry.coordinates) {
        //     this.map.flyTo({
        //         center: this.currentCountry.coordinates,
        //         zoom: 5,
        //         duration: 2000
        //     });
        // }
    }

    revealNextFact() {
        if (this.revealedFacts < 5) {
            const factElement = document.createElement('div');
            factElement.className = 'fact-item';
            factElement.innerHTML = `
                <div class="fact-number">Fact ${this.revealedFacts + 1}</div>
                <div class="fact-text">${this.currentFacts[this.revealedFacts]}</div>
            `;
            
            this.factsContainer.appendChild(factElement);
            
            setTimeout(() => {
                factElement.classList.add('revealed');
            }, 100);
            
            this.revealedFacts++;
        } else if (this.revealedFacts === 5) {
            const shapeElement = document.createElement('div');
            shapeElement.className = 'fact-item';
            shapeElement.innerHTML = `
                <div class="fact-number">Final Clue - Country Shape</div>
                <div class="country-shape">
                    <div style="color: var(--green-color); font-size: 3rem; text-align: center;">
                        🗺️
                    </div>
                    <div style="text-align: center; margin-top: 1rem; opacity: 0.7;">
                        Country outline visualization
                    </div>
                </div>
            `;
            
            this.factsContainer.appendChild(shapeElement);
            
            setTimeout(() => {
                shapeElement.classList.add('revealed');
            }, 100);
            
            this.revealedFacts++;
        }
    }

    makeGuess() {
        if (!this.gameActive || !this.gameStarted) return;
        
        const guess = this.guessInput.value.trim().toLowerCase();
        const correctAnswer = this.currentCountry.name.toLowerCase();
        
        if (guess === correctAnswer) {
            this.handleCorrectGuess();
        } else {
            this.handleWrongGuess();
        }
    }

    handleCorrectGuess() {
        this.gameActive = false;
        this.stopTimer();
        
        const baseScore = Math.max(10, 110 - (this.revealedFacts * 20));
        this.score += baseScore;
        
        this.guessInput.classList.add('correct-answer');
        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;

        if (this.geojsonLoaded) {
            const correctFeature = this.map.querySourceFeatures('countries', {
                filter: ['==', ['get', 'NAME'], this.currentCountry.name]
            })[0];
            
            if (correctFeature) {
                this.highlightSelectedCountry(correctFeature);
            }
        }
        
        setTimeout(() => {
            this.showGameOver(true, baseScore);
        }, 1500);
    }

    handleWrongGuess() {
        this.guessInput.classList.add('wrong-answer');
        this.guessInput.value = '';
        
        setTimeout(() => {
            this.guessInput.classList.remove('wrong-answer');
        }, 1000);
        
        if (this.revealedFacts < 6) {
            this.revealNextFact();
        }
        
        if (this.revealedFacts >= 6) {
            this.gameActive = false;
            this.stopTimer();
            setTimeout(() => {
                this.showGameOver(false, 0);
            }, 1500);
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.gameActive = false;
                this.stopTimer();
                this.showGameOver(false, 0);
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimer() {
        this.timerElement.textContent = this.gameStarted ? this.timeLeft : '60';
        if (this.timeLeft <= 10) {
            this.timerElement.style.color = 'var(--red-color)';
        } else if (this.timeLeft <= 30) {
            this.timerElement.style.color = 'var(--orange-color)';
        } else {
            this.timerElement.style.color = 'var(--green-color)';
        }
    }

    showGameOver(won, pointsEarned) {
        const title = document.getElementById('gameOverTitle');
        const text = document.getElementById('gameOverText');
        const scoreDisplay = document.getElementById('scoreDisplay');
        
        if (won) {
            title.textContent = '🎉 Congratulations!';
            text.innerHTML = `
                <p>You correctly guessed <strong>${this.currentCountry.name}</strong>!</p>
                <p>You earned <strong>${pointsEarned}</strong> points with ${this.revealedFacts} facts revealed.</p>
            `;
        } else {
            title.textContent = '⏰ Time\'s Up!';
            text.innerHTML = `
                <p>The correct answer was <strong>${this.currentCountry.name}</strong>.</p>
                <p>Better luck next time!</p>
            `;
        }
        
        scoreDisplay.innerHTML = `
            <div class="score-item">
                <span class="score-label">Total Score:</span>
                <span class="score-value">${this.score} points</span>
            </div>
            <div class="score-item">
                <span class="score-label">Facts Revealed:</span>
                <span class="score-value">${this.revealedFacts}/6</span>
            </div>
            <div class="score-item">
                <span class="score-label">Time Remaining:</span>
                <span class="score-value">${this.timeLeft} seconds</span>
            </div>
        `;
        
        this.showModal('gameOverModal');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GeographyGame();
});