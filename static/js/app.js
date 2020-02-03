// Call updatePlotly2 and updateDemoInfo functions to change the bar chart, bubble chart, demographic info, and gauge chart upon selection of id in dropdown menu
function optionChanged(id) {
    goToNewPage(id);
    getTemp(id)

};

// Change the bar chart upon selection of year
function goToNewPage(id) {
    d3.csv(`Output_PerDate/CodeCounts/crimeCounts_${id}.csv`).then((data) => {
        data.forEach(function(data) {
            data.Code = +data.Code;
            data.Max_Count = +data.Max_Count;
            data.Min_Count = +data.Min_Count;
        });
        // console.log(data['Max_Count'])
        
        var trace1 = {
            // x : data.map((d,i)=>i),
            x : data.map(x=>x['Max_Count']),
            // y: data.map(x=>x["Code"]),
            y : data.map((d,i)=>i*3),
            name: 'Max Temp',
            type:'bar',
            orientation: 'h',
        };
        var trace2 = {
            // x : data.map((d,i)=>i),
            x : data.map(x=>+x['Min_Count']),
            // y: data.map(x=>x["Code"]),
            y : data.map((d,i)=>i*3),
            name: 'Min Temp',
            type:'bar',
            orientation: 'h',
        };
        var data1 = [trace1, trace2]
        var layout = {
            barmode:'group',
            height:1000,
            title : {
                text: 'Count of Crimes per Crime Code'
            },
            yaxis : {
                title: {
                    text: "Crime Code"
                },
                // tickmode: "linear",
                // tick0 : 0,
                // dtick: 2,
                // nticks : data.length*2,
                tickvals : data.map((d,i)=>i*3),
                ticktext : data.map(x=>x["Code"])

    
    
            },// Ends yaxis
            xaxis : {
                title: {
                    text: "Count of Crimes"
                }
            }
        }
    
        Plotly.newPlot('scatter',data1,layout)

    })// Ends d3.csv()

}
function getTemp(id) {
    // Update the header text
    d3.select('#year_top').selectAll('h2').text(`${id}`)
    d3.select('#year_top').selectAll('p').text(`Explore the data for ${id}`)

    // Update the max/min temps
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
        var maxF = Object.keys(data[0])[3];
        yearData = data.filter(x => x.Year === id)
        console.log(yearData)
        var high_temps = d3.select('#high_temp').selectAll('h5').data([yearData])
        var low_temps = d3.select('#low_temp').selectAll('h5').data([data[0]])
        high_temps.enter().append('h5')
                .merge(high_temps)
                .text('High Temperature')
                .append('h4')
                .html(`${yearData[0]["Date"]}<br> ${yearData[0][maxF]} degrees F`)
                .style('text-align','center')
                .style('font-size','14px')
                .style('color','red')
            d3.csv("OutputData/Min_Temps_2010_2019.csv").then((data) => {
                var minF = Object.keys(data[0])[3]
                yearData = data.filter(x => x.Year === id)
                low_temps.enter().append('h5')
                    .merge(low_temps)
                    // .append('h4')
                    .text('Low Temperature')
                    .append('h5')
                    .html(`${yearData[0]["Date"]}<br> ${yearData[0][minF]} degrees F`)
                    .style('text-align','center')
                    .style('font-size','14px')
                    .style('color','blue')
        
            });// Ends d3.csv(OutputData/Min_Temps)

        


}
)};// Ends function getTemp(id)

// Create init() function so page loads on first dropdown option when going to the html page
function init() {
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
        console.log(data.Year)
        var maxF = Object.keys(data[0])[3]
        console.log(Object.keys(data[0])[3])
        // Create array to hold all names (all ID names)
        var years = data.map(x=>x.Year)

        // Header text:
        d3.select('#year_top').selectAll('h2').append('h2').text('2010')
        d3.select('#year_top').selectAll('p').append('p').text('Explore the data for 2010')

        // // Append an option in the dropdown for each name in names (each ID name)
        // d3.select('#selDataset')
        //         .append('option')
        //         .text('Select')
        years.forEach(function(year) {
            d3.select('#selDataset')
                .append('option')
                .text(year)
                // .property("http://www.google.com")//?????? Use the property function????
                // .value("http://www.google.com");
            });
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
            
                });// Ends d3.csv(OutputData/Min_Temps)
        
        
 
}); //Ends d3.json
d3.csv('Output_PerDate/CodeCounts/crimeCounts_2010.csv').then((data) => {
    // console.log(data.map(x=>+x['Max_Count']))
    console.log(data.map((d,i)=>i*2))
    console.log(data.length)
    data.forEach(function(data) {
        data.Code = +data.Code;
        data.Max_Count = +data.Max_Count;
        data.Min_Count = +data.Min_Count;
    });
    // console.log(data['Max_Count'])
    
    var trace1 = {
        // x : data.map((d,i)=>i),
        x : data.map(x=>x['Max_Count']),
        // y: data.map(x=>x["Code"]),
        y : data.map((d,i)=>i*3),
        name: 'Max Temp',
        type:'bar',
        orientation: 'h',
 
    };
    var trace2 = {
        // x : data.map((d,i)=>i),
        x : data.map(x=>+x['Min_Count']),
        // y: data.map(x=>x["Code"]),
        y : data.map((d,i)=>i*3),
        name: 'Min Temp',
        type:'bar',
        orientation: 'h',

    };
    var data1 = [trace1, trace2]
    var layout = {
        barmode:'group',
        height:1000,
        title : {
            text: 'Count of Crimes per Crime Code'
        },
        yaxis : {
            title: {
                text: "Crime Code"
            },
            // tickmode: "linear",
            // tick0 : 0,
            // dtick: 2,
            // nticks : data.length*2,
            tickvals : data.map((d,i)=>i*3),
            ticktext : data.map(x=>x["Code"])
            // font: {
            //     size:8
            // }


        },// Ends yaxis
        xaxis : {
            title: {
                text: "Count of Crimes"
            }
        }
    }

    Plotly.newPlot('scatter',data1,layout)
})
}; // Ends init() function


// Call init function so page loads on the first ID selection
init();