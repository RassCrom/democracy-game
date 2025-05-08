var map = L.map('map', {
    
    attributionControl: false
}).setView([20, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    maxZoom: 20
}).addTo(map);

setTimeout(function() {
    map.invalidateSize();
}, 100);
