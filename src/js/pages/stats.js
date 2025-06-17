import * as d3 from 'd3';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const regimeData = [
    { regime: 'Democratic', count: 107, color: '#47E18D', percentage: 49.5 },
    { regime: 'Authoritarian', count: 43, color: '#FF3860', percentage: 19.9 },
    { regime: 'Hybrid', count: 18, color: '#E39B6B', percentage: 8.3 },
    { regime: 'Monarchy', count: 22, color: '#ba68c8', percentage: 10.2 }
];

const regionalData = [
    { region: 'Europe', democratic: 45, authoritarian: 2, hybrid: 3, monarchy: 8 },
    { region: 'Americas', democratic: 28, authoritarian: 5, hybrid: 7, monarchy: 2 },
    { region: 'Asia', democratic: 18, authoritarian: 22, hybrid: 4, monarchy: 8 },
    { region: 'Africa', democratic: 12, authoritarian: 12, hybrid: 3, monarchy: 3 },
    { region: 'Oceania', democratic: 4, authoritarian: 2, hybrid: 1, monarchy: 1 }
];

const trendData = [
    { year: 2019, democratic: 110, authoritarian: 38, hybrid: 20, monarchy: 22 },
    { year: 2020, democratic: 109, authoritarian: 39, hybrid: 19, monarchy: 23 },
    { year: 2021, democratic: 108, authoritarian: 40, hybrid: 18, monarchy: 24 },
    { year: 2022, democratic: 107, authoritarian: 42, hybrid: 18, monarchy: 23 },
    { year: 2023, democratic: 107, authoritarian: 43, hybrid: 18, monarchy: 22 }
];

const topCountries = [
    { name: 'Norway', flag: '🇳🇴', regime: 'Democratic', score: 9.87, emoji: '👑' },
    { name: 'Iceland', flag: '🇮🇸', regime: 'Democratic', score: 9.58, emoji: '🏔️' },
    { name: 'Sweden', flag: '🇸🇪', regime: 'Democratic', score: 9.39, emoji: '🌟' },
    { name: 'New Zealand', flag: '🇳🇿', regime: 'Democratic', score: 9.37, emoji: '🥝' },
    { name: 'Denmark', flag: '🇩🇰', regime: 'Democratic', score: 9.28, emoji: '🧀' },
    { name: 'Canada', flag: '🇨🇦', regime: 'Democratic', score: 9.22, emoji: '🍁' },
    { name: 'Ireland', flag: '🇮🇪', regime: 'Democratic', score: 9.18, emoji: '🍀' },
    { name: 'Finland', flag: '🇫🇮', regime: 'Democratic', score: 9.14, emoji: '🌲' },
    { name: 'Australia', flag: '🇦🇺', regime: 'Democratic', score: 9.09, emoji: '🦘' },
    { name: 'Switzerland', flag: '🇨🇭', regime: 'Democratic', score: 9.03, emoji: '🏔️' }
];

const bottomCountries = [
    { name: 'North Korea', flag: '🇰🇵', regime: 'Authoritarian', score: 1.08, emoji: '🚫' },
    { name: 'Syria', flag: '🇸🇾', regime: 'Authoritarian', score: 1.43, emoji: '⚠️' },
    { name: 'Turkmenistan', flag: '🇹🇲', regime: 'Authoritarian', score: 1.72, emoji: '🏜️' },
    { name: 'Saudi Arabia', flag: '🇸🇦', regime: 'Monarchy', score: 2.08, emoji: '🕌' },
    { name: 'Yemen', flag: '🇾🇪', regime: 'Authoritarian', score: 2.24, emoji: '💔' },
    { name: 'Eritrea', flag: '🇪🇷', regime: 'Authoritarian', score: 2.37, emoji: '🔒' },
    { name: 'Myanmar', flag: '🇲🇲', regime: 'Authoritarian', score: 2.54, emoji: '🌅' },
    { name: 'Iran', flag: '🇮🇷', regime: 'Authoritarian', score: 2.62, emoji: '🕌' },
    { name: 'Belarus', flag: '🇧🇾', regime: 'Authoritarian', score: 2.85, emoji: '🔐' },
    { name: 'China', flag: '🇨🇳', regime: 'Authoritarian', score: 2.94, emoji: '🐉' }
];

