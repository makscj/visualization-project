function drawAlbumChart(data) {
    let chart = d3.select("#chart-albums svg")


    let xdim = document.getElementById('xdim').value;
    let ydim = document.getElementById('ydim').value;


    let buffer = 50;
    let width = Math.min(window.innerHeight, contentWidth)
    if(width != contentWidth)
        // center horizontally
        chart.attr('transform', 'translate(' + (contentWidth - width) / 2 + ', 0)')
    let height = width

    chart.attr("height", height).attr("width", width)



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

    let xlabel = chart.selectAll("text#xlabelAlbum").data([xdim]);
    xlabel = xlabel.enter().append("text").merge(xlabel);
    xlabel
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height - buffer / 4) + ")")
        //.style("text-anchor", "middle")
        .attr("id", "xlabelAlbum")
        .text(xdim);

    let ylabel = chart.selectAll("text#ylabelAlbum").data([ydim]);
    ylabel = ylabel.enter().append("text").merge(ylabel);

    ylabel
        .attr("transform",
        "translate(" + (buffer / 3) + " ," +
        (height / 2) + ") rotate(-90)")
        //.style("text-anchor", "middle")
        .attr("id", "ylabelAlbum")
        .text(ydim);


    let circles = chart.selectAll("image").data(data)

    circles = circles
        .enter().append("image").merge(circles);

    circles
        .transition()
        .duration(500)
        .attr("x", function (d) {
            return xscale(d.features[xdim])
        })
        .attr("y", function (d) {
            return yscale(d.features[ydim])
        })
        .attr("width", .75 * buffer)
        .attr("height", .75 * buffer)
        .attr("xlink:href", d => d.images[1].url)
        //.style("stroke", "black")
        //.style("stroke-width", 0)

    circles
        .on("mouseover", function (d) {
            console.log(d.song + " by " + d.artists[0])
            d3.select(this)
                .attr("width", 1.5 * buffer)
                .attr("height", 1.5 * buffer)
        })
        .on("mouseout", function (d) {
            d3.select(this).attr("width", .75 * buffer)
                .attr("height", .75 * buffer)
        })
        .on("click", function (d) {
            loadSpotifyPlayer(d.songId)
        })
}
