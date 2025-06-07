import maplibregl from 'maplibre-gl';

class GameNotification {
    constructor() {
        this.container = null;
        this.overlay = null;
        this.currentNotification = null;
        this.init();
    }

    init() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'notification-overlay';
        document.body.appendChild(this.overlay);

        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    show(options) {
        if (this.currentNotification) {
            this.hide();
        }

        const {
            type = 'success',
            title = '',
            message = '',
            stats = null,
            duration = null,
            onClose = null
        } = options;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: '🎉',
            warning: '⏰',
            error: '❌'
        };

        let html = `
            <div class="notification-icon">${icons[type]}</div>
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;

        if (stats) {
            html += '<div class="notification-stats">';
            stats.forEach(stat => {
                html += `
                    <div class="stat-item">
                        <span class="stat-value">${stat.value}</span>
                        <span class="stat-label">${stat.label}</span>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '<button class="notification-button" onclick="gameNotification.hide()">Continue</button>';

        notification.innerHTML = html;
        this.container.appendChild(notification);
        this.currentNotification = notification;

        this.overlay.classList.add('show');
        notification.classList.add('show');

        if (duration) {
            setTimeout(() => this.hide(), duration);
        }

        this.onCloseCallback = onClose;
    }

    hide() {
        if (!this.currentNotification) return;

        this.overlay.classList.remove('show');
        this.overlay.classList.add('hide');
        this.currentNotification.classList.remove('show');
        this.currentNotification.classList.add('hide');

        setTimeout(() => {
            if (this.currentNotification) {
                this.container.removeChild(this.currentNotification);
                this.currentNotification = null;
            }
            this.overlay.classList.remove('hide');
            
            if (this.onCloseCallback) {
                this.onCloseCallback();
                this.onCloseCallback = null;
            }
        }, 400);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

window.gameNotification = new GameNotification();

export function setTime() {
    switch (savedSettings['Timer'] || '30 seconds') {
        case '30 seconds':
            timeLeft = 30;
            break;
        case '1 minute':
            timeLeft = 60;
            break;
        case '2 minutes':
            timeLeft = 120;
            break;
        case '3 minutes':
            timeLeft = 180;
            break;
        case '4 minutes':
            timeLeft = 240;
            break;
        case '5 minutes':
            timeLeft = 300;
            break;
        default:
            timeLeft = 120;
    }

    return timeLeft
}

const systemNameDisplayElement = document.querySelector('.heading');
const counterElement = document.querySelector('.top-info-bar .counter');
const timerElement = document.querySelector('.top-info-bar .timer');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
let timerInterval;

const savedSettings = JSON.parse(localStorage.getItem('gameSettings'));
// console.log(savedSettings['Timer'])

var map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [80, 30],
    zoom: 1,
    maxZoom: 5,
    attributionControl: false,
    renderWorldCopies: false
});

let availableGameChallenges = [];
let currentGameChallenge = null;
let correctClicks = 0;
let timeLeft;
let clickedCountries = new Set();
let gameActive = false;
let hoveredCountryId = null;

startButton.disabled = true;
endButton.disabled = true;

setTime();

