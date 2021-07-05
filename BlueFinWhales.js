var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var myMap = L.map("map", {
  center: [
    35.7688, -119.2471
  ],
  zoom: 6,
  layers: [lightmap]
});

d3.csv("data/blue_fin_whales.csv").then((data) => {
  console.log("data: ", data)
  var whale_id_filter = data.map(x => x.DeploymentID);

  var id_filter = whale_id_filter.filter((x, index) =>{
      return whale_id_filter.indexOf(x) === index;
  });

  var whale_id = d3.select("#selDataset");

  var test = id_filter.map((id) => {
      whale_id
        .append("option")
        .property("value", id)
        .text(id);
    });

    createFeatures(id_filter[0]);
});

var legend = L.control({position: 'topright'});

legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'selDataset');
    div.innerHTML = '<select id = selDataset></select>;';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(myMap);

var dropdown = d3.select("#selDataset").on("change", createFeatures);


function createFeatures(id_filter) {
  
  if (id_filter == "Davis") {
    var id_selected = "Davis"
    console.log("id_selected: ", id_selected)
  }
 
  else{
    var id_selected = this.value
    console.log("id_selected: ", id_selected);
  }
  function getValue(x) {
    if(x === "California") {return "firebrick"}
    if(x === "Outside of California") {return "Blue"}
    if(x === "Davis") {return "DarkGreen"}

 }

  d3.csv("data/blue_fin_whales.csv").then((data) => {

    var whale_ids = data.filter(row => row.DeploymentID == id_selected);

    var whales = whale_ids.map(whale => L.circleMarker([whale.latitude,whale.longitude], {
      color: getValue(whale.DeploymentID),
      fillColor: "getValue(whale.DeploymentID)",
      fillOpacity: 100,
      radius: 5})
      .bindPopup(`${whale.residual}`))

    // Sending our whales layer to the createMap function
    createMap(whales, id_selected );
  });
};

function createMap(whales, whale_id) {

  var whale_markers = L.layerGroup(whales)
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap
  };

  var overlayMaps = {

  };
  
  overlayMaps[whale_id] = whale_markers

  L.control.layers(null, overlayMaps).addTo(myMap);
};

var legend = L.control({position: 'topleft' });

  legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["California", "Outside of California", "Davis"],
        labels = [];
        function getValue(x) {
          if(x === "California") {return "indianred"}
          if(x === "Outside of California") {return "Blue"}
          if(x === "Davis") {return "Darkgreen"}
     
       }

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<strong> Place of Interest </strong>'
        div.innerHTML +=
            '<i style="background:' + getValue(grades[i]) + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
};
legend.addTo(myMap);