let currentChart = 'donut';
let filteredData = [...regimeData];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
    initializeCharts();
    populateCountryLists();
    initializeMap();
    setupEventListeners();
    
    // Delayed animations
    setTimeout(() => {
        document.querySelector('.stats-numbers').style.animation = 'fadeInUp 0.8s ease-out';
        animateProgressBars();
    }, 500);
});

// Counter Animation
function animateCounters() {
    const totalCountries = regimeData.reduce((sum, item) => sum + item.count, 0);
    
    animateNumber('countryCounter', 0, totalCountries, 2000);
    animateNumber('democraticCounter', 0, regimeData[0].count, 2500);
    animateNumber('authoritarianCounter', 0, regimeData[1].count, 2000);
    animateNumber('hybridCounter', 0, regimeData[2].count, 1800);
    animateNumber('monarchyCounter', 0, regimeData[3].count, 2200);
}

function animateNumber(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Chart Functions
function initializeCharts() {
    createDonutChart();
}

function createDonutChart() {
    const container = d3.select('#chartContainer');
    container.selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'donut-chart');

    const g = svg.append('g')
        .attr('transform', `translate(${width/2}, ${height/2})`);

    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

    const hoverArc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 1.1);

    const arcs = g.selectAll('.arc')
        .data(pie(filteredData))
        .enter().append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', hoverArc);
            
            showTooltip(event, `${d.data.regime}: ${d.data.count} countries (${d.data.percentage}%)`);
        })
        .on('mouseleave', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', arc);
            
            hideTooltip();
        })
        .on('click', function(event, d) {
            filterByRegime(d.data.regime);
        });

    // Add labels
    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(d => d.data.count);

    // Add center text
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .style('fill', '#47E18D')
        .text(filteredData.reduce((sum, d) => sum + d.count, 0));

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .style('font-size', '14px')
        .style('opacity', '0.8')
        .text('Total Countries');
}

function createBarChart() {
    const container = d3.select('#chartContainer');
    container.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'bar-chart');

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(regionalData.map(d => d.region))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(regionalData, d => d.democratic + d.authoritarian + d.hybrid + d.monarchy)])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(['democratic', 'authoritarian', 'hybrid', 'monarchy'])
        .range(['#47E18D', '#FF3860', '#E39B6B', '#ba68c8']);

    const stack = d3.stack()
        .keys(['democratic', 'authoritarian', 'hybrid', 'monarchy']);

    const series = stack(regionalData);

    g.selectAll('.serie')
        .data(series)
        .enter().append('g')
        .attr('class', 'serie')
        .attr('fill', d => colorScale(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.data.region))
        .attr('y', height)
        .attr('height', 0)
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function(event, d) {
            const regime = d3.select(this.parentNode).datum().key;
            const count = d[1] - d[0];
            showTooltip(event, `${d.data.region} - ${regime}: ${count} countries`);
        })
        .on('mouseleave', hideTooltip)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200)
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]));

    // Add axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('fill', '#FFEADB')
        .style('font-size', '10px');

    g.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll('text')
        .style('fill', '#FFEADB')
        .style('font-size', '10px');
}

function createLineChart() {
    const container = d3.select('#chartContainer');
    container.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(trendData, d => d.year))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(trendData, d => Math.max(d.democratic, d.authoritarian, d.hybrid, d.monarchy))])
        .range([height, 0]);

    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    const regimeTypes = ['democratic', 'authoritarian', 'hybrid', 'monarchy'];
    const colors = ['#47E18D', '#FF3860', '#E39B6B', '#ba68c8'];

    regimeTypes.forEach((regime, index) => {
        const data = trendData.map(d => ({ year: d.year, value: d[regime] }));
        
        const path = g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colors[index])
            .attr('stroke-width', 3)
            .attr('d', line)
            .style('opacity', 0);

        const totalLength = path.node().getTotalLength();
        
        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .delay(index * 500)
            .attr('stroke-dashoffset', 0)
            .style('opacity', 1);

        // Add dots
        g.selectAll(`.dot-${regime}`)
            .data(data)
            .enter().append('circle')
            .attr('class', `dot-${regime}`)
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.value))
            .attr('r', 4)
            .attr('fill', colors[index])
            .style('opacity', 0)
            .on('mouseenter', function(event, d) {
                showTooltip(event, `${regime}: ${d.value} countries in ${d.year}`);
            })
            .on('mouseleave', hideTooltip)
            .transition()
            .duration(500)
            .delay(index * 500 + 2000)
            .style('opacity', 1);
    });

    // Add axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
        .selectAll('text')
        .style('fill', '#FFEADB');

    g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('fill', '#FFEADB');
}

