import Header from '../components/header.js'

document.title = "💕 Drag the Country";

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const gameSettingsString = localStorage.getItem('gameSettings');
const gameSettings = JSON.parse(gameSettingsString);

let CONTINENT = gameSettings['Continent'] || 'all';
// console.log(gameSettings['Continent'])

class DragTheCountryGame {
    constructor() {
        this.timerInterval = null
        this.seconds = 0
        this.attempts = 10
        this.assignments = {}
        this.draggedCountry = null
        this.gameActive = true
        this.incorrectCountries = new Set()
        this.guessedCountries = new Set()
        this.regimeTypes = ['Democracy', 'Authoritarian', 'Monarchy', 'Totalitarian']
        this.guessedCounters = {}
        this.countries = []
        this.correctAnswers = {}
        
        this.elements = {
            timer: document.getElementById('timer'),
            attemptsCounter: document.getElementById('attempts-counter'),
            countriesContainer: document.getElementById('countries'),
            checkBtn: document.getElementById('check-btn'),
            restartBtn: document.getElementById('restart-btn'),
            helpBtn: document.getElementById('help-btn'),
            tutorialModal: document.getElementById('tutorial-modal'),
            closeTutorial: document.getElementById('close-tutorial'),
            startGame: document.getElementById('start-game'),
            statusMessage: document.getElementById('status-message'),
            statusTitle: document.getElementById('status-title'),
            statusText: document.getElementById('status-text')
        }
        
        this.initializeCounters()
        this.bindEvents()
        this.loadCountries()
        this.startTimer()
    }

    initializeCounters() {
        this.regimeTypes.forEach(type => {
            this.guessedCounters[type] = 0
        })
    }

    bindEvents() {
        this.elements.checkBtn.addEventListener('click', () => this.checkAnswers())
        this.elements.restartBtn.addEventListener('click', () => this.restartGame())
        this.elements.helpBtn.addEventListener('click', () => this.showTutorial())
        this.elements.closeTutorial.addEventListener('click', () => this.hideTutorial())
        this.elements.startGame.addEventListener('click', () => this.hideTutorial())
        
        // Close tutorial on outside click
        this.elements.tutorialModal.addEventListener('click', (e) => {
            if (e.target === this.elements.tutorialModal) {
                this.hideTutorial()
            }
        })
    }

    startTimer() {
        this.resetTimer()
        this.timerInterval = setInterval(() => {
            this.seconds++
            const min = String(Math.floor(this.seconds / 60)).padStart(2, '0')
            const sec = String(this.seconds % 60).padStart(2, '0')
            this.elements.timer.textContent = `${min}:${sec}`
        }, 1000)
    }

    resetTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval)
        }
        this.seconds = 0
        this.elements.timer.textContent = '00:00'
    }

    async loadCountries() {
        try {
            const response = await fetch('/democracy-game/assets/countries_politicalsystem/countries_simple.json')
            const countries = await response.json()
            
            // Filter by regime
            let filteredCountries = countries.filter(c => 
                c.regime && 
                c.regime !== 'N/A' && 
                c.regime !== 'Hybrid'
            )
            
            this.countries = this.filterByContinent(filteredCountries)
            
            this.generateCorrectAnswers()
            this.renderCountries()
            this.setupDragAndDrop()
            this.updateRegimeCounters()
        } catch (error) {
            console.error('Error loading countries:', error)
            this.showStatus('Error loading game data. Please refresh the page.', 'failure')
        }
    }

    filterByContinent(countries) {
        if (CONTINENT === 'all') {
            return countries
        }
        
        return countries.filter(country => 
            country.continent && 
            country.continent.toLowerCase() === CONTINENT.toLowerCase()
        )
    }

    generateCorrectAnswers() {
        this.correctAnswers = {}
        this.countries.forEach(country => {
            this.correctAnswers[country.name] = country.regime
        })
    }

    renderCountries() {
        this.elements.countriesContainer.innerHTML = ''
        
        this.countries.forEach(country => {
            const card = this.createCountryCard(country)
            this.elements.countriesContainer.appendChild(card)
        })
    }

    createCountryCard(country) {
        const card = document.createElement('div')
        card.className = 'country-card'
        
        const img = document.createElement('img')
        img.className = 'country-shape__svgs'
        img.draggable = true
        img.alt = country.name
        img.dataset.country = country.name
        img.src = `/democracy-game/assets/images/generated_svgs/${country.iso_a2 ? country.iso_a2.toLowerCase() + '-shape.svg' : 'placeholder.svg'}`
        img.onerror = function() { 
            this.src = '/democracy-game/assets/images/placeholder.svg'
        }
        
        const label = document.createElement('div')
        label.className = 'country-label'
        label.textContent = country.name
        
        card.appendChild(img)
        card.appendChild(label)
        
        return card
    }

    setupDragAndDrop() {
        this.setupCountryDragEvents()
        this.setupGovernmentDropZones()
        this.setupCountriesDropZone()
    }

    setupCountryDragEvents() {
        document.addEventListener('dragstart', (e) => {
            if (!this.gameActive) {
                e.preventDefault()
                return
            }
            
            const countryCard = e.target.closest('.country-card')
            if (countryCard && e.target.classList.contains('country-shape__svgs')) {
                this.draggedCountry = countryCard
            } else {
                e.preventDefault()
            }
        })
    }

    setupGovernmentDropZones() {
        const governmentBlocks = document.querySelectorAll('.government-block')
        
        governmentBlocks.forEach(block => {
            block.addEventListener('dragover', (e) => {
                if (!this.gameActive) return
                e.preventDefault()
                block.classList.add('drag-over')
            })
            
            block.addEventListener('dragleave', () => {
                block.classList.remove('drag-over')
            })
            
            block.addEventListener('drop', (e) => {
                if (!this.gameActive) return
                e.preventDefault()
                block.classList.remove('drag-over')
                
                if (this.draggedCountry) {
                    const content = block.querySelector('.government-content')
                    const targetContainer = content || block
                    
                    targetContainer.appendChild(this.draggedCountry)
                    
                    const countryName = this.draggedCountry.querySelector('.country-shape__svgs').dataset.country
                    this.assignments[countryName] = block.dataset.gov
                    this.draggedCountry = null
                }
            })
        })
    }

    setupCountriesDropZone() {
        this.elements.countriesContainer.addEventListener('dragover', (e) => {
            if (!this.gameActive) return
            e.preventDefault()
            this.elements.countriesContainer.classList.add('drag-over')
        })
        
        this.elements.countriesContainer.addEventListener('dragleave', () => {
            this.elements.countriesContainer.classList.remove('drag-over')
        })
        
        this.elements.countriesContainer.addEventListener('drop', (e) => {
            if (!this.gameActive) return
            e.preventDefault()
            this.elements.countriesContainer.classList.remove('drag-over')
            
            if (this.draggedCountry) {
                this.elements.countriesContainer.appendChild(this.draggedCountry)
                const countryName = this.draggedCountry.querySelector('.country-shape__svgs').dataset.country
                delete this.assignments[countryName]
                this.draggedCountry = null
            }
        })
    }

    checkAnswers() {
        if (!this.gameActive) return
        
        const results = this.evaluateAnswers()
        this.visualizeResults(results)
        this.updateGameState(results)
    }

    evaluateAnswers() {
        const results = {
            correct: [],
            incorrect: [],
            unassigned: [],
            allCorrect: true
        }
        
        this.regimeTypes.forEach(type => {
            this.guessedCounters[type] = 0
        })
        
        Object.keys(this.correctAnswers).forEach(countryName => {
            const assignedRegime = this.assignments[countryName]
            const correctRegime = this.correctAnswers[countryName]
            
            if (!assignedRegime) {
                results.unassigned.push(countryName)
                results.allCorrect = false
            } else if (assignedRegime === correctRegime) {
                results.correct.push(countryName)
                if (this.guessedCounters[correctRegime] !== undefined) {
                    this.guessedCounters[correctRegime]++
                }
            } else {
                results.incorrect.push(countryName)
                results.allCorrect = false
            }
        })
        
        return results
    }

    visualizeResults(results) {
        document.querySelectorAll('.country-shape__svgs').forEach(shape => {
            shape.classList.remove('correct', 'incorrect', 'unassigned')
            shape.style.border = ''
        })
        
        results.correct.forEach(countryName => {
            const shape = document.querySelector(`[data-country="${countryName}"]`)
            if (shape) {
                shape.classList.add('correct')
                shape.style.border = '3px solid #FF3860'
            }
        })
        
        // Apply visual feedback for incorrect answers
        results.incorrect.forEach(countryName => {
            const shape = document.querySelector(`[data-country="${countryName}"]`)
            if (shape) {
                shape.classList.add('incorrect')
                shape.style.border = '3px solid #47E18D'
            }
        })
        
        results.unassigned.forEach(countryName => {
            const shape = document.querySelector(`[data-country="${countryName}"]`)
            if (shape) {
                shape.classList.add('unassigned')
                shape.style.border = '3px solid #E39B6B'
            }
        })
        
        console.log('Check results:', {
            correct: results.correct.length,
            incorrect: results.incorrect.length,
            unassigned: results.unassigned.length,
            total: Object.keys(this.correctAnswers).length
        })
    }

    updateGameState(results) {
        if ((results.incorrect.length > 0 || results.unassigned.length > 0) && this.attempts > 0) {
            this.attempts--
        }
        
        this.updateUI()
        
        if (results.allCorrect) {
            this.endGame(true)
        } else if (this.attempts === 0) {
            this.endGame(false)
        } else {
            const totalWrong = results.unassigned.length
            this.showStatus(`${results.correct.length} correct, ${totalWrong} remaining. ${this.attempts} attempts left.`, 'info')
        }
    }

    updateUI() {
        this.elements.attemptsCounter.textContent = `Attempts: ${this.attempts}`
        this.updateRegimeCounters()
    }

    updateRegimeCounters() {
        this.regimeTypes.forEach(type => {
            const element = document.getElementById(`guessed-${type}`)
            if (element) {
                element.textContent = this.guessedCounters[type]
            }
        })
    }

    endGame(won) {
        this.gameActive = false
        this.resetTimer()
        this.elements.checkBtn.disabled = true
        
        if (won) {
            this.showStatus('🎉 Congratulations! All countries correctly placed!', 'success')
        } else {
            this.showStatus('😞 Game Over! No attempts remaining. Try again!', 'failure')
        }
    }

    restartGame() {
        this.attempts = 10
        this.assignments = {}
        this.gameActive = true
        this.incorrectCountries.clear()
        this.guessedCountries.clear()
        
        this.regimeTypes.forEach(type => {
            this.guessedCountries[type] = 0
        })
        
        this.loadCountries()
        
        this.elements.checkBtn.disabled = false
        this.updateUI()
        this.hideStatus()
        this.startTimer()
    }

    showTutorial() {
        this.elements.tutorialModal.classList.add('show')
    }

    hideTutorial() {
        this.elements.tutorialModal.classList.remove('show')
    }

    showStatus(message, type) {
        this.elements.statusTitle.textContent = type === 'success' ? '🎉 Success!' : '😞 Game Over!'
        this.elements.statusText.textContent = message
        this.elements.statusMessage.className = `status-message show ${type}`
        
        setTimeout(() => this.hideStatus(), 2000)
    }

    hideStatus() {
        this.elements.statusMessage.classList.remove('show', 'success', 'failure')
    }
}



if (isMobile()) {
    alert('Sorry, it is inconvenient to play this mode from phone, consider other options or switch on to the desktop')
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const headerContainer = document.getElementById('header')
        if (headerContainer) {
            const header = new Header()
            headerContainer.replaceWith(header.render())
        }
        
        new DragTheCountryGame()
    })
}