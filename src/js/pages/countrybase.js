const input = document.querySelector('.input-form input');
const clearBtn = document.querySelector('.clear-btn');
const inputForm = document.querySelector('.input-form');

let allCountries = [];
let filteredCountries = [];

input.addEventListener('input', (e) => {
   const query = e.target.value;
   
   if (query.length > 0) {
       inputForm.classList.add('has-content');
   } else {
       inputForm.classList.remove('has-content');
   }
   
   searchCountries(query);
});

clearBtn.addEventListener('click', () => {
   input.value = '';
   inputForm.classList.remove('has-content');
   searchCountries('');
   input.focus();
});

async function loadCountries() {
   try {
       const response = await fetch('/democracy-game/assets/data/wm2.geojson');
       const data = await response.json();
       
       allCountries = data.features.map(feature => feature.properties);
       filteredCountries = [...allCountries];
       
       displayCountries(filteredCountries);
   } catch (error) {
       console.error('Error loading countries:', error);
   }
}

function displayCountries(countries) {
   const countriesContainer = document.getElementById('countries-container');
   countriesContainer.innerHTML = '';
   
   countries.forEach(props => {
       const card = createCountryCard(props);
       countriesContainer.appendChild(card);
   });
}

function createCountryCard(props) {
   const card = document.createElement('div');
   card.className = 'country-card';
   
   const population = formatNumber(props.POP_EST);
   const gdp = formatNumber(props.GDP_MD);
   
   card.innerHTML = `
       <div class="country-type">${props.TYPE || 'Country'}</div>
       <h4>${props.NAME}</h4>
       <div class="country-info">
           <div class="country-stat">
               <span class="stat-label">Political Status:</span>
               <span class="stat-value">${props.Political_ || 'N/A'}</span>
           </div>
           <div class="country-stat">
               <span class="stat-label">Population:</span>
               <span class="stat-value">${population}</span>
           </div>
           <div class="country-stat">
               <span class="stat-label">GDP (Million):</span>
               <span class="stat-value">$${gdp}</span>
           </div>
       </div>
   `;
   
   return card;
}

function formatNumber(num) {
   if (!num || num === -1) return 'N/A';
   if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
   if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
   if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
   return num.toString();
}

function searchCountries(query) {
   if (!query.trim()) {
       filteredCountries = [...allCountries];
   } else {
       const searchTerm = query.toLowerCase();
       filteredCountries = allCountries.filter(country => 
           country.NAME.toLowerCase().includes(searchTerm) ||
           (country.Political_ && country.Political_.toLowerCase().includes(searchTerm)) ||
           (country.TYPE && country.TYPE.toLowerCase().includes(searchTerm))
       );
   }
   
   displayCountries(filteredCountries);
}

document.addEventListener('DOMContentLoaded', loadCountries);