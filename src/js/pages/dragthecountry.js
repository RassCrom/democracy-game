import Header from '../components/header.js'

document.addEventListener('DOMContentLoaded', () => {
    // Render header
    const headerContainer = document.getElementById('header')
    if (headerContainer) {
        const header = new Header()
        headerContainer.replaceWith(header.render())
    }

    // Timer
    let timerInterval
    let seconds = 0
    const timerElement = document.getElementById('timer')
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++
            const min = String(Math.floor(seconds / 60)).padStart(2, '0')
            const sec = String(seconds % 60).padStart(2, '0')
            timerElement.textContent = `${min}:${sec}`
        }, 1000)
    }
    function resetTimer() {
        clearInterval(timerInterval)
        seconds = 0
        timerElement.textContent = '00:00'
    }
    startTimer()

    // Drag and drop logic
    fetch('/democracy-game/assets/countries_politicalsystem/countries_simple.json')
        .then(res => res.json())
        .then(countries => {
            const filtered = countries.filter(c => c.regime && c.regime !== 'N/A' && c.regime !== 'Hybrid')
            const countriesContainer = document.getElementById('countries')
            countriesContainer.innerHTML = ''

            const regimeTypes = ['Democracy', 'Authoritarian', 'Monarchy', 'Totalitarian']
            const guessedCounters = {}
            regimeTypes.forEach(type => guessedCounters[type] = 0)

            // Attempts counter
            let attempts = 10
            const attemptsElement = document.getElementById('attempts-counter')
            attemptsElement.textContent = `Attempts: ${attempts}`

            // Track which countries were already marked incorrect to avoid double-decrement
            const incorrectCountries = new Set()

            // Update regime counters
            function updateRegimeCounters() {
                regimeTypes.forEach(type => {
                    const el = document.getElementById(`guessed-${type}`)
                    if (el) el.textContent = guessedCounters[type]
                })
            }
            updateRegimeCounters()

            filtered.forEach(country => {
                // Card container
                const card = document.createElement('div')
                card.className = 'country-card'
                // SVG
                const img = document.createElement('img')
                img.className = 'country-shape__game'
                img.draggable = true
                img.alt = country.name
                img.dataset.country = country.name
                img.src = `/democracy-game/assets/images/generated_svgs/${country.iso_a2 ? country.iso_a2.toLowerCase() + '-shape.svg' : 'placeholder.svg'}`
                img.onerror = function () { this.src = '/democracy-game/assets/images/placeholder.svg' }
                // Country name
                const label = document.createElement('div')
                label.className = 'country-label'
                label.textContent = country.name
                card.appendChild(img)
                card.appendChild(label)
                countriesContainer.appendChild(card)
            })

            let assignments = {}
            const governmentBlocks = document.querySelectorAll('.government-block')
            let draggedCountry = null
            let gameActive = true
            const guessedCountries = new Set()

            countriesContainer.querySelectorAll('.country-shape__game').forEach(country => {
                country.addEventListener('dragstart', (e) => {
                    if (!gameActive) {
                        e.preventDefault()
                        return
                    }
                    draggedCountry = country.parentElement
                })
            })

            governmentBlocks.forEach(block => {
                block.addEventListener('dragover', (e) => {
                    if (!gameActive) return
                    e.preventDefault()
                    block.classList.add('drag-over')
                })
                block.addEventListener('dragleave', () => {
                    block.classList.remove('drag-over')
                })
                block.addEventListener('drop', (e) => {
                    if (!gameActive) return
                    e.preventDefault()
                    block.classList.remove('drag-over')
                    if (draggedCountry) {
                        const content = block.querySelector('.government-content')
                        if (content) {
                            content.appendChild(draggedCountry)
                        } else {
                            block.appendChild(draggedCountry)
                        }
                        const countryName = draggedCountry.querySelector('.country-shape__game').dataset.country
                        assignments[countryName] = block.dataset.gov
                        draggedCountry = null
                    }
                })
            })

            // Allow dropping back to the left area
            countriesContainer.addEventListener('dragover', (e) => {
                if (!gameActive) return
                e.preventDefault()
                countriesContainer.classList.add('drag-over')
            })
            countriesContainer.addEventListener('dragleave', () => {
                countriesContainer.classList.remove('drag-over')
            })
            countriesContainer.addEventListener('drop', (e) => {
                if (!gameActive) return
                e.preventDefault()
                countriesContainer.classList.remove('drag-over')
                if (draggedCountry) {
                    countriesContainer.appendChild(draggedCountry)
                    const countryName = draggedCountry.querySelector('.country-shape__game').dataset.country
                    delete assignments[countryName]
                    draggedCountry = null
                }
            })

            // Check answers
            const checkBtn = document.getElementById('check-btn')
            checkBtn.addEventListener('click', () => {
                if (!gameActive) return
                const correct = {}
                filtered.forEach(c => correct[c.name] = c.regime)
                let allCorrect = true
                const newIncorrect = new Set()
                let hasAnyIncorrect = false

                // Dynamic regime counters: count correct assignments for each regime
                regimeTypes.forEach(type => guessedCounters[type] = 0)
                Object.keys(correct).forEach(country => {
                    const card = document.querySelector(`[data-country='${country}']`).parentElement
                    if (assignments[country] !== correct[country]) {
                        allCorrect = false
                        card.querySelector('.country-shape__game').style.border = '2px solid red'
                        newIncorrect.add(country)
                        hasAnyIncorrect = true
                    } else {
                        card.querySelector('.country-shape__game').style.border = '2px solid green'
                        const regime = correct[country]
                        if (guessedCounters[regime] !== undefined) {
                            guessedCounters[regime]++
                        }
                    }
                })
                // Decrease attempts if there is at least one incorrect country
                if (hasAnyIncorrect && attempts > 0) {
                    attempts--
                }
                // Update incorrectCountries set
                incorrectCountries.clear()
                newIncorrect.forEach(c => incorrectCountries.add(c))
                attemptsElement.textContent = `Attempts: ${attempts}`
                updateRegimeCounters()
                if (allCorrect) {
                    alert('Congratulations! All correct!')
                    clearInterval(timerInterval)
                    gameActive = false
                    checkBtn.disabled = true
                } else if (attempts === 0) {
                    alert('No attempts left! Please restart the game to play again.')
                    clearInterval(timerInterval)
                    gameActive = false
                    checkBtn.disabled = true
                }
            })

            // Restart game
            document.getElementById('restart-btn').addEventListener('click', () => {
                document.querySelectorAll('.country-card').forEach(card => {
                    countriesContainer.appendChild(card)
                    card.querySelector('.country-shape__game').style.border = ''
                })
                assignments = {}
                regimeTypes.forEach(type => guessedCounters[type] = 0)
                attempts = 10
                attemptsElement.textContent = `Attempts: ${attempts}`
                updateRegimeCounters()
                incorrectCountries.clear()
                guessedCountries.clear()
                resetTimer()
                startTimer()
                gameActive = true
                checkBtn.disabled = false
            })
        })
}) 