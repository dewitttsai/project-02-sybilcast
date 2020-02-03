//DT - SECTION START

    //Get the button
    var mybutton = document.getElementById("homebutton");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    }



//MI - SECTION START

// Call getBar(), getTemp(), and getTime() functions to change the bar chart, the temperature headers, and the by time of day line chart upon selection of id in dropdown menu
function optionChanged(id) {
    getBar(id);
    getTemp(id)
    getTime(id)

};

// Change the plot per time of day
function getTime(id) {
    d3.csv(`Output_PerDate/MaxTemps/crimeData_maxTemp_${id}.csv`).then((data) => {
        var eachTime = _.groupBy(data,'Time');
        // console.log(eachTime)
        // console.log(eachTime)
        data.forEach(function(data) {
            data.Time = +data.Time;
        });
        console.log(data.map(x=>x['Time']))
        var counts = [];
        var times = [];
        for(var key in eachTime) {
            var value = eachTime[key];
            times.push(key);
            // console.log(key)
            counts.push(value.length)
        
            // do something with "key" and "value" variables
        }
        console.log(times.map((d,i)=>i))
        // console.log(counts)
        var traceTime = {
            x : times,
            y: counts,
            name : 'Max',
            line : {color:'rgba(255, 0, 0, 0.6)'}
        }
        d3.csv(`Output_PerDate/MinTemps/crimeData_minTemp_${id}.csv`).then((data) => {

            var eachTime2 = _.groupBy(data,'Time');
        // console.log(eachTime)
        // console.log(eachTime)
            data.forEach(function(data) {
                data.Time = +data.Time;
            });
            console.log(data.map(x=>x['Time']))
            var counts2 = [];
            var times2 = [];
            for(var key in eachTime2) {
                var value2 = eachTime2[key];
                times2.push(key);
                // console.log(key)
                counts2.push(value2.length)
            
            }; //Ends for
            console.log(times.map((d,i)=>i))
            // console.log(counts)
            var traceTime2 = {
                x : times2,
                y: counts2,
                name : 'Min',
                line : {color:'SlateBlue'}
            };
            var layoutTime = {
                title : {
                    text: 'Count of Crimes per Time of Day'
                },
                height: 500,
                xaxis : {
                    title: {
                        text: "Time"
                    },
                    // tickvals : times.map((d,i)=>i),
                    // ticktext : times.map(d=>d)
                    tickmode: "linear",
                    tick0 : 0,
                    dtick: 100,
                    nticks : 2400
                },
                yaxis : {
                    title: {
                        text: "Count of Crimes"
                    }
                }

        };
        dataTime = [traceTime, traceTime2];
        Plotly.newPlot('time-graph',dataTime, layoutTime)
        
    });// Ends d3.csv(Output_PerDate/MinTemps/..2010)
    });// Ends d3.csv(Output_PerDate/MaxTemps/..2010)
};//Ends getTime() function

// Change the bar chart upon selection of year
function getBar(id) {
    d3.csv(`Output_PerDate/CodeCounts/crimeCounts_${id}.csv`).then((data) => {
        data.forEach(function(data) {
            data.Code = +data.Code;
            data.Max_Count = +data.Max_Count;
            data.Min_Count = +data.Min_Count;
        });
        // console.log(data['Max_Count'])
        
        var trace1 = {
            x : data.map(x=>x['Max_Count']),
            y : data.map((d,i)=>i*3),
            name: 'Max Temp',
            type:'bar',
            orientation: 'h',
        };//Ends trace1
        var trace2 = {
            x : data.map(x=>+x['Min_Count']),
            y : data.map((d,i)=>i*3),
            name: 'Min Temp',
            type:'bar',
            orientation: 'h',
        };// Ends trace2
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
                tickvals : data.map((d,i)=>i*3),
                ticktext : data.map(x=>x["Code"])
            },// Ends yaxis
            xaxis : {
                title: {
                    text: "Count of Crimes"
                }
            }
        }; // Ends layout
    
        Plotly.newPlot('horibar',data1,layout)

    })// Ends d3.csv()

};// Ends getBar(id) function

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
        // Create array to hold all years
        var years = data.map(x=>x.Year)

        // Header text:
        d3.select('#year_top').selectAll('h2').append('h2').text('2010')
        d3.select('#year_top').selectAll('p').append('p').text('Explore the data for 2010')

        // // Append an option in the dropdown for each name in names (each ID name)
        years.forEach(function(year) {
            d3.select('#selDataset')
                .append('option')
                .text(year)

            });
            var high_temps = d3.select('#high_temp').selectAll('h5').data([data[0]])
            var low_temps = d3.select('#low_temp').selectAll('h5').data([data[0]])
            console.log(high_temps)
    
            high_temps.enter().append('h5')
                .merge(high_temps)
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
    // Call 2010 for init getBar
    getBar(2010)

    // Call 2010 for init getTime
    getTime(2010)
}; // Ends init() function


// Call init function so page loads on the first ID selection
init();