// Event Listeners
function setupEventListeners() {
    // Chart switching
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const chartType = this.dataset.chart;
            currentChart = chartType;
            
            switch(chartType) {
                case 'donut':
                    document.getElementById('chartTitle').textContent = '📊 Regime Distribution';
                    createDonutChart();
                    break;
                case 'bar':
                    document.getElementById('chartTitle').textContent = '📈 Regional Breakdown';
                    createBarChart();
                    break;
                case 'line':
                    document.getElementById('chartTitle').textContent = '📉 Historical Trends';
                    createLineChart();
                    break;
            }
        });
    });

    // // Filter functionality
    // document.getElementById('filterInput').addEventListener('input', function() {
    //     const query = this.value.toLowerCase();
    //     filterData(query);
    // });

    // // Regime card filtering
    // document.querySelectorAll('.numbers-regimes__card').forEach(card => {
    //     card.addEventListener('click', function() {
    //         const regime = this.dataset.regime;
    //         filterByRegime(regime);
    //     });
    // });
}

// Filter Functions
function filterData(query) {
    if (!query) {
        filteredData = [...regimeData];
    } else {
        filteredData = regimeData.filter(item => 
            item.regime.toLowerCase().includes(query)
        );
    }
    
    if (currentChart === 'donut') {
        createDonutChart();
    }
}

function filterByRegime(regime) {
    const input = document.getElementById('filterInput');
    input.value = regime;
    filterData(regime.toLowerCase());
}

// Tooltip Functions
function showTooltip(event, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = text;
    tooltip.style.opacity = '1';
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 10) + 'px';
    document.getElementById('tooltip').style.display = 'block';
}

function hideTooltip() {
    document.getElementById('tooltip').style.opacity = '0';
    document.getElementById('tooltip').style.display = 'none';
}

// Populate Country Lists
function populateCountryLists() {
    const topContainer = document.getElementById('topCountries');
    const bottomContainer = document.getElementById('bottomCountries');

    topCountries.forEach((country, index) => {
        const countryEl = createCountryElement(country, index);
        topContainer.appendChild(countryEl);
    });

    bottomCountries.forEach((country, index) => {
        const countryEl = createCountryElement(country, index);
        bottomContainer.appendChild(countryEl);
    });
}

function createCountryElement(country, index) {
    const div = document.createElement('div');
    div.className = 'country-item';
    div.style.animationDelay = `${index * 100}ms`;
    div.style.animation = 'slideIn 0.5s ease-out forwards';
    
    div.innerHTML = `
        <div class="country-flag">${country.flag}</div>
        <div class="country-name">${country.name}</div>
        <div class="country-regime">${country.regime}</div>
        <div class="country-score">${country.score}</div>
        <div class="country-emoji">${country.emoji}</div>
    `;
    
    div.addEventListener('click', function() {
        showCountryDetails(country);
    });
    
    return div;
}