fetch('/democracy-game/assets/data/wm2.geojson')
    .then(res => res.json())
    .then(data => {
        const politicalDataAggregator = {};

        data.features.forEach(feature => {
            if (feature.properties) {
                for (const propKey in feature.properties) {
                    if (propKey.startsWith('Political_')) {
                        const systemValue = feature.properties[propKey].trim();
                        if (systemValue !== null && systemValue !== 'N/A') {
                            if (!politicalDataAggregator[propKey]) {
                                politicalDataAggregator[propKey] = {};
                            }
                            if (!politicalDataAggregator[propKey][systemValue]) {
                                politicalDataAggregator[propKey][systemValue] = 0;
                            }
                            politicalDataAggregator[propKey][systemValue]++;
                        }
                    }
                }
            }
        });

        for (const propKey in politicalDataAggregator) {
            for (const systemValue in politicalDataAggregator[propKey]) {
                if (politicalDataAggregator[propKey][systemValue] > 0) {
                    availableGameChallenges.push({
                        propertyKey: propKey,
                        systemValue: systemValue,
                        count: politicalDataAggregator[propKey][systemValue]
                    });
                }
            }
        }

        if (availableGameChallenges.length > 0) {
            startButton.disabled = false;
        }

        map.on('load', () => {
            // Remove all symbol layers (text, icons) from the base map for a cleaner look
            const style = map.getStyle();
            if (style && style.layers) {
                const layersToRemove = style.layers.filter(layer => layer.type === 'symbol').map(layer => layer.id);
                layersToRemove.forEach(id => {
                    if (map.getLayer(id)) {
                        map.removeLayer(id);
                    }
                });
            }

            map.setPaintProperty('water', 'fill-color', '#342F33');
            map.addSource('countries', {
                'type': 'geojson',
                'data': data,
                'promoteId': 'ADMIN'
            });

            map.addLayer({
                'id': 'countries-layer',
                'type': 'fill',
                'source': 'countries',
                'paint': {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'incorrect_click'], false], '#FF3860',
                        ['boolean', ['feature-state', 'clicked'], false], '#47E18D',
                        '#FFEEE2'
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'incorrect_click'], false], 0.9,
                        ['boolean', ['feature-state', 'clicked'], false], 0.8,
                        ['boolean', ['feature-state', 'hover'], false], 1,
                        0.9
                    ],
                    'fill-outline-color': '#342F33'
                }
            });

            map.addLayer({
                'id': 'countries-lines',
                'type': 'line',
                'source': 'countries',
                'layout': {},
                'paint': {
                    'line-color': '#342F33',
                    'line-width': [
                        'case',
                        ['boolean', ['feature-state', 'clicked'], false],
                        1,
                        ['boolean', ['feature-state', 'hover'], false],
                        1.5,
                        0.5
                    ]
                }
            });

            data.features.forEach(feature => {
                if (feature.properties && feature.properties.ADMIN) {
                    map.setFeatureState(
                        { source: 'countries', id: feature.properties.ADMIN },
                        { hover: false, clicked: false, incorrect_click: false }
                    );
                }
            });

            const popup = new maplibregl.Popup({
                className: 'custom-country-popup',
                closeButton: false,
                closeOnClick: false
            });

            map.on('mousemove', 'countries-layer', (e) => {
                if (e.features.length > 0) {
                    const currentFeatureId = e.features[0].id;
                    map.getCanvas().style.cursor = 'pointer';

                    if (hoveredCountryId !== null && hoveredCountryId !== currentFeatureId) {
                        map.setFeatureState(
                            { source: 'countries', id: hoveredCountryId },
                            { hover: false }
                        );
                    }

                    map.setFeatureState(
                        { source: 'countries', id: currentFeatureId },
                        { hover: true }
                    );
                    hoveredCountryId = currentFeatureId;

                    const countryName = e.features[0].properties.ADMIN;
                    popup.setLngLat(e.lngLat).setHTML(countryName).addTo(map);
                } else {
                    map.getCanvas().style.cursor = '';
                    if (hoveredCountryId !== null) {
                        map.setFeatureState(
                            { source: 'countries', id: hoveredCountryId },
                            { hover: false }
                        );
                        hoveredCountryId = null;
                    }
                    popup.remove();
                }
            });

            map.on('mouseleave', 'countries-layer', () => {
                map.getCanvas().style.cursor = '';
                if (hoveredCountryId !== null) {
                    map.setFeatureState(
                        { source: 'countries', id: hoveredCountryId },
                        { hover: false }
                    );
                    hoveredCountryId = null;
                }
                popup.remove();
            });

            map.on('click', 'countries-layer', (e) => {
                if (gameActive && e.features.length > 0) {
                    const feature = e.features[0];
                    const countryName = feature.properties.ADMIN;

                    if (clickedCountries.has(countryName)) {
                        return;
                    }

                    if (feature.properties[currentGameChallenge.propertyKey] === currentGameChallenge.systemValue) {
                        correctClicks++;
                        clickedCountries.add(countryName);
                        map.setFeatureState(
                            { source: 'countries', id: countryName },
                            { clicked: true, hover: false }
                        );
                        if (hoveredCountryId === countryName) {
                            hoveredCountryId = null;
                        }

                        updateCounter();

                        if (correctClicks === currentGameChallenge.count) {
                            endGame(true);
                        }
                    } else {
                        const countryId = countryName;

                        map.setFeatureState({ source: 'countries', id: countryId }, { incorrect_click: true });

                        // setTimeout(() => {
                        //     if (map.getSource('countries') && map.getFeatureState({ source: 'countries', id: countryId })) {
                        //         map.setFeatureState({ source: 'countries', id: countryId }, { incorrect_click: false });
                        //     }
                        // }, 300);
                    }
                }
            });
        });
    })
    .catch(err => console.error('failed to load geojson', err));

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateCounter() {
    counterElement.textContent = `${correctClicks.toString().padStart(2, '0')}/${currentGameChallenge.count.toString().padStart(2, '0')}`;
}

