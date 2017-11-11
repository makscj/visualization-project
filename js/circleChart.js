function drawCircleChart(data) {

    let xdim = document.getElementById('xdim').value;
    let ydim = document.getElementById('ydim').value;


    let chart = d3.select("#chart").select("svg").style("border", "solid black 2px")

    let buffer = 50;
    let width = 800;
    let height = 800;

    chart.attr("height", height).attr("width", width)

    let circles = chart.selectAll("circle").data(data)

    circles = circles.enter().append("circle").merge(circles);

    let xscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0 + buffer, width - buffer])

    let yscale = d3.scaleLinear()
        .domain([1, 0])
        .range([0 + buffer, height - buffer])

    let colorScale = d3.scaleLinear()
        .domain([d3.min(data, x => x.popularity), 100])
        .range(["#0000ff", "#ff0000"])

    chart.append("g")
        .attr("transform", "translate(0," + (height - buffer) + ")")
        .call(d3.axisBottom(xscale));

    chart.append("g")
        .attr("transform", "translate(" + buffer + "," + 0 + ")")
        .call(d3.axisLeft(yscale));


    let xlabel = chart.selectAll("text#xlabel").data([xdim]);
    xlabel = xlabel.enter().append("text").merge(xlabel);
    xlabel
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height - buffer / 4) + ")")
        .style("text-anchor", "middle")
        .attr("id", "xlabel")
        .text(xdim);

    let ylabel = chart.selectAll("text#ylabel").data([ydim]);
    ylabel = ylabel.enter().append("text").merge(ylabel);

    ylabel
        .attr("transform",
        "translate(" + (buffer / 3) + " ," +
        (height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .attr("id", "ylabel")
        .text(ydim);

    let chartImage = chart.append('g')
        .attr("transform",
        "translate(" + (width - 3 * buffer) + " ," +
        (0) + ")")
        .append("image")
        .attr("width", 3 * buffer)
        .attr("height", 3 * buffer)
        .style("visibility", "hidden")


    let lastClicked = null

    circles
        .transition()
        .duration(500)
        .attr("cx", function (d) {
            return xscale(d.features[xdim])
        })
        .attr("cy", function (d) {
            return yscale(d.features[ydim])
        })
        .attr("r", function (d) {
            return 10
        })
        .style("fill", function (d) {
            return colorScale(d.popularity)
        })
        .style("stroke", "black")
        .style("stroke-width", 0)
    circles.on("mouseover", function (d) {
            console.log(d.song + " by " + d.artists[0])
            chartImage.attr("xlink:href", d.images[1].url)
                .style("visibility", "visible")
        })
        .on("mouseout", function (d) {
            chartImage.style("visibility", "hidden")
        })
        .on("click", function (d) {
            if (lastClicked != null)
                d3.select(lastClicked).attr("r", 10).style("stroke-width", 0)
            loadSpotifyPlayer(d.songId)
            d3.select(this).attr("r", 13).style("stroke-width", 2)

            lastClicked = this
        })
}
