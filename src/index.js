import './main.css';
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js"
import esriConfig from "@arcgis/core/config.js";

esriConfig.apiKey = 'XXXX-XXXX-XXXX';

const map = new Map({
    basemap: "arcgis-topographic" // Basemap layer service
});

const view = new MapView({
    map: map,
    center: [-94.5, 38.7951], // Longitude, latitude
    zoom: 4, // Zoom level
    container: "map" // Div element
});