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

// Call getHotAndCold() and getTemp2() functions to change the bar chart, the temperature headers, the by time of day line chart, and the crime count by area upon selection of id in dropdown menu
function optionChanged(id) {
    getHotAndCold(id);
    getTemp2(id);
};//Ends optionChanged() function

// getHotAndCold() function gets the hot and cold day of the selected year (id), then calls the local server with the json data and calls the functions to update each plot
function getHotAndCold(id) {
        d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
    
            // Format YYYY-MM-DD
            var currentHotDate = data.filter(x => x.Year === id)[0].Date;

            d3.csv("OutputData/Min_Temps_2010_2019.csv").then((data) => {
                var currentColdDate = data.filter(x => x.Year === id)[0].Date;
                
                //************************  D3.JSON()  ************************//
                // Call d3.json() with the local server (http://127.0.0.1:5000/data) from app.py
                d3.json('http://127.0.0.1:5000/data').then((data) => {
                    console.log(data)
                    dataHot = data.filter(x =>x['date_occ'].substring(0,10) === currentHotDate);
                    dataCold = data.filter(x =>x['date_occ'].substring(0,10) === currentColdDate);

                    // Call the functions using dataHot and dataCold, the data for the hot and cold days of the year (id)
                    getTime(dataHot, dataCold);
                    getBar(dataHot, dataCold);
                    byArea(dataHot,dataCold);
                }); //Ends d3.json()
            }); //Ends d3.csv() for MIN temps
        }); //Ends d3.csv() for MAX temps
        
};// Ends getHotAndCold(id) function

// function getTime() calculates the count of crimes per time of day (formatted in a 24-hour clock)
function getTime(dataHot,dataCold) {
        // Convert the time to an integer
        dataHot.forEach(function(d) {
            d['time_occ']= +(d['time_occ']);
        });

        // Group the hot day data by time
        var eachTimeHot = _.groupBy(dataHot,'time_occ');

        // Count the number of crimes per time of day for the hot day of the year
        var countsHot = [];
        var timesHot = [];
        for(var key in eachTimeHot) {
            var value = eachTimeHot[key];
            timesHot.push(+key);
            countsHot.push(value.length)
        };

        // Create the trace for the hot day of the selected year
        var traceHot = {
            x : timesHot,
            y: countsHot,
            name : 'Hot',
            line : {color:'rgba(255, 0, 0, 0.6)'}
        };

        // Convert the time to an integer
        dataCold.forEach(function(data) {
            data['time_occ']= +data['time_occ'];
        });

        // Group the cold day data by time
        var eachTimeCold = _.groupBy(dataCold,'time_occ');
        
        // Count the number of crimes per time of day for the cold day of the year
        var countsCold = [];
        var timesCold = [];
        for(var key in eachTimeCold) {
            var value = eachTimeCold[key];
            timesCold.push(+key);
            countsCold.push(value.length)
        };

        // Create the trace for the cold day of the selected year
        var traceCold = {
            x : timesCold,
            y: countsCold,
            name : 'Cold',
            line : {color:'SlateBlue'}
        };

        // Create the layout for the count of crime per time of day for the selected year
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
                    text: "Crime Count"
                }
            }
        };// Ends layoutTime
        dataTime = [traceHot, traceCold];

        // Plot the plot with plotly
        Plotly.newPlot('time-graph',dataTime, layoutTime);

};//Ends getTime() function

