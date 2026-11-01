// Инициализируем карту
const map = new maplibregl.Map({
  container: 'map',
  style: {
    "version": 8,
    "sources": {},
    "layers": []
  },
  center: [51, 0],
  zoom: 4
});

map.on('load', () => {
    // Выполняется после загрузки карты

    // Фон (рисуется первым, под всеми слоями)
    map.addLayer({
        id: 'background',
        type: 'background',
        paint: {
            'background-color': 'lightblue'
        }
    })

    // ---- Страны ----
    map.addSource('countries', {
        type: 'geojson',
        data: './data/countries.geojson',
        attribution: 'Natural Earth'
    })

    map.addLayer({
        id: 'countries-layer',
        type: 'fill',
        source: 'countries',
        paint: {
            'fill-color': ['match', ['get', 'MAPCOLOR7'], 1, 'red', 'lightgray']
        }
    })

    // ---- Реки ----
    map.addSource('rivers', {
        type: 'geojson',
        data: './data/rivers.geojson'
    })

    map.addLayer({
        id: 'rivers-layer',
        type: 'line',
        source: 'rivers',
        paint: {
            'line-color': '#00BFFF'
        }
    })

    // ---- Озёра ----
    map.addSource('lakes', {
        type: 'geojson',
        data: './data/lakes.geojson'
    })

    map.addLayer({
        id: 'lakes-layer',
        type: 'fill',
        source: 'lakes',
        paint: {
            'fill-color': 'lightblue',
            'fill-outline-color': '#00BFFF'
        }
    })

    // ---- Города ----
    map.addSource('cities', {
        type: 'geojson',
        data: './data/cities.geojson'
    })

    map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
            'circle-color': 'rgb(123, 12, 234)',
            'circle-radius': 3
        },
        filter: ['>', ['get', 'POP_MAX'], 1000000]
    })

    // ---- Интерактивность ----

    // Попап по клику на город
    map.on('click', ['cities-layer'], (e) => {
        new maplibregl.Popup() // создадим попап
            .setLngLat(e.features[0].geometry.coordinates) // установим на координатах объекта
            .setHTML(e.features[0].properties.NAME) // заполним текстом из атрибута с именем объекта
            .addTo(map); // добавим на карту
    })

    // Меняем курсор при наведении на города
    map.on('mouseenter', 'cities-layer', () => {
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'cities-layer', () => {
        map.getCanvas().style.cursor = ''
    })
})
