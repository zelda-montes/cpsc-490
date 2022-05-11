/* global d3 */

function createNoaaGraph() {
    // set the dimensions and margins of the graph
    const noaa_margin = {top: 10, right: 30, bottom: 20, left: 50},
    noaa_width = 2000 - noaa_margin.left - noaa_margin.right,
    noaa_height = 1000 - noaa_margin.top - noaa_margin.bottom;

    // append the svg object to the body of the page
    const noaa_svg = d3.select("#stacked-bar-chart")
        .append("svg")
            .attr("width", noaa_width + noaa_margin.left + noaa_margin.right)
            .attr("height", noaa_height + noaa_margin.top + noaa_margin.bottom)
        .append("g")
            .attr("transform", `translate(${noaa_margin.left},${noaa_margin.top})`);

    d3.csv("static/data/count.csv").then(function(data) {
        const subgroups = ["DroughtCount", "FloodingCount", "FreezeCount", "SevereStormCount", "TropicalCycloneCount", "WildfireCount", "WinterStormCount"];
        const groups = d3.map(data, function(d){return(d.Year)});
      
        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, noaa_width])
            .padding([0.2])
        noaa_svg.append("g")
          .attr("transform", `translate(0, ${noaa_height})`)
          .call(d3.axisBottom(x).tickSizeOuter(0));
      
        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, 25])
          .range([ noaa_height, 0 ]);
        noaa_svg.append("g")
          .call(d3.axisLeft(y));
      
      
        noaa_svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -noaa_margin.left+20)
                .attr("x", -noaa_margin.top-300)
                .text("Number of Events")
      
        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
          .domain(subgroups)
          .range(d3.schemeSet2);

        console.log(d3.schemeSet2);
      
        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
          .keys(subgroups)
          (data)
      
        // ----------------
        // Create a tooltip
        // ----------------
        const tooltip = d3.select("#stacked-bar-chart")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px")
      
        // ----------------
        // Highlight a specific subgroup when hovered
        // ----------------
      
        // Show the bars
        noaa_svg.append("g")
          .selectAll("g")
          // Enter in the stack data = loop key per key = group per group
          .data(stackedData)
          .join("g")
            .attr("fill", d => color(d.key))
            .attr("class", d => "myRect " + d.key ) // Add a class to each subgroup: their name
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
              .attr("x", d => x(d.data.Year))
              .attr("y", d => y(d[1]))
              .attr("height", d => y(d[0]) - y(d[1]))
              .attr("width",x.bandwidth())
              .attr("stroke", "grey")
              .on("mouseover", function (event,d) { // What happens when user hover a bar
      
                // what subgroup are we hovering?
                const subGroupName = d3.select(this.parentNode).datum().key
      
                const subgroupValue = d.data[subGroupName];
                tooltip
                  .text(subGroupName + ": " + subgroupValue)
                  .style("opacity", 1)
      
                // Reduce opacity of all rect to 0.2
                d3.selectAll(".myRect").style("opacity", 0.2)
      
                // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
                d3.selectAll("."+subGroupName).style("opacity",1)
              })
              .on("mouseleave", function (event,d) { // When user do not hover anymore
      
                // Back to normal opacity: 1
                d3.selectAll(".myRect")
                .style("opacity",1)
      
                tooltip
                .style("opacity", 0)
              })
              .on("mousemove", function(event, d) {
                tooltip.style("transform","translateY(-55%)")
                 .style("left",(event.x-100)+"px")
                 .style("top", (event.y-100)+"px")
              })

              ["DroughtCount", "FloodingCount", "FreezeCount", "SevereStormCount", "TropicalCycloneCount", "WildfireCount", "WinterStormCount"]

        noaa_svg.append("text").text("Legend:").style("font-size", "20px").attr("transform", `translate(40, 20)`)

        noaa_svg.append("circle").attr("cx",50).attr("cy",50).attr("r", 12).style("fill", "#66c2a5")
        noaa_svg.append("circle").attr("cx",50).attr("cy",80).attr("r", 12).style("fill", "#fc8d62")
        noaa_svg.append("circle").attr("cx",50).attr("cy",110).attr("r", 12).style("fill", "#8da0cb")
        noaa_svg.append("circle").attr("cx",50).attr("cy",140).attr("r", 12).style("fill", "#e78ac3")
        noaa_svg.append("circle").attr("cx",50).attr("cy",170).attr("r", 12).style("fill", "#a6d854")
        noaa_svg.append("circle").attr("cx",50).attr("cy",200).attr("r", 12).style("fill", "#ffd92f")
        noaa_svg.append("circle").attr("cx",50).attr("cy",230).attr("r", 12).style("fill", "#e5c494")
        noaa_svg.append("text").attr("x", 70).attr("y", 50).text("Drought").style("font-size", "18px").attr("alignment-baseline","middle")
        noaa_svg.append("text").attr("x", 70).attr("y", 80).text("Flooding").style("font-size", "18px").attr("alignment-baseline","middle")
        noaa_svg.append("text").attr("x", 70).attr("y", 110).text("Freeze").style("font-size", "18px").attr("alignment-baseline","middle")
        noaa_svg.append("text").attr("x", 70).attr("y", 140).text("Severe Storm").style("font-size", "18px").attr("alignment-baseline","middle")
        noaa_svg.append("text").attr("x", 70).attr("y", 170).text("Tropical Cyclone").style("font-size", "18px").attr("alignment-baseline","middle")
        noaa_svg.append("text").attr("x", 70).attr("y", 200).text("Wildfire").style("font-size", "18px").attr("alignment-baseline","middle")
        noaa_svg.append("text").attr("x", 70).attr("y", 230).text("Winter Storm").style("font-size", "18px").attr("alignment-baseline","middle")
      
      })
}