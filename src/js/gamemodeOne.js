var map = L.map('map', {

    attributionControl: false
}).setView([10, 0], 2);

const tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    maxZoom: 20
}).addTo(map);


const container = document.getElementById('map');
let gameActive = false;


fetch('../../public/assets/data/WorldBaseMap/Countries_Info.geojson')
    .then(res => res.json())
    .then(geojsonData => {
        const defaultStyle = {
            weight: 0.5,
            color: '#342F33',
            fillColor: '#FFEEE2',
            fillOpacity: 0.9,
        };

        L.geoJSON(geojsonData, {
            style: defaultStyle,

            onEachFeature: (feature, layer) => {
                const txt = feature.properties.ADMIN;
                layer.bindTooltip(txt, {
                    sticky: true,
                    direction: "top",
                    opacity: 0.9
                });


                layer.on('mouseover', function (e) {
                    if (!gameActive || !clickedCountries.has(feature.properties.ADMIN)) {
                        this.setStyle({ fillOpacity: 1, weight: 1.5 });
                    }
                });
                layer.on('mouseout', function (e) {
                    if (!gameActive || !clickedCountries.has(feature.properties.ADMIN)) {
                        this.setStyle({ fillOpacity: 0.9, weight: 0.5 });
                    }
                });
            }
        }).addTo(map);
    })
    .catch(err => console.error('failed to load geojson', err));


// make sure the map can be rendered after the page is loaded
if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
        map.invalidateSize();
    });
    ro.observe(container);
}
