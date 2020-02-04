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
// Call init function so page loads on the first ID selection
init();

// Call getBar(), getTemp(), and getTime() functions to change the bar chart, the temperature headers, and the by time of day line chart upon selection of id in dropdown menu
function optionChanged(id) {
    getBar(id);
    getTemp2(id);
    getTime(id);
    // get the new hot/cold dates, which subsequently calls to the new area graph
    getFormatDates(id);

};//Ends optionChanged() function

// Change the plot per time of day
function getTime(id) {
    d3.csv(`Output_PerDate/MaxTemps/crimeData_maxTemp_${id}.csv`).then((data) => {
        var eachTime = _.groupBy(data,'Time');
        data.forEach(function(data) {
            data.Time = +data.Time;
        });
        var counts = [];
        var times = [];
        for(var key in eachTime) {
            var value = eachTime[key];
            times.push(key);
            counts.push(value.length)
        };

        var traceTime = {
            x : times,
            y: counts,
            name : 'Max',
            line : {color:'rgba(255, 0, 0, 0.6)'}
        };

        d3.csv(`Output_PerDate/MinTemps/crimeData_minTemp_${id}.csv`).then((data) => {

            var eachTime2 = _.groupBy(data,'Time');
            data.forEach(function(data) {
                data.Time = +data.Time;
            });
            var counts2 = [];
            var times2 = [];
            for(var key in eachTime2) {
                var value2 = eachTime2[key];
                times2.push(key);
                counts2.push(value2.length)
            
            }; //Ends for
            
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
                        text: "Time (24 Hour Clock)"
                    },
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
            // text: data.map(x=>x.Desc), // When we need to add the code description to the chart
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

        Plotly.newPlot('horibar',data1,layout);

    })// Ends d3.csv()

};// Ends getBar(id) function

// Create init() function so page loads on first dropdown option when going to the html page
function init() {
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
        var maxF = Object.keys(data[0])[3]

        // Create array to hold all years
        var years = data.map(x=>x.Year)

        // // Append an option in the dropdown for each name in names (each ID name)
        years.forEach(function(year) {
            d3.select('#selDataset')
                .append('option')
                .text(year)
            });
 
    }); //Ends d3.json

    // Call the functions for year 2010:
        // Call 2010 for init getBar
        getBar(2010) //Must be number

        // Call 2010 for init getTime
        getTime(2010) // Must be number
        getTemp2("2010"); //Must be string
        getFormatDates('2010'); //Must be string
}; // Ends init() function

//id for temps = high_temp
function getTemp2(id) {
    // Update the header text
    d3.select('#year_top').selectAll('h2').text(`${id}`)
    d3.select('#year_top').selectAll('p').text(`Explore the data for ${id}`)

    // Update the max/min temps
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
        console.log(data.map(x=>x.Year))
        var maxF = Object.keys(data[0])[3];
        yearData = data.filter(x => x.Year === id)

        var trace1 = [{
            
                type: "indicator",
                value: +yearData[0][maxF],
                delta: { reference: 150, decreasing : {color:'red'} },
                gauge: { 
                    axis: 
                    { visible: false, 
                        range: [30, 150] 
                    },
                    bar: {color:'red'}
                },
                domain: { row: 0, column: 0 }
        }];
        var layout = {
            // width:200,
            height:250,
            template: {
                data: {
                  indicator: [
                    {
                      title: {
                           text: `Hotest Day in ${id}<br><span style="font-size:14px">${yearData[0]["Date"]}</span>`
                        },
                      mode: "number+delta+gauge",
                      delta: { reference: 150 }
                    }
                  ]
                }
              },
        };
        Plotly.newPlot('high_temp',trace1,layout)
    
    });

        d3.csv("OutputData/Min_Temps_2010_2019.csv").then((data) => {
            var minF = Object.keys(data[0])[3];
        yearData = data.filter(x => x.Year === id)
        var trace1 = [{
            
                type: "indicator",
                value: +yearData[0][minF],
                delta: { reference: 30, decreasing : {color:'blue'} },
                gauge: { 
                    axis: 
                    { visible: false, 
                        range: [30, 150] 
                    },
                    bar: {color:'blue'}
                },
                domain: { row: 0, column: 0 }
              
        }];
        var layout = {
            // width:300,
            height:250,
            template: {
                data: {
                  indicator: [
                    {
                      title: {
                           text: `Coldest Day in ${id}<br><span style="font-size:14px">${yearData[0]["Date"]}</span>`
                        },
                      mode: "number+delta+gauge",
                      delta: { reference: 30 }
                    }
                  ]
                }
              }
        };
        Plotly.newPlot('low_temp',trace1,layout)
    });// Ends d3.csv(OutputData/Min_Temps)
}; //Ends function getTemp2(id)

function getFormatDates(id) {
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
        yearData = data.filter(x => x.Year === id)
        var hotYear = yearData[0]['Date'].substring(0,4)
        var hotMonth = yearData[0]['Date'].substring(5,7)
        var hotDay = yearData[0]['Date'].substring(8,10)
        //Format MM/DD/YYYY (i.e. '09/27/2010')
        var hotDate = `${hotMonth}/${hotDay}/${hotYear}`;

        d3.csv("OutputData/Min_Temps_2010_2019.csv").then((data) => {
            yearData = data.filter(x => x.Year === id)
            var coldYear = yearData[0]['Date'].substring(0,4)
            var coldMonth = yearData[0]['Date'].substring(5,7)
            var coldDay = yearData[0]['Date'].substring(8,10)
            //Format MM/DD/YYYY (i.e. '09/27/2010')
            var coldDate = `${coldMonth}/${coldDay}/${coldYear}`;
            byArea(hotDate,coldDate)
        });
    });//ends d3.csv(<MAXtemps>)
    
};//Ends getFormatDateHot