function initializeMap() {
    const map = new maplibregl.Map({
        container: 'mapRegimes',
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [0, 20],
        zoom: 1.8,
        maxZoom: 8,
        minZoom: 1,
        projection: 'globe',
    });

    map.addControl(new maplibregl.FullscreenControl(), 'bottom-left');
    map.addControl(new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
    }), 'bottom-left');

    map.addControl(new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
    }), 'bottom-right');

    let selectedCountry = null;

    map.on('load', () => {
        map.addSource('countries', {
            type: 'geojson',
            data: '/democracy-game/assets/data/wm4.geojson',
            promoteId: 'NAME' // Use country name as feature ID for hover effects
        });

        map.addLayer({
            id: 'regimes-layer',
            type: 'fill',
            source: 'countries',
            paint: {
                'fill-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    // Hover state colors (brighter)
                    [
                        'match',
                        ['get', 'Political_'],
                        'Democracy', '#5FE5A3',
                        'Authoritarian', '#FF5580',
                        'Hybrid', '#EBA885',
                        'Monarchy', '#C785D8',
                        'Other', '#B3B3B3',
                        '#E0E0E0'
                    ],
                    // Normal state colors
                    [
                        'match',
                        ['get', 'Political_'],
                        'Democracy', '#47E18D',
                        'Authoritarian', '#FF3860',
                        'Hybrid', '#E39B6B',
                        'Monarchy', '#ba68c8',
                        'Other', '#999999',
                        '#cccccc'
                    ]
                ],
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.9,
                    ['boolean', ['feature-state', 'selected'], false],
                    0.8,
                    0.75
                ]
            }
        });

        // Country borders layer
        map.addLayer({
            id: 'country-borders',
            type: 'line',
            source: 'countries',
            paint: {
                'line-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    '#ffffff',
                    ['boolean', ['feature-state', 'selected'], false],
                    '#47E18D',
                    '#333333'
                ],
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    3,
                    ['boolean', ['feature-state', 'selected'], false],
                    2,
                    0.5
                ],
                'line-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0.6
                ]
            }
        });

        map.addLayer({
            id: 'country-labels',
            type: 'symbol',
            source: 'countries',
            filter: ['>', ['get', 'POP_EST'], 50000000], // Only show labels for countries with >50M population
            layout: {
                'text-field': ['get', 'NAME'],
                'text-font': ['Open Sans Bold'],
                'text-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    1, 8,
                    4, 12,
                    8, 16
                ],
                'text-anchor': 'center',
                'text-offset': [0, 0],
                'text-optional': true
            },
            paint: {
                'text-color': '#ffffff',
                'text-halo-color': '#000000',
                'text-halo-width': 2,
                'text-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    1, 0,
                    3, 1
                ]
            }
        });

        map.on('mousemove', 'regimes-layer', (e) => {
            if (e.features.length > 0) {
                map.getCanvas().style.cursor = 'pointer';
            }
        });

        map.on('mouseleave', 'regimes-layer', () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('click', 'regimes-layer', (e) => {
            if (e.features.length > 0) {
                const country = e.features[0].properties;
                
                if (selectedCountry !== null) {
                    map.setFeatureState(
                        { source: 'countries', id: selectedCountry },
                        { selected: false }
                    );
                }

                selectedCountry = country.NAME;
                map.setFeatureState(
                    { source: 'countries', id: selectedCountry },
                    { selected: true }
                );

                // Show detailed country information
                showCountryDetails(country);
                
                // Trigger country selection event for other components
                if (window.onCountrySelect) {
                    window.onCountrySelect(country);
                }
            }
        });
    });

    function formatNumber(num) {
        if (!num) return 'N/A';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toString();
    }

    function showCountryDetails(country) {
        const detailsPanel = document.getElementById('country-details') || createDetailsPanel();
        detailsPanel.innerHTML = `
            <div class="details-header">
                <button onclick="closeDetails()" class="close-btn">×</button>
            </div>
            <div class="details-content">
                <div class="detail-item">
                    <label>Political System:</label>
                    <span class="regime-tag ${country.Political_?.toLowerCase()}">${country.Political_}</span>
                </div>
                <div class="detail-item">
                    <label>Population:</label>
                    <span>${formatNumber(country.POP_EST)}</span>
                </div>
                <div class="detail-item">
                    <label>GDP:</label>
                    <span>$${formatNumber(country.GDP_MD)}M</span>
                </div>
                <div class="detail-item">
                    <label>GDP per Capita:</label>
                    <span>$${formatNumber((country.GDP_MD * 1000000) / country.POP_EST)}</span>
                </div>
                <div class="detail-item">
                    <label>Capital City:</label>
                    <span>${country.city || 'No info'}</span>
                </div>
                <div class="detail-item">
                    <label>Capital City's Population:</label>
                    <span>${formatNumber(country.population) || 'No info'}</span>
                </div>
            </div>
        `;
        detailsPanel.classList.add('active');
    }

    function createDetailsPanel() {
        const panel = document.createElement('div');
        panel.id = 'country-details';
        panel.className = 'country-details-panel';
        document.body.appendChild(panel);
        return panel;
    }

    window.closeDetails = function() {
        const panel = document.getElementById('country-details');
        if (panel) panel.classList.remove('active');
    };

    return map;
}

function animateProgressBars() {
    document.querySelectorAll('.progress-fill').forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.width; // Trigger animation
        }, index * 200);
    });
}

function showCountryDetails(country) {
    alert(`Country: ${country.name}\nRegime: ${country.regime}\nScore: ${country.score}`);
}

// Smooth scrolling for better UX
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         document.querySelector(this.getAttribute('href')).scrollIntoView({
//             behavior: 'smooth'
//         });
//     });
// });

// Lazy loading for performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all major sections
document.querySelectorAll('.stats-content, .rating-content, .stats-grid').forEach(section => {
    observer.observe(section);
});