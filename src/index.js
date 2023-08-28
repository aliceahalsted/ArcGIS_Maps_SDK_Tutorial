import './main.css';
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js"
import esriConfig from "@arcgis/core/config.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";

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

//SQL query array
const terrestrialSCCCSQL = ["Choose a species","All species","American black bear","Black-tailed prairie dog","Burrowing owl","California condor", "Ferruginous hawk","Southern long-nosed bat", "Peregrine falcon","Gray wolf","Golden-cheeked warbler","Loggerhead shrike", "Mexican long-nosed bat","Monarch butterfly", "Mountain plover", "Piping plover", "Sonoran pronghorn", "Spotted owl"];

//Add SQL UI
const selectFilter = document.createElement("select");
selectFilter.setAttribute("class", "esri-widget esri-select");
selectFilter.setAttribute("style", "width: 250px; font-family: 'Avenir Next'; font-size: 1em");
terrestrialSCCCSQL.forEach(function(query){
  let option = document.createElement("option");
  option.innerHTML = query;
  if(query==="Choose a species"){
    option.value = "1=0"
  } else if(query==="All species"){
      option.value = "1=1"
  } else {
    option.value = "ENGL_NAME='"+query+"'";
  }
  selectFilter.appendChild(option);
});

view.ui.add(selectFilter, "top-right");

//Update the layer with users selection
const setFeatureLayerFilter = (expression) => {
  terrestrialSCCCLayer.definitionExpression = expression;
}

// Listen for changes
selectFilter.addEventListener('change', (event) => {
  setFeatureLayerFilter(event.target.value);

});

//Popup formatting
const popupTerrestrialSCCC = {
  "title": "{ENGL_NAME}",
  "content": [{
    "type": "fields",
    "fieldInfos": [
      {
        "fieldName": "SCI_NAME",
        "label": "Scientific/Latin Name",
        "isEditable": false,
        "tooltip": "",
        "visible": true,
        "format": null,
        "stringFieldOption": "text-box"
      },
      {
        "fieldName": "FAMILY",
        "label": "Family",
        "isEditable": false,
        "tooltip": "",
        "visible": true,
        "format": null,
        "stringFieldOption": "text-box"
      },
    ]
  }]
};

//Add a feature layer
const terrestrialSCCCLayer = new FeatureLayer({
  url: "https://services7.arcgis.com/oF9CDB4lUYF7Um9q/arcgis/rest/services/NA_Terrestrial_Species_of_Common_Conservation_Concern/FeatureServer",
  opacity: 0.7,
  outFields: ["ENGL_NAME", "SCI_NAME", "FAMILY"],
  popupTemplate: popupTerrestrialSCCC,
  definitionExpression: "1=1" //optional
});

map.add(terrestrialSCCCLayer);

//Add a legend
let legend = new Legend({
  view: view
});

view.ui.add(legend, "bottom-left");

//Add a basemap toggle
const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "arcgis-imagery"
});
view.ui.add(basemapToggle,"bottom-right");
 
const basemapGallery = new BasemapGallery({
    view: view,
    source: {
      query: {
        title: '"World Basemaps for Developers" AND owner:esri'
      }
    }
});