function startGame() {
    setTime();
    if (availableGameChallenges.length === 0) {
        gameNotification.show({
            type: 'error',
            title: 'No Challenges',
            message: 'No game challenges available to start the game.'
        });
        return;
    }
    gameActive = true;
    startButton.disabled = true;
    endButton.disabled = false;

    if (map.getSource('countries')) {
        map.removeFeatureState({ source: 'countries' });
    }
    clickedCountries.clear();
    hoveredCountryId = null;

    const randomIndex = Math.floor(Math.random() * availableGameChallenges.length);
    currentGameChallenge = availableGameChallenges[randomIndex];

    correctClicks = 0;

    systemNameDisplayElement.textContent = `${currentGameChallenge.systemValue.toUpperCase()}`;
    updateCounter();

    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(allFound = false) {
    clearInterval(timerInterval);
    gameActive = false;
    startButton.disabled = false;
    endButton.disabled = true;

    if (allFound) {
        gameNotification.show({
            type: 'success',
            title: 'Perfect Score!',
            message: `Congratulations! You found all ${currentGameChallenge.count} ${currentGameChallenge.systemValue.toLowerCase()} countries!`,
            stats: [
                { value: `${correctClicks}/${currentGameChallenge.count}`, label: 'Found' },
                { value: '100%', label: 'Score' },
                { value: gameNotification.formatTime(timeLeft), label: 'Time Left' }
            ]
        });
    } else if (timeLeft <= 0) {
        const percentage = Math.round((correctClicks / currentGameChallenge.count) * 100);
        gameNotification.show({
            type: 'error',
            title: 'Time\'s Up!',
            message: `You found ${correctClicks} out of ${currentGameChallenge.count} ${currentGameChallenge.systemValue.toLowerCase()} countries`,
            stats: [
                { value: `${correctClicks}/${currentGameChallenge.count}`, label: 'Found' },
                { value: `${percentage}%`, label: 'Final Score' },
                { value: '00:00', label: 'Time Left' }
            ]
        });
    } else {
        const percentage = Math.round((correctClicks / currentGameChallenge.count) * 100);
        gameNotification.show({
            type: 'warning',
            title: 'Game Ended',
            message: `You found ${correctClicks} out of ${currentGameChallenge.count} ${currentGameChallenge.systemValue.toLowerCase()} countries`,
            stats: [
                { value: `${correctClicks}/${currentGameChallenge.count}`, label: 'Found' },
                { value: `${percentage}%`, label: 'Score' },
                { value: gameNotification.formatTime(timeLeft), label: 'Time Left' }
            ]
        });
    }

    setTimeout(() => {
        systemNameDisplayElement.textContent = "SYSTEM TYPE";
        counterElement.textContent = "00/00";
        timerElement.textContent = "00:00";
    }, 100);
}

startButton.addEventListener('click', startGame);
endButton.addEventListener('click', () => {
    if (gameActive) {
        endGame(false);
    }
});

window.addEventListener('resize', function () {
    if (map) {
        map.resize();
    }
});

updateTimerDisplay();