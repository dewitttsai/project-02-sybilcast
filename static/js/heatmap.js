////////////////////////////////////////////////////
//////////////////// HEAT MAP //////////////////////
////////////////////////////////////////////////////

var datastore = []
 
d3.json("http://127.0.0.1:5000/data").then(
  function(d){
    d.map(d => {
      datastore.push(d)
    })

    // Creating myMap var center on Los Angeles
    var myMap = L.map("heatmap", {
      center: [34.0522, -118.2437],
      zoom: 9
    });

    // Streets map layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    }).addTo(myMap);

      // Create empty heatArray to be pushed to
      var heatArray = [];

      var heatArray2 = []

      datastore.map(d => {
        // console.log(d)

        // heatArray.push([d.lat, d.lon]);

        // Hot Days
        if (d.date_occ == "2010-09-27") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2011-10-12") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2012-09-15") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2013-08-29") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2014-09-16") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2015-09-09") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2016-09-26") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2017-10-24") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2018-07-06") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2019-09-14") {
          heatArray.push([d.lat, d.lon]);
          console.log("success")
        }


        // Cold Days
        if (d.date_occ == "2010-12-31") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2011-12-06") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2012-12-31") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2013-01-14") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2014-12-27") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2015-12-27") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2016-12-19") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2017-12-22") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2018-02-24") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        } else if (d.date_occ == "2019-09-15") {
          heatArray2.push([d.lat, d.lon]);
          console.log("success")
        }




      })

      console.log(heatArray.length)
      console.log(heatArray2.length)

      // Creating heatlayer
      var heat = L.heatLayer(heatArray, {
        radius: 23,
        blur: 35
      }).addTo(myMap);

      var heat2 = L.heatLayer(heatArray2, {
        radius: 23,
        blur: 35
      });

      var overlayMaps = {
        "Hot": heat,
        "Cold": heat2


      };

      L.control.layers(overlayMaps).addTo(myMap);
      



// End of .done block
});