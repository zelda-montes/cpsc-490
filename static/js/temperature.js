function createTemperatureHeatMap() {

    // set the dimensions and margins of the graph
    const heat_map_margin = {top: 80, right: 25, bottom: 30, left: 40},
    heat_map_width = 7000 - heat_map_margin.left - heat_map_margin.right,
    heat_map_height = 1000 - heat_map_margin.top - heat_map_margin.bottom;

    // append the svg object to the body of the page
    const heat_map_svg = d3.select("#heat_map")
        .append("svg")
        .attr("width", heat_map_width + heat_map_margin.left + heat_map_margin.right)
        .attr("height", heat_map_height + heat_map_margin.top + heat_map_margin.bottom)
        .append("g")
        .attr("transform", `translate(${heat_map_margin.left}, ${heat_map_margin.top})`);

    d3.csv("static/data/temperature.csv").then(function(data) {
        const myGroups = Array.from(new Set(data.map(d => d.year)))
        const myVars = Array.from(new Set(data.map(d => d.month)))

        const colors = ['#0D095B', '#00F', '#127FC0', '#03CFD7', '#01C000', '#01C000', '#F8EF1C', '#FEBB11', '#F26322', '#FE0100'];

        myVars.sort();

        // Build X scales and axis:
        const x = d3.scaleBand()
            .range([ 0, heat_map_width ])
            .domain(myGroups)
            .padding(0.05);
        heat_map_svg.append("g")
            .style("font-size", 15)
            .attr("transform", `translate(0, ${heat_map_height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        const y = d3.scaleBand()
            .range([ heat_map_height, 0 ])
            .domain(myVars)
            .padding(0.05);
            heat_map_svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        const myColor = d3.scaleThreshold()
            .range(colors)
            .domain([-1.8225, -1.34, -1.08, -0.91, -0.73, -0.5575, -0.38, -0.18, 0.04]);

        // create a tooltip
        const tooltip = d3.select("#heat_map")
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
            tooltip
                .style("opacity", 1)
                .text("Temperature variance: " + d.value)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
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
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        heat_map_svg.selectAll()
        .data(data, function(d) {return d.year+':'+d.month;})
        .join("rect")
            .attr("x", function(d) { return x(d.year) })
            .attr("y", function(d) { return y(d.month) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.value)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

        [-1.8225, -1.34, -1.08, -0.91, -0.73, -0.5575, -0.38, -0.18, 0.04]

        heat_map_svg.append("text").attr("cx",0).attr("cy",0).text("Legend:").style("font-size", "20px").attr("transform", `translate(-20, -20)`)

        heat_map_svg.append("circle").attr("cx",100).attr("cy",-25).attr("r", 12).style("fill", "#0D095B")
        heat_map_svg.append("circle").attr("cx",350).attr("cy",-25).attr("r", 12).style("fill", "#00F")
        heat_map_svg.append("circle").attr("cx",480).attr("cy",-25).attr("r", 12).style("fill", "#127FC0")
        heat_map_svg.append("circle").attr("cx",610).attr("cy",-25).attr("r", 12).style("fill", "#03CFD7")
        heat_map_svg.append("circle").attr("cx",740).attr("cy",-25).attr("r", 12).style("fill", "#01C000")
        heat_map_svg.append("circle").attr("cx",870).attr("cy",-25).attr("r", 12).style("fill", "#F8EF1C")
        heat_map_svg.append("circle").attr("cx",1000).attr("cy",-25).attr("r", 12).style("fill", "#FEBB11")
        heat_map_svg.append("circle").attr("cx",1130).attr("cy",-25).attr("r", 12).style("fill", "#F26322")
        heat_map_svg.append("circle").attr("cx",1260).attr("cy",-25).attr("r", 12).style("fill", "#FE0100")
        heat_map_svg.append("text").attr("x", 115).attr("y", -24).text("-1.82 °C and below").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 365).attr("y", -24).text("-1.34 °C").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 495).attr("y", -24).text("-1.08 °C").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 625).attr("y", -24).text("-0.91 °C").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 755).attr("y", -24).text("-0.73 °C").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 885).attr("y", -24).text("-0.55 °C").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 1015).attr("y", -24).text("-0.38 °C").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 1145).attr("y", -24).text("-0.18 °C").style("font-size", "18px").attr("alignment-baseline","middle")
        heat_map_svg.append("text").attr("x", 1275).attr("y", -24).text("0.04 °C and above").style("font-size", "18px").attr("alignment-baseline","middle")

    })
}