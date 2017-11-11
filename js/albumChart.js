function drawAlbumChart(data) {
    let chart = d3.select("#chart-albums").append("svg").style("border", "solid black 2px")

    let buffer = 50;
    let width = 800;
    let height = 800;

    chart.attr("height", height).attr("width", width)

    

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


    let circles = chart.selectAll("image").data(data).enter().append("image");

    circles = circles
        .attr("x", function (d) {
            return xscale(d.features.valence)
        })
        .attr("y", function (d) {
            return yscale(d.features.danceability)
        })
        .attr("width", .75*buffer)
        .attr("height", .75*buffer)
        .attr("xlink:href", d => d.images[1].url)
        
        .style("stroke", "black")
        .style("stroke-width", 0)
        .on("mouseover", function (d) {
            console.log(d.song + " by " + d.artists[0])
            d3.select(this)
            .attr("width", 1.5*buffer)
            .attr("height", 1.5*buffer)
        })
        .on("mouseout", function(d){
            d3.select(this).attr("width", .75*buffer)
                .attr("height", .75*buffer)
        })
        .on("click", function (d) {
            loadSpotifyPlayer(d.songId)
        })
}
