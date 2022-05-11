/* global d3 */

// set the dimensions and margins of the graph
const eia_margin = {top: 10, right: 30, bottom: 30, left: 60},
	eia_width = 800 - eia_margin.left - eia_margin.right,
	eia_height = 600 - eia_margin.top - eia_margin.bottom;

// append the svg object to the body of the page
const eia_svg = d3.select("#state_emissions_viz")
	.append("svg")
		.attr("width", eia_width + eia_margin.left + eia_margin.right)
		.attr("height", eia_height + eia_margin.top + eia_margin.bottom)
	.append("g")
		.attr("transform", `translate(${eia_margin.left},${eia_margin.top})`);


// List of groups (here I have one group per column)
var allEiaStates = [ "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]

function createEiaGraph(eiaData) {

    eiaData.forEach(function(d){
        d.year = d3.timeParse("%Y")(d.year)
    })
    var finalEiaData = Object.assign(eiaData.map(({year, emissions}) => ({year, emissions})))

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(finalEiaData, function(d) { return (d.year); }))
      .range([ 0, eia_width ]);
    eia_svg.append("g")
      .attr("transform", "translate(0," + eia_height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(finalEiaData, function(d) { return +d.emissions; })])
      .range([ eia_height, 0 ]);
    eia_svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    eia_svg.append("path")
      .datum(finalEiaData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.emissions) })
        )

    // text label for the y axis
    eia_svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - eia_margin.left)
        .attr("x",0 - (eia_height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Carbon Dioxide (million metric tons)");

    // text label for the x axis
    eia_svg.append("text")             
        .attr("transform",
                "translate(" + (eia_width/2) + " ," + 
                            (eia_height + eia_margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Date");
}