// Plot the graph of count of crimes by area
    // Function byArea() takes in hot and cold Date of that year (formatted MM/DD/YYYY)
function byArea(hotDate,coldDate) {
    d3.csv('Data/Crime_Data_from_2010_to_Present.csv').then((data)=> {
        ///date.substring(6,10)- year only
        //date.substring(0,10)- date format '03/22/2010'
        var hot2010 = data.filter(x=> x['DATE OCC'].substring(0,10)=== hotDate)
        var areaNamesHot = hot2010.map(x=>x['AREA NAME'])

        var hotCounts = {};
        for (var i = 0; i < areaNamesHot.length; i++) {
            hotCounts[areaNamesHot[i]] = 1 + (hotCounts[areaNamesHot[i]] || 0);
            };
        console.log(hotCounts)
        areasHot = []
        countsHot = []
        for(var key in hotCounts) {
            areasHot.push(key);
            countsHot.push(hotCounts[key])
        }

        var cold2010 = data.filter(x=> x['DATE OCC'].substring(0,10)=== coldDate)
        var areaNamesCold = cold2010.map(x=>x['AREA NAME'])

        var coldCounts = {};
        for (var i = 0; i < areaNamesCold.length; i++) {
            coldCounts[areaNamesCold[i]] = 1 + (coldCounts[areaNamesCold[i]] || 0);
            };


        areasCold = []
        countsCold = []

        for(var key in coldCounts) {
            areasCold.push(key);
            countsCold.push(coldCounts[key])
        }

        var area = []
        var countsBoth = []
        for (i=0;i<areasCold.length;i++) {
            area.push(areasCold[i]);
            countsBoth.push([coldCounts[areasCold[i]],hotCounts[areasCold[i]]])
        }

        var trace1 = {
            x: countsBoth[0],
            y: [0,0],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace2 = {
            x: countsBoth[1],
            y: [1,1],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace3 = {
            x: countsBoth[2],
            y: [2,2],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace4 = {
            x: countsBoth[3],
            y: [3,3],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace5 = {
            x: countsBoth[4],
            y: [4,4],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace6 = {
            x: countsBoth[5],
            y: [5,5],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace7 = {
            x: countsBoth[6],
            y: [6,6],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace8 = {
            x: countsBoth[7],
            y: [7,7],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace9 = {
            x: countsBoth[8],
            y: [8,8],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace10 = {
            x: countsBoth[9],
            y: [9,9],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace11 = {
            x: countsBoth[10],
            y: [10,10],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace12 = {
            x: countsBoth[11],
            y: [11,11],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace13 = {
            x: countsBoth[12],
            y: [12,12],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace14 = {
            x: countsBoth[13],
            y: [13,13],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace15 = {
            x: countsBoth[14],
            y: [14,14],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace16 = {
            x: countsBoth[15],
            y: [15,15],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace17 = {
            x: countsBoth[16],
            y: [16,16],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace18 = {
            x: countsBoth[17],
            y: [17,17],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace19 = {
            x: countsBoth[18],
            y: [18,18],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace20 = {
            x: countsBoth[19],
            y: [19,19],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        var trace21 = {
            x: countsBoth[20],
            y: [20,20],
            type:'scatter',
            mode: 'markers+lines+text',
            text: ['Cold','Hot'],
            textposition:'top',
            textfont : {
                size:10,
                color:['blue','red']
            },
            marker : {
                color: ['blue','red'],
            }
        }
        data1 = [trace1,trace2,trace3,trace4,trace5,trace6,trace7,trace8,trace9,trace10,trace11,trace12,trace13,trace14,trace15,trace16,trace17,trace18,trace19,trace20,trace21]
        var layout = {
            title : 'Count of Crimes by Area',
            height:1000,
            showlegend:false,
            yaxis : {
                title: {
                    text: "Area of LA"
                },
                titlefont: {
                    size:14
                },
                tickvals : area.map((d,i)=>i),
                ticktext : area.map(d=>d),
                tickfont : {
                    size:10
                }
            },
            xaxis : {
                title: "Crime Count"
            }
        };
        Plotly.newPlot('area-graph',data1,layout)
})
};

// Make it responsive 
// ********** NOTES & ISSUES ***************
//**** The margins are still wide on the right
//***** The Gauge Chart does not resize when narrowing window (does resize when widen window)
window.onresize = function() {
    var myDiv1 = document.getElementById('time-graph')
    Plotly.relayout(myDiv1, {
      width:myDiv1.clientWidth
    });
    var myDiv2 = document.getElementById('horibar')
    Plotly.relayout(myDiv2, {
      width: myDiv2.clientWidth

    });
    var myDiv3 = document.getElementById('high_temp')
    Plotly.relayout(myDiv3, {
      width: myDiv3.clientWidth
    });
    var myDiv4 = document.getElementById('low_temp')
    Plotly.relayout(myDiv4, {
      width: myDiv4.clientWidth
    });
    var myDiv5 = document.getElementById('area-graph')
    Plotly.relayout(myDiv5, {
      width: myDiv5.clientWidth
    });
  }