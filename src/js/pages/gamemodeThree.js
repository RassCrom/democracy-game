import maplibregl from 'maplibre-gl';

const timerLocal = JSON.parse(localStorage.getItem('gameSettings'))['Timer'] || '30 seconds';
function setTime() {
    switch (timerLocal) {
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

// Expanded game data with more countries
const gameData = [
    {
        "name": "Charles de Gaulle",
        "country": "France",
        "quote": "How can you govern a country with 246 types of cheese?",
        "image": "degoll.jpg"
    },
    {
        "name": "Francisco Franco",
        "country": "Spain",
        "quote": "Our regime is based on bayonets and blood, not on hypocritical elections.",
        "image": "franko.jpg"
    },
    {
        "name": "Winston Churchill",
        "country": "United Kingdom",
        "quote": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "image": "churchil.png"
    },
    {
        "name": "Benito Mussolini",
        "country": "Italy",
        "quote": "It is better to live one day as a lion than 100 years as a sheep.",
        "image": "mussolini.jpg"
    },
    {
        "name": "Adolf Hitler",
        "country": "Germany",
        "quote": "The victor will never be asked if he told the truth.",
        "image": "hitler.webp"
    },
    {
        "name": "Joseph Stalin",
        "country": "Russia",
        "quote": "A single death is a tragedy; a million deaths is a statistic.",
        "image": "stalin.jpg"
    },
    {
        "name": "Józef Piłsudski",
        "country": "Poland",
        "quote": "To be defeated and not submit, is victory; to be victorious and rest on one's laurels, is defeat.",
        "image": "pilsudski.jpg"
    },
    {
        "name": "Salazar",
        "country": "Portugal",
        "quote": "Politics is the art of the impossible.",
        "image": "salazar.jpg"
    },
    {
        "name": "Engelbert Dollfuss",
        "country": "Austria",
        "quote": "Austria must remain Austrian.",
        "image": "dollfuss.jpg"
    },
    {
        "name": "Ante Pavelić",
        "country": "Croatia",
        "quote": "Croatia has always been a nation of warriors.",
        "image": "pavelic.jpg"
    },
    {
        "name": "Ion Antonescu",
        "country": "Romania",
        "quote": "Romania's destiny is tied to the Axis powers.",
        "image": "antonescu.jpg"
    },
    {
        "name": "Miklós Horthy",
        "country": "Hungary",
        "quote": "Hungary must regain its former glory.",
        "image": "horthy.jpg"
    },
    {
        "name": "King Boris III",
        "country": "Bulgaria",
        "quote": "Bulgaria's independence is paramount.",
        "image": "boris.jpg"
    },
    {
        "name": "Ioannis Metaxas",
        "country": "Greece",
        "quote": "Greece will never surrender its freedom.",
        "image": "metaxas.jpg"
    },
    {
        "name": "Vidkun Quisling",
        "country": "Norway",
        "quote": "Norway's future lies with the new Europe.",
        "image": "quisling.jpg"
    },
    {
        "name": "Carl Gustaf Mannerheim",
        "country": "Finland",
        "quote": "Finland must defend its independence at all costs.",
        "image": "mannerheim.jpg"
    },
    {
        "name": "King Leopold III",
        "country": "Belgium",
        "quote": "Belgium's neutrality must be preserved.",
        "image": "leopold.jpg"
    },
    {
        "name": "Queen Wilhelmina",
        "country": "Netherlands",
        "quote": "The Netherlands will never bow to tyranny.",
        "image": "wilhelmina.jpg"
    },
    {
        "name": "Per Albin Hansson",
        "country": "Sweden",
        "quote": "Sweden's neutrality serves the cause of peace.",
        "image": "hansson.jpg"
    },
    {
        "name": "Christian X",
        "country": "Denmark",
        "quote": "Denmark stands with its people in all circumstances.",
        "image": "christian.jpg"
    },
        {
        "name": "Édouard Daladier",
        "country": "France",
        "quote": "We have won the peace.",
        "image": "daladier.jpg"
    },
    {
        "name": "Neville Chamberlain",
        "country": "United Kingdom",
        "quote": "Peace for our time.",
        "image": "chamberlain.jpg"
    },
    {
        "name": "Eduard Beneš",
        "country": "Czechoslovakia",
        "quote": "A diplomat must always think twice before he says nothing.",
        "image": "benes.jpg"
    },
    {
        "name": "Alexander I",
        "country": "Yugoslavia",
        "quote": "Yugoslavia must be united, or it will fall apart.",
        "image": "alexander.jpg"
    },
    {
        "name": "Aristide Briand",
        "country": "France",
        "quote": "The League of Nations is the hope of civilization.",
        "image": "briand.jpg"
    },
    {
        "name": "Alcide De Gasperi",
        "country": "Italy",
        "quote": "The future will not be built on hate but on hope.",
        "image": "degasperi.jpg"
    },
    {
        "name": "Otto von Habsburg",
        "country": "Austria",
        "quote": "The nations of Europe must unite, or they will perish.",
        "image": "habsburg.jpg"
    },
    {
        "name": "Todor Zhivkov",
        "country": "Bulgaria",
        "quote": "Socialism is not a dogma but a process.",
        "image": "zhivkov.jpg"
    },
    {
        "name": "Gheorghe Tătărescu",
        "country": "Romania",
        "quote": "National unity is the foundation of progress.",
        "image": "tatarescu.jpg"
    },
    {
        "name": "Ferenc Szálasi",
        "country": "Hungary",
        "quote": "Hungary must rise again in the spirit of unity.",
        "image": "szalasi.jpg"
    },
    {
        "name": "Paul Reynaud",
        "country": "France",
        "quote": "We will fight, and we will win.",
        "image": "reynaud.jpg"
    },
    {
        "name": "Arvid Lindman",
        "country": "Sweden",
        "quote": "Compromise and moderation are the pillars of stability.",
        "image": "lindman.jpg"
    },
    {
        "name": "Pieter Sjoerds Gerbrandy",
        "country": "Netherlands",
        "quote": "Our struggle is for the soul of the Dutch nation.",
        "image": "gerbrandy.jpg"
    },
    {
        "name": "Károlyi Mihály",
        "country": "Hungary",
        "quote": "Peace cannot be dictated by arms.",
        "image": "karolyi.jpg"
    },
    {
        "name": "Kristján X",
        "country": "Iceland",
        "quote": "We are a small nation with great resolve.",
        "image": "kristjan.jpg"
    },
    {
        "name": "Trygve Lie",
        "country": "Norway",
        "quote": "The UN is the hope of the world.",
        "image": "lie.jpg"
    },
    {
        "name": "Jānis Čakste",
        "country": "Latvia",
        "quote": "Freedom is the lifeblood of our people.",
        "image": "cakste.jpg"
    },
    {
        "name": "Antanas Smetona",
        "country": "Lithuania",
        "quote": "A free Lithuania is a just Lithuania.",
        "image": "smetona.jpg"
    },
    {
        "name": "Konstantin Päts",
        "country": "Estonia",
        "quote": "We are guardians of our independence.",
        "image": "pats.jpg"
    },
    {
        "name": "Klement Gottwald",
        "country": "Czechoslovakia",
        "quote": "The working class is the backbone of our republic.",
        "image": "gottwald.jpg"
    }
];

// Available countries for wrong answers
const availableCountries = [
    'France', 'Spain', 'United Kingdom', 'Italy', 'Germany', 'Russia',
    'Poland', 'Netherlands', 'Belgium', 'Portugal', 'Sweden', 'Austria',
    'Norway', 'Denmark', 'Finland', 'Switzerland', 'Croatia', 'Romania',
    'Hungary', 'Bulgaria', 'Greece', 'Czech Republic', 'Slovakia', 'Ukraine'
];

// Country coordinates for map highlighting
const countryCoordinates = {
    'France': [2.3522, 46.2276],
    'Spain': [-3.7038, 40.4168],
    'United Kingdom': [-0.1276, 51.5074],
    'Italy': [12.4964, 41.9028],
    'Germany': [13.4050, 52.5200],
    'Russia': [37.6176, 55.7558],
    'Poland': [19.1451, 51.9194],
    'Netherlands': [5.2913, 52.1326],
    'Belgium': [4.4699, 50.5039],
    'Portugal': [-9.1393, 38.7223],
    'Sweden': [18.0686, 59.3293],
    'Austria': [16.3738, 48.2082],
    'Norway': [10.7522, 59.9139],
    'Denmark': [12.5683, 55.6761],
    'Finland': [24.9384, 60.1699],
    'Switzerland': [8.2275, 46.8182],
    'Croatia': [15.9819, 45.8150],
    'Romania': [26.1025, 44.4268],
    'Hungary': [19.0402, 47.4979],
    'Bulgaria': [23.3219, 42.6977],
    'Greece': [23.7275, 37.9755],
    'Czech Republic': [14.4378, 50.0755],
    'Slovakia': [19.6990, 48.6690],
    'Ukraine': [30.5234, 50.4501]
};

let currentQuestionIndex = 0;
let correctAnswers = 0;
let gameStarted = false;
let gameTimer;
let timeLeft;
let hearts = 4;
let map;
let countryLayer = null;
let selectedMapCountry = null;
let timerPaused = false;

setTime();

function initMap() {
    map = new maplibregl.Map({
        container: 'map-three',
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [10, 50],
        zoom: 3.5
    });

    map.on('load', function() {
        map.getCanvas().style.filter = 'hue-rotate(120deg) saturate(1.2) brightness(0.8)';
        loadCountryData();
    });
}

async function loadCountryData() {
    try {
        const response = await fetch('/democracy-game/assets/data/wm2.geojson');
        if (!response.ok) {
            throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }

        const geojsonData = await response.json();

        map.addSource('countries', {
            type: 'geojson',
            data: geojsonData
        });

        map.addLayer({
            id: 'countries-layer',
            type: 'fill',
            source: 'countries',
            layout: {},
            paint: {
                'fill-color': [
                    'case',
                    ['==', ['get', 'answer_status'], 'correct'],
                    '#47E18D', // Green for correct
                    ['==', ['get', 'answer_status'], 'incorrect'],
                    '#ff4757', // Red for incorrect
                    '#ba68c8'  // Default blue
                ],
                'fill-opacity': .7
            }
        });

        map.addLayer({
            id: 'countries-outline',
            type: 'line',
            source: 'countries',
            layout: {},
            paint: {
                'line-color': '#FFEADB',
                'line-width': 1
            }
        });

        map.on('click', 'countries-layer', function(e) {
            if (gameStarted && currentQuestionIndex < gameData.length && !timerPaused) {
                const countryName = e.features[0].properties.NAME;
                selectCountryFromMap(countryName);
            }
        });

        map.on('mouseenter', 'countries-layer', function() {
            if (gameStarted && !timerPaused) {
                map.getCanvas().style.cursor = 'pointer';
            }
        });

        map.on('mouseleave', 'countries-layer', function() {
            map.getCanvas().style.cursor = '';
        });

    } catch (error) {
        console.error('Error loading country data:', error);
    }
}

function updateCountryColor(countryName, status) {
    if (!map.getSource('countries')) return;
    
    const source = map.getSource('countries');
    const data = source._data;
    
    // Find and update the country
    data.features.forEach(feature => {
        if (feature.properties.NAME === countryName) {
            feature.properties.answer_status = status;
        }
    });
    
    // Update the source
    source.setData(data);
}

function resetMapColors() {
    if (!map.getSource('countries')) return;
    
    const source = map.getSource('countries');
    const data = source._data;
    
    // Reset all countries to default
    data.features.forEach(feature => {
        delete feature.properties.answer_status;
    });
    
    // Update the source
    source.setData(data);
}

function startTimer() {
    setTime();
    updateTimerDisplay();
    timerPaused = false;
    gameTimer = setInterval(function() {
        if (!timerPaused) {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                endGame('time');
            }
        }
    }, 1000);
}

function pauseTimer() {
    timerPaused = true;
}

function resumeTimer() {
    timerPaused = false;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(gameTimer);
    timerPaused = false;
}

function loseHeart() {
    hearts--;
    updateHeartsDisplay();
    if (hearts <= 0) {
        endGame('hearts');
    }
}

function updateHeartsDisplay() {
    const heartElements = document.querySelectorAll('.heart');
    heartElements.forEach((heart, index) => {
        if (index >= hearts) {
            heart.classList.add('lost');
        } else {
            heart.classList.remove('lost');
        }
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateCountryOptions(correctCountry) {
    const incorrectCountries = availableCountries.filter(c => c !== correctCountry);
    const shuffledIncorrect = shuffleArray(incorrectCountries).slice(0, 3);
    const options = [correctCountry, ...shuffledIncorrect];
    return shuffleArray(options);
}

function displayQuestion() {
    if (currentQuestionIndex >= gameData.length) {
        endGame('completed');
        return;
    }

    const question = gameData[currentQuestionIndex];
    
    // Reset map colors for new question
    resetMapColors();
    
    // Update image and quote
    const imageUrl = `/democracy-game/assets/images/${question.image}`;
    document.getElementById('person-image').src = imageUrl;
    document.getElementById('person-image').onerror = function() {
        this.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjYwIiB5PSI2NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+UG9ydHJhaXQ8L3RleHQ+Cjwvc3ZnPgo=";
    };
    
    document.getElementById('quote-text').textContent = `"${question.quote}"`;
    document.getElementById('quote-text').classList.remove('placeholder-quote');
    document.getElementById('quote-cite').textContent = `— ${question.name}`;

    // Generate country options
    const options = generateCountryOptions(question.country);
    const buttonsContainer = document.getElementById('country-buttons');
    buttonsContainer.innerHTML = '';

    options.forEach(country => {
        const button = document.createElement('button');
        button.className = 'country-btn';
        button.textContent = country;
        button.dataset.country = country;
        button.addEventListener('click', () => selectCountry(country, question.country));
        buttonsContainer.appendChild(button);
    });

    // Update counter
    document.getElementById('counter-overall').textContent = 
        gameData.length.toString().padStart(2, '0');

    // Reset map selection
    selectedMapCountry = null;
    resetMapHighlight();
    
    // Resume timer if it was paused
    if (gameStarted && currentQuestionIndex > 0) {
        resumeTimer();
    }
}

function selectCountry(selectedCountry, correctCountry) {
    processAnswer(selectedCountry, correctCountry);
}

function selectCountryFromMap(selectedCountry) {
    const currentQuestion = gameData[currentQuestionIndex];
    if (currentQuestion) {
        selectedMapCountry = selectedCountry;
        processAnswer(selectedCountry, currentQuestion.country);
    }
}

function processAnswer(selectedCountry, correctCountry) {
    // Pause timer when answer is given
    pauseTimer();
    
    const buttons = document.querySelectorAll('.country-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.country === correctCountry) {
            btn.classList.add('correct');
        } else if (btn.dataset.country === selectedCountry && selectedCountry !== correctCountry) {
            btn.classList.add('incorrect');
        }
    });

    if (selectedCountry === correctCountry) {
        correctAnswers++;
        document.getElementById('counter-correct').textContent = 
            correctAnswers.toString().padStart(2, '0');
        // Color the correct country green on map
        updateCountryColor(correctCountry, 'correct');
    } else {
        loseHeart();
        // Color the selected country red and correct country green
        updateCountryColor(selectedCountry, 'incorrect');
        updateCountryColor(correctCountry, 'correct');
    }

    // Highlight correct country on map with marker
    highlightCountryOnMap(correctCountry, true);
    
    // If wrong answer was selected, also highlight it
    if (selectedCountry !== correctCountry) {
        highlightCountryOnMap(selectedCountry, false);
    }

    // Show next/end buttons
    if (currentQuestionIndex < gameData.length - 1) {
        document.getElementById('next-btn').style.display = 'inline-block';
    } else {
        document.getElementById('end-btn').style.display = 'inline-block';
    }
}

function highlightCountryOnMap(countryName, isCorrect = false) {
    if (countryCoordinates[countryName]) {
        map.flyTo({
            center: countryCoordinates[countryName],
            zoom: 5,
            duration: 2000
        });

        // // Add a marker
        // const color = isCorrect ? '#2ed573' : '#ff4757';
        // new maplibregl.Marker({color: color})
        //     .setLngLat(countryCoordinates[countryName])
        //     .addTo(map);
    }
}

function resetMapHighlight() {
    // // Remove all markers
    // const markers = document.querySelectorAll('.maplibregl-marker');
    // markers.forEach(marker => marker.remove());
    
    // Reset map view
    map.flyTo({
        center: [10, 50],
        zoom: 3.5,
        duration: 1000
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    document.getElementById('next-btn').style.display = 'none';
    resetMapHighlight();
    displayQuestion();
}

function startGame() {
    gameStarted = true;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    hearts = 4;
    timeLeft = 60;
    
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('end-btn').style.display = 'inline-block';
    document.getElementById('counter-correct').textContent = '00';
    
    updateHeartsDisplay();
    startTimer();
    displayQuestion();
}

function endGame(reason = 'manual') {
    stopTimer();
    gameStarted = false;
    
    let message = '';
    const percentage = gameData.length > 0 ? Math.round((correctAnswers / gameData.length) * 100) : 0;
    
    switch(reason) {
        case 'time':
            message = `Time's up! You answered ${correctAnswers} out of ${currentQuestionIndex + 1} questions correctly.`;
            break;
        case 'hearts':
            message = `No hearts left! You answered ${correctAnswers} out of ${currentQuestionIndex + 1} questions correctly.`;
            break;
        case 'completed':
            message = `Congratulations! You completed all questions and got ${correctAnswers} out of ${gameData.length} correct (${percentage}%).`;
            break;
        default:
            message = `Game ended. You got ${correctAnswers} out of ${Math.max(currentQuestionIndex, 1)} questions correct.`;
    }
    
    document.getElementById('final-score').textContent = message;
    document.getElementById('game-over').classList.add('show');
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('end-btn').addEventListener('click', () => endGame('manual'));

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    updateHeartsDisplay();
});