// Change the bar chart upon selection of year
function getBar(dataHot, dataCold) {

    // Group the hot day data by crime code
    var eachCodeHot = _.groupBy(dataHot,'crm_cd');

    // Count the number of crimes per crime code for the hot day of the year
    var countsHot = [];
    var timesHot = [];
    for(var key in eachCodeHot) {
        var value = eachCodeHot[key];
        timesHot.push(+key);
        countsHot.push(value.length)
    };

    // Group the cold day data by crime code
    var eachCodeCold = _.groupBy(dataCold,'crm_cd');
    
    // Count the number of crimes per crime code for the cold day of the year
    var countsCold = [];
    var timesCold = [];
    for(var key in eachCodeCold) {
        var value = eachCodeCold[key];
        timesCold.push(+key);
        countsCold.push(value.length)
    };

    // Get the crime codes that occur on both the hot and cold day of the year
    var intersect = timesHot.filter(element => timesCold.includes(element));

    // Create arrays that will hold the all of the codes for both days, the codes for only the hot day, and the codes for only the cold day
    var hotIntersect = [];
    var coldIntersect = [];
    var codes = [];
    
    for (var i=0; i<intersect.length; i++) {
        codes.push(intersect[i]);
        hotIntersect.push(eachCodeHot[intersect[i]].length);
        coldIntersect.push(eachCodeCold[intersect[i]].length);
    };

    var coldOnly = timesCold.filter(element => !timesHot.includes(element))
    for (var i=0; i<coldOnly.length; i++) {
        codes.push(coldOnly[i]);
        coldIntersect.push(eachCodeCold[coldOnly[i]].length)
        hotIntersect.push(0)
    };

    var hotOnly = timesHot.filter(element => !timesCold.includes(element))
    for (var i=0; i<hotOnly.length; i++) {
        codes.push(hotOnly[i]);
        hotIntersect.push(eachCodeHot[hotOnly[i]].length)
        coldIntersect.push(0)
    };

    // Create an object to hold all of the codes, the codes on the hot day, and the codes on the cold day
    var test = {
        'codes': codes,
        'hot': hotIntersect,
        'cold': coldIntersect
    };

    // Get the code names to display as the text of each code on the bar graph
    allCodeNames = [];
    for (var i=0; i<intersect.length; i++) { 
        dataCode = dataHot.filter(x => x.crm_cd === intersect[i].toString())[0].crm_cd_desc
        allCodeNames.push(dataCode)
        
    }; //End for (intersection)

    for (var i=0; i<coldOnly.length; i++) { 
        dataCode = dataCold.filter(x => x.crm_cd === coldOnly[i].toString())[0].crm_cd_desc
        allCodeNames.push(dataCode)
    }; //End for (cold only)

    for (var i=0; i<hotOnly.length; i++) { 
        dataCode = dataHot.filter(x => x.crm_cd === hotOnly[i].toString())[0].crm_cd_desc
        allCodeNames.push(dataCode)
    }; //End for (hot only)



    // Create the trace for the hot day of the current year    
    var trace1 = {
        x : test['hot'],
        y: test['codes'].map((d,i) => i*3),
        text: allCodeNames,
        marker : {
            color: 'rgb(247, 79, 79)'
        },
        name: 'Hot Day',
        type:'bar',
        orientation: 'h',
    };//Ends trace1

    // Create the trace for the cold day of the current year
    var trace2 = {
        x : test['cold'],
        y: test['codes'].map((d,i) => i*3),
        text : allCodeNames,
        marker : {
            color : 'rgb(88, 110, 254)'
        },
        name: 'Cold Day',
        type:'bar',
        orientation: 'h',
    };// Ends trace2


    var data1 = [trace1, trace2]

    // Create the layout object for the bar chart
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
            tickvals : test['codes'].map((d,i) => i*3),
            ticktext: test['codes'].map(d=>d)
        },// Ends yaxis
        xaxis : {
            title: {
                text: "Crime Count"
            }
        }
    }; // Ends layout

    // Plot the bar chart with Plotly
    Plotly.newPlot('horibar',data1,layout);

};// Ends getBar(id) function

// Create init() function so page loads on first dropdown option when going to the html page
function init() {
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {

        // Create array to hold all years
        var years = data.map(x=>x.Year)

        // Append an option in the dropdown for each name in names (each ID name)
        years.forEach(function(year) {
            d3.select('#selDataset')
                .append('option')
                .text(year)
        });
    }); //Ends d3.csv() for MAX temps

    // Call the functions for year 2010:
        getHotAndCold('2010');
        getTemp2("2010"); //Must be string
}; // Ends init() function

