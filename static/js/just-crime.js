
streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var layers = {
  Year_2010: new L.LayerGroup(),
  Year_2011: new L.LayerGroup(),
  Year_2012: new L.LayerGroup(),
  Year_2013: new L.LayerGroup(),
  Year_2014: new L.LayerGroup(),
  Year_2015: new L.LayerGroup(),
  Year_2016: new L.LayerGroup(),
  Year_2017: new L.LayerGroup(),
  Year_2018: new L.LayerGroup(),
  Year_2019: new L.LayerGroup()
};

var myMap = L.map("map", {
  center: [34.039350, -118.261100],
  zoom: 12,
  layers: [
    layers.Year_2010,
    layers.Year_2011,
    layers.Year_2012,
    layers.Year_2013,
    layers.Year_2014,
    layers.Year_2015,
    layers.Year_2016,
    layers.Year_2017,
    layers.Year_2018,
    layers.Year_2019,
  ]
});


streetMap.addTo(myMap)

var overlays = {
  "2010": layers.Year_2010,
  "2011": layers.Year_2011, 
  "2012": layers.Year_2012,
  "2013": layers.Year_2013,
  "2014": layers.Year_2014,
  "2015": layers.Year_2015,
  "2016": layers.Year_2016,
  "2017": layers.Year_2017,
  "2018": layers.Year_2018,
  "2019": layers.Year_2019,
};

L.control.layers(null, overlays).addTo(myMap);

var blackIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

datastore = []

d3.json("http://127.0.0.1:5000/data").then(
  function(d){
    d.map(d => {
      datastore.push(d)

      var newMarker = L.marker([d.lat, d.lon], {
        icon: blackIcon
      });

      if (d.date_occ.includes("2010")) {
        console.log("Year 2010")
        newMarker.addTo(layers.Year_2010);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2011")) {
        console.log("Year 2011")
        newMarker.addTo(layers.Year_2011);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2012")) {
        console.log("Year 2012")
        newMarker.addTo(layers.Year_2012);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2013")) {
        console.log("Year 2013")
        newMarker.addTo(layers.Year_2013);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2014")) {
        console.log("Year 2014")
        newMarker.addTo(layers.Year_2014);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2015")) {
        console.log("Year 2015")
        newMarker.addTo(layers.Year_2015);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2016")) {
        console.log("Year 2016")
        newMarker.addTo(layers.Year_2016);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2017")) {
        console.log("Year 2017")
        newMarker.addTo(layers.Year_2017);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2018")) {
        console.log("Year 2018")
        newMarker.addTo(layers.Year_2018);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

      else if (d.date_occ.includes("2019")) {
        console.log("Year 2019")
        newMarker.addTo(layers.Year_2019);
        newMarker.bindPopup("<b>" + d.crm_cd_desc + "</b>" + "</br>" + d.time_occ.substring(0,2) + ":" + d.time_occ.substring(2,4) + "</br>" + d.date_occ)
      }

    })

})