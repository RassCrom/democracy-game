import { readFileSync, writeFileSync } from 'fs'

const geojson = JSON.parse(readFileSync('./public/assets/countries_politicalsystem/Countries_Info.geojson', 'utf8'))

const result = geojson.features.map(f => ({
	name: f.properties.NAME,
	regime: f.properties.Political_,
	iso_a2: f.properties.iso_a2,
	iso_a3: f.properties.ISO_A3
}))

writeFileSync('./public/assets/countries_politicalsystem/countries_simple.json', JSON.stringify(result, null, 2), 'utf8')
console.log('countries_simple.json created!') 