// Change the temperature gauge chart upon selection of the year
function getTemp2(id) {
    // Update the header text
    d3.select('#year_top').selectAll('h2').text(`${id}`)
    d3.select('#year_top').selectAll('p').text(`Explore the data for ${id}`)

    // Update the max/min temps:

    // 1. Update the max temp
    d3.csv("OutputData/Max_Temps_2010_2019.csv").then((data) => {
        var maxF = Object.keys(data[0])[3];
        yearData = data.filter(x => x.Year === id)

        // Create the trace for the hot day
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
        // Create the layout object for the hot day
        var layout = {
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
        // Plot the gauge chart for the hot day of the selected year
        Plotly.newPlot('high_temp',trace1,layout)
    
    });

    // 2. Update the min temp
    d3.csv("OutputData/Min_Temps_2010_2019.csv").then((data) => {
        var minF = Object.keys(data[0])[3];
        yearData = data.filter(x => x.Year === id)

        // Create the trace for the cold day
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

        // Create the layout object for the cold day of the selected year
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

        // Plot the cold day gauge chart for the selected year
        Plotly.newPlot('low_temp',trace1,layout)
    });// Ends d3.csv(OutputData/Min_Temps)
}; //Ends function getTemp2(id)


// Plot the graph of count of crimes by area
function byArea(dataHot,dataCold) {

        // Get the crime counts by area for the hot day of the selected year
        var areaNamesHot = dataHot.map(x => x.area_name);

        var hotCounts = {};
        for (var i = 0; i < areaNamesHot.length; i++) {
            hotCounts[areaNamesHot[i]] = 1 + (hotCounts[areaNamesHot[i]] || 0);
            };

        areasHot = [];
        countsHot = [];
        for(var key in hotCounts) {
            areasHot.push(key);
            countsHot.push(hotCounts[key]);
        };

        // Get the crime counts by area for the hot day of the selected year
        var areaNamesCold = dataCold.map(x => x.area_name);
        
        var coldCounts = {};
        for (var i = 0; i < areaNamesCold.length; i++) {
            coldCounts[areaNamesCold[i]] = 1 + (coldCounts[areaNamesCold[i]] || 0);
            };


        areasCold = [];
        countsCold = [];

        for(var key in coldCounts) {
            areasCold.push(key);
            countsCold.push(coldCounts[key])
        };

        // Create array to hold the hot day and cold day counts for each area
        var area = []
        var countsBoth = []
        for (var i=0;i<areasCold.length;i++) {
            area.push(areasCold[i]);
            countsBoth.push([coldCounts[areasCold[i]],hotCounts[areasCold[i]]])
        }

        // Set the color of the line and arrow:
        // 1. If the hot day count is larger than the cold day count, set the color to red
        // 2. If the cold day count is larger than the hot day count, set the color equal to blue
        function getColor(countsBoth) {
            if (countsBoth[1]>countsBoth[0]) {
                var color = 'red'
            } else if ((countsBoth[1]<countsBoth[0])) {
                // var color = 'rgb(40, 84, 206)'
                var color = 'rgb(58, 100, 216)'
            };
            return color;
        };//Ends getColor() function

        // Set the ax in the layout object:
        // 1. If the hot day count is larger than the cold day count, set ax = -10 (pointed right)
        // 2. If the cold day count is larger than the hot day count, set ax = 10 (pointed left)
        function getAX(countsBoth) {
                if (countsBoth[1]>countsBoth[0]) {
                    var ax = -10
                    // console.log(color)
                } else if ((countsBoth[1]<countsBoth[0])) {
                    var ax = 10
                };
            return ax;

        };//Ends getAX() function

        // Create the traces for each pair of counts: [cold day count, hot day count]
        var trace1 = {
            x: countsBoth[0],
            y: [0,0],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[0])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace2 = {
            x: countsBoth[1],
            y: [1,1],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[1]),
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace3 = {
            x: countsBoth[2],
            y: [2,2],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[2])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace4 = {
            x: countsBoth[3],
            y: [3,3],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[3])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace5 = {
            x: countsBoth[4],
            y: [4,4],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[4])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace6 = {
            x: countsBoth[5],
            y: [5,5],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[5])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace7 = {
            x: countsBoth[6],
            y: [6,6],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[6])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace8 = {
            x: countsBoth[7],
            y: [7,7],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[7])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace9 = {
            x: countsBoth[8],
            y: [8,8],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[8])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace10 = {
            x: countsBoth[9],
            y: [9,9],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[9])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace11 = {
            x: countsBoth[10],
            y: [10,10],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[10])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace12 = {
            x: countsBoth[11],
            y: [11,11],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[11])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace13 = {
            x: countsBoth[12],
            y: [12,12],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[12])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace14 = {
            x: countsBoth[13],
            y: [13,13],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[13])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace15 = {
            x: countsBoth[14],
            y: [14,14],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[14])
            },
            marker : {
                color: ['blrgb(19, 59, 168)ue','red'],
            }
        };
        var trace16 = {
            x: countsBoth[15],
            y: [15,15],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color: getColor(countsBoth[15])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace17 = {
            x: countsBoth[16],
            y: [16,16],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[16])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace18 = {
            x: countsBoth[17],
            y: [17,17],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[17])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace19 = {
            x: countsBoth[18],
            y: [18,18],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[18])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace20 = {
            x: countsBoth[19],
            y: [19,19],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[19])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };
        var trace21 = {
            x: countsBoth[20],
            y: [20,20],
            type:'scatter',
            mode: 'markers+lines+text',
            line : {
                color:getColor(countsBoth[20])
            },
            marker : {
                color: ['rgb(19, 59, 168)','red'],
            }
        };

        // Set data to an array of all the traces
        data1 = [trace1,trace2,trace3,trace4,trace5,trace6,trace7,trace8,trace9,trace10,trace11,trace12,trace13,trace14,trace15,trace16,trace17,trace18,trace19,trace20,trace21]
        
        // Set the layout for the graph and for each line
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
            },
            annotations: [
                {
                    x: countsBoth[0][1],
                    y: 0,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[0]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[0]),
                    ay: 0
                },{
                    x: countsBoth[1][1],
                    y: 1,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[1]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[1]),
                    ay: 0
                },{
                    x: countsBoth[2][1],
                    y: 2,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[2]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[2]),
                    ay: 0
                },{
                    x: countsBoth[3][1],
                    y: 3,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[3]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[3]),
                    ay: 0
                },{
                    x: countsBoth[4][1],
                    y: 4,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[4]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[4]),
                    ay: 0
                },{
                    x: countsBoth[5][1],
                    y: 5,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[5]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[5]),
                    ay: 0
                },{
                    x: countsBoth[6][1],
                    y: 6,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[6]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[6]),
                    ay: 0
                },{
                    x: countsBoth[7][1],
                    y: 7,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[7]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[7]),
                    ay: 0
                },{
                    x: countsBoth[8][1],
                    y: 8,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[8]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[8]),
                    ay: 0
                },{
                    x: countsBoth[9][1],
                    y: 9,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[9]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[9]),
                    ay: 0
                },{
                    x: countsBoth[10][1],
                    y: 10,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[10]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[10]),
                    ay: 0
                },{
                    x: countsBoth[11][1],
                    y: 11,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[11]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[11]),
                    ay: 0
                },{
                    x: countsBoth[12][1],
                    y: 12,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[12]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[12]),
                    ay: 0
                },{
                    x: countsBoth[13][1],
                    y: 13,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[13]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[13]),
                    ay: 0
                },{
                    x: countsBoth[14][1],
                    y: 14,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[14]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[14]),
                    ay: 0
                },{
                    x: countsBoth[15][1],
                    y: 15,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[15]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[15]),
                    ay: 0
                },{
                    x: countsBoth[16][1],
                    y: 16,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[16]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[16]),
                    ay: 0
                },{
                    x: countsBoth[17][1],
                    y: 17,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[17]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[17]),
                    ay: 0
                },{
                    x: countsBoth[18][1],
                    y: 18,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[18]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[18]),
                    ay: 0
                },{
                    x: countsBoth[19][1],
                    y: 19,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[19]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[19]),
                    ay: 0
                },{
                    x: countsBoth[20][1],
                    y: 20,
                    showarrow: true,
                    arrowcolor:getColor(countsBoth[20]),
                    arrowhead: 3,
                    ax: getAX(countsBoth[20]),
                    ay: 0
                },
                // Add the Cold and Hot text to the top of the graph
                {
                    x: countsBoth[20][1],
                    y: 21,
                    text : 'Hot',
                    font : {
                        color: 'white',
                        size:14
                    },
                    showarrow: false,
                    ax: 0,
                    ay: -20,
                    bordercolor: 'rgb(220, 80, 99)',
                    borderwidth: 1,
                    borderpad: 3,
                    bgcolor: 'rgb(213, 27, 64)',
                    opacity: 0.8
                },{
                    x: countsBoth[20][1],
                    y: 20.5,
                    text : '|',
                    font : {
                        size:16
                    },
                    showarrow: false,
                    ax: 0,
                    ay: -20
                },{
                    x: countsBoth[20][0],
                    y: 21,
                    text : 'Cold',
                    showarrow: false,
                    font : {
                        color: 'white',
                        size:14
                    },
                    ax: 0,
                    ay: -20,
                    bordercolor: 'rgb(39, 118, 209)',
                    borderwidth: 1,
                    borderpad: 3,
                    bgcolor: 'rgb(39, 118, 209)',
                    opacity: 0.8
                },{
                    x: countsBoth[20][0],
                    y: 20.5,
                    text : '|',
                    font : {
                        size:16
                    },
                    showarrow: false,
                    ax: 0,
                    ay: -20
                }         
            ] // Ends annotations
        }; // Ends layout

        // Plot the graph of crime count per area
        Plotly.newPlot('area-graph',data1,layout)
};

// Make it responsive 
// ********** NOTES & ISSUES ***************
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