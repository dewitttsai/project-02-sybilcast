
// Create init() function so page loads on first dropdown option when going to the html page
function init() {
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
        var maxF = Object.keys(data[0])[3]
        console.log(Object.keys(data[0])[3])
    
        var high_temps = d3.select('#high_temp').selectAll('h5').data([data[0]])
        var low_temps = d3.select('#low_temp').selectAll('h5').data([data[0]])
        console.log(high_temps)

        high_temps.enter().append('h5')
            .merge(high_temps)
            // .append('h5')
            .text('High Temperature')
            .append('h4')
            .html(`${data[0]["Date"]}<br> ${data[0][maxF]} degrees F`)
            .style('text-align','center')
            .style('font-size','14px')
            .style('color','red')

        d3.csv("OutputData/Min_Temps_2010_2019.csv").then((data) => {
                var minF = Object.keys(data[0])[3]
                low_temps.enter().append('h5')
                    .merge(low_temps)
                    // .append('h4')
                    .text('Low Temperature')
                    .append('h5')
                    .html(`${data[0]["Date"]}<br> ${data[0][minF]} degrees F`)
                    .style('text-align','center')
                    .style('font-size','14px')
                    .style('color','blue')
        
            });
            d3.csv("Data/Crime_Data_from_2010_to_Present.csv").then((data) => {
                // console.log(Object.keys(data[0]))
                //["DR_NO", "Date Rptd", "DATE OCC", "TIME OCC", "AREA ", "AREA NAME", "Rpt Dist No", "Part 1-2", "Crm Cd", "Crm Cd Desc", "Mocodes", "Vict Age", "Vict Sex", "Vict Descent", "Premis Cd", "Premis Desc", "Weapon Used Cd", "Weapon Desc", "Status", "Status Desc", "Crm Cd 1", "Crm Cd 2", "Crm Cd 3", "Crm Cd 4", "LOCATION", "Cross Street", "LAT", "LON"]
                var high_data = data.filter(x => Date.parse(x["DATE OCC"])=== Date.parse('2010/09/27'))
                console.log(high_data)
                var low_data = data.filter(x => Date.parse(x["DATE OCC"])=== Date.parse('2010/12/31'))
                console.log(low_data)
                crime_codes = data.map(x => x["Crm Cd"])

                var trace1 = {
                    type : "scatter",
                    x : high_data["TIME OCC"],
                    y : high_data["Crm Cd"],
                    mode: 'markers'
                }
                var data1 = [trace1];
                Plotly.newPlot('horibar',data)
                
                // date_occ = data.map(x => x["DATE OCC"])
                // // time_occ = data.map(x => x["TIME OCC"])
                // // crime_codes = data.map(x => x["Crm Cd"])
                // firstDate2010 = Date.parse('01/01/2010')
                // lastDate2010 = Date.parse('12/31/2010')
                // console.log(date_occ[0])
                // console.log(Date.parse(date_occ[0]))            
            
            });

}); //Ends d3.csv
// d3.csv("Data/Crime_Data_from_2010_to_Present.csv").then((data) => {
//     // console.log(Object.keys(data[0]))
//     //["DR_NO", "Date Rptd", "DATE OCC", "TIME OCC", "AREA ", "AREA NAME", "Rpt Dist No", "Part 1-2", "Crm Cd", "Crm Cd Desc", "Mocodes", "Vict Age", "Vict Sex", "Vict Descent", "Premis Cd", "Premis Desc", "Weapon Used Cd", "Weapon Desc", "Status", "Status Desc", "Crm Cd 1", "Crm Cd 2", "Crm Cd 3", "Crm Cd 4", "LOCATION", "Cross Street", "LAT", "LON"]
//     var high_data = data.filter(x => Date.parse(x["DATE OCC"])=== Date.parse('2010/09/27'))
//     console.log(high_data)
//     // date_occ = data.map(x => x["DATE OCC"])
//     // // time_occ = data.map(x => x["TIME OCC"])
//     // // crime_codes = data.map(x => x["Crm Cd"])
//     // firstDate2010 = Date.parse('01/01/2010')
//     // lastDate2010 = Date.parse('12/31/2010')
//     // console.log(date_occ[0])
//     // console.log(Date.parse(date_occ[0]))



// });

// Only 2010:
// d3.json("https://data.lacity.org/resource/63jg-8b9z.json").then((data) => {
//     console.log(data)
// })


}; // Ends init() function
// Call init function so page loads on the first ID selection
init();



