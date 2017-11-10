function drawCircleChart(data) {
    let chart = d3.select("#chart").append("svg").style("border", "solid black 2px")

    let buffer = 50;
    let width = 800;
    let height = 800;

    chart.attr("height", height).attr("width", width)

    let circles = chart.selectAll("circle").data(data).enter().append("circle");

    let xscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0 + buffer, width - buffer])

    let yscale = d3.scaleLinear()
        .domain([1, 0])
        .range([0 + buffer, height - buffer])

    let colorScale = d3.scaleLinear()
        .domain([d3.min(data, x=> x.popularity), 100])
        .range(["#0000ff", "#ff0000"])

    chart.append("g")
        .attr("transform", "translate(0," + (height - buffer) + ")")
        .call(d3.axisBottom(xscale));

    chart.append("g")
        .attr("transform", "translate(" + buffer + "," + 0 + ")")
        .call(d3.axisLeft(yscale));

    chart.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height - buffer / 4) + ")")
        .style("text-anchor", "middle")
        .text("Valence");


    chart.append("text")
        .attr("transform",
        "translate(" + (buffer / 3) + " ," +
        (height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .text("Danceability");

    let chartImage = chart.append('g')
        .attr("transform",
        "translate(" + (width - 3*buffer) + " ," +
        (0) + ")")
        .append("image")
        .attr("width", 3*buffer)
        .attr("height", 3*buffer)
        .style("visibility", "hidden")


    let lastClicked = null

    circles = circles.attr("cx", function (d) {
        return xscale(d.features.valence)
    })
        .attr("cy", function (d) {
            return yscale(d.features.danceability)
        })
        .attr("r", function (d) {
            return 10
        })
        .style("fill", function (d) {
            return colorScale(d.popularity)
        })
        .style("stroke", "black")
        .style("stroke-width", 0)
        .on("mouseover", function (d) {
            console.log(d.song + " by " + d.artists[0])
            chartImage.attr("xlink:href", d.images[1].url)
            .style("visibility", "visible")
        })
        .on("mouseout", function (d) {
            chartImage.style("visibility", "hidden")
        })
        .on("click", function (d) {
            if(lastClicked != null)
                d3.select(lastClicked).attr("r", 10).style("stroke-width", 0)
            loadSpotifyPlayer(d.songId)
            d3.select(this).attr("r", 13).style("stroke-width", 2)
            
            lastClicked = this
        })
}
