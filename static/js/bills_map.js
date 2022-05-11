/* global d3 */

function createEnvironmentalBillsMap() {
    // set the dimensions and margins of the graph
    const map_margin = {top: 10, right: 30, bottom: 20, left: 50},
    map_width = 2000 - map_margin.left - map_margin.right,
    map_height = 1000 - map_margin.top - map_margin.bottom;
  
  
    const map_svg = d3.select("#states")
        .append("svg")
        .attr("width", map_width + map_margin.left + map_margin.right)
        .attr("height", map_height + map_margin.top + map_margin.bottom);
  
    // Map and projection
    const projection = d3.geoAlbersUsa();
  
    // Data and color scale
    let data = new Map()
    const colorScale = d3.scaleThreshold()
          .domain([0, 1, 10, 20, 50, 100, 300])
          .range(d3.schemeBlues[8]);
  
    // Load external data and boot
    Promise.all([
    d3.json("static/data/us-states-geo.json"),
    d3.csv("static/data/environmental_bills.csv", function(d) {
        data.set(d.FIPS, +d.Bills);
    })
    ]).then(function(loadData){
        let topo = loadData[0];

        // create a tooltip
        const tooltip = d3.select("#states")
            .append("div")
            .style("opacity", 0)
            .style('position', 'absolute')
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event,d) {
            console.log(d);
            tooltip
                .style("opacity", 1)
                .text("# of " + d.properties.NAME + " bills: " + d.total)
        }
        const mousemove = function(event,d) {
            tooltip
                .style("transform","translateY(-55%)")
                .style("left",(event.x-100)+"px")
                .style("top", (event.y-100)+"px")
        }
        const mouseleave = function(event,d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "white")
                .style("opacity", 1)
        }
  
        map_svg.selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection))
            .attr("transform","scale(1.85)")
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .style("fill", function(d) {
            d.total = data.get(d.properties.STATE) || 0;
            return colorScale(d.total)});
    })
}