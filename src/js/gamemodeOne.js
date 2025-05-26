var map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [80, 30],
    zoom: 1,
    attributionControl: false,
    //renderWorldCopies: false
});


const container = document.getElementById('map');
const systemNameDisplayElement = document.querySelector('.system-name');
const counterElement = document.querySelector('.top-info-bar .counter');
const timerElement = document.querySelector('.top-info-bar .timer');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');

let availableGameChallenges = [];
let currentGameChallenge = null;
let correctClicks = 0;
let timeLeft = 120;
let clickedCountries = new Set();
let gameActive = false;
let hoveredCountryId = null;

startButton.disabled = true;
endButton.disabled = true;


fetch('../../public/assets/data/WorldBaseMap/Countries_Info.geojson')
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
                        ['boolean', ['feature-state', 'clicked'], false],
                        '#47E18D',
                        '#FFEEE2'
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'clicked'], false],
                        0.7,
                        ['boolean', ['feature-state', 'hover'], false],
                        1,
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
                        { hover: false, clicked: false }
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
    if (availableGameChallenges.length === 0) {
        alert("No game challenges available to start the game.");
        return;
    }
    gameActive = true;
    startButton.disabled = true;
    endButton.disabled = false;

    if (map.getSource('countries')) {
        clickedCountries.forEach(countryId => {
            map.setFeatureState(
                { source: 'countries', id: countryId },
                { clicked: false, hover: false }
            );
        });
        if (hoveredCountryId !== null) {
            map.setFeatureState(
                { source: 'countries', id: hoveredCountryId },
                { hover: false }
            );
            hoveredCountryId = null;
        }
    }
    clickedCountries.clear();

    const randomIndex = Math.floor(Math.random() * availableGameChallenges.length);
    currentGameChallenge = availableGameChallenges[randomIndex];

    correctClicks = 0;

    systemNameDisplayElement.textContent = `${currentGameChallenge.systemValue.toUpperCase()}`;
    updateCounter();

    timeLeft = 120;
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

    let message = "";
    if (allFound) {
        message = `Congratulations! You found all ${currentGameChallenge.count} ${currentGameChallenge.systemValue} countries!`;
    } else if (timeLeft <= 0) {
        message = `Time's up! You found ${correctClicks} out of ${currentGameChallenge.count} ${currentGameChallenge.systemValue} countries.`;
    } else {
        message = `Game over. You found ${correctClicks} out of ${currentGameChallenge.count} ${currentGameChallenge.systemValue} countries.`;
    }

    setTimeout(() => {
        alert(message);
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


