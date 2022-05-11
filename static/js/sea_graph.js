/* global d3 */

function createSeaLineGraph() {
    // set the dimensions and margins of the graph
    const sea_level_margin = {top: 10, right: 30, bottom: 30, left: 60},
    sea_level_width = 800 - sea_level_margin.left - sea_level_margin.right,
    sea_level_height = 600 - sea_level_margin.top - sea_level_margin.bottom;

    // append the svg object to the body of the page
    const sea_level_svg = d3.select("#sea-level-viz")
    .append("svg")
        .attr("width", sea_level_width + sea_level_margin.left + sea_level_margin.right)
        .attr("height", sea_level_height + sea_level_margin.top + sea_level_margin.bottom)
    .append("g")
        .attr("transform", `translate(${sea_level_margin.left},${sea_level_margin.top})`);

        d3.csv("static/data/sea_level.csv",
        // When reading the csv, I must format variables:
        function(d){
          return { date : d3.timeParse("%Y")(d.Year), value : parseInt(d.mm) }
        }).then(function(data) {
            // Add X axis --> it is a date format
            var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return (d.date); }))
              .range([ 0, sea_level_width ]);
            sea_level_svg.append("g")
              .attr("transform", "translate(0," + sea_level_height + ")")
              .call(d3.axisBottom(x));
      
            // Add Y axis
            var y = d3.scaleLinear()
              .domain([-20, d3.max(data, function(d) { return + parseInt(d.value); })])
              .range([ sea_level_height, 0 ]);
            sea_level_svg.append("g")
              .call(d3.axisLeft(y));
            
              // Add the line
            sea_level_svg.append("path")
              .datum(data)
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-width", 1.5)
              .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return parseInt(y(d.value)) })
                )
      
            // text label for the y axis
            sea_level_svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - sea_level_margin.left)
                .attr("x",0 - (sea_level_height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Sea Level Rise (in mm)");
      
            // text label for the x axis
            sea_level_svg.append("text")             
                .attr("transform",
                        "translate(" + (sea_level_width/2) + " ," + 
                                    (sea_level_height + sea_level_margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Year");
      })
}