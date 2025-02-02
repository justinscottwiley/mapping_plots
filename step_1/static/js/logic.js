
let basmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let map = L.map("map", {
center: [
    37.09, -95.71
],
zoom: 3,
});

basmap.addTo(map);


function getColor(depth) {
if (depth > 90) {
    return "#ea2c2c";
} else if (depth > 70) {
    return "#ea822c";
} else if (depth > 50) {
    return "#ee9c00";
} else if (depth > 30) {
    return "#eecc00";
} else if (depth > 10) {
    return "#d4ee00";
}
    else {
        return "#98ee00"
    };
}

function getRadius(magnitude) {
if (magnitude === 0) {
    return 1
}
return magnitude * 4
}

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//GET request to the url
d3.json(url).then(function (data) {
console.log(data);
function styleInfo(feature) {
return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.6
}
}

L.geoJson(data, {
pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
},
style: styleInfo,
onEachFeature: function (feature, layer) {
    layer.bindPopup(`
        Magnitude: ${feature.properties.mag} <br>
        Depth: ${feature.geometry.coordinates[2]} <br>
        Location: ${feature.properties.place}
    `);
}
}).addTo(map);

let legend = L.control({
position: "bottomright"
});

legend.onAdd = function(){
let container = L.DomUtil.create("div", "info legend");
let grades = [-10, 10, 30, 50, 70, 90];
let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
for(let index = 0; index < grades.length; index++) {
    container.innerHTML += `<i style="background: ${colors[index]}"></i> ${grades[index]}+ <br>`
}
return container;
}

legend.addTo(map);

});