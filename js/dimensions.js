
function drawDimensions(data, limit) {

    // data = data.filter(x => x.position <= limit).filter(x => x.name != "")


    let date = document.getElementById('dateSelect').value;

    data = data.filter(x => x.date == date)[0].songs.filter(x => x.position <= limit)

    let chart = d3.select("#canvas").select("svg").style("border", "solid black 2px")


    let xdim = document.getElementById('xdim').value;
    let ydim = document.getElementById('ydim').value;


    let buffer = 50;
    let width = contentWidth;
    let height = contentWidth*(2.0/3.0);

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
        .style("text-anchor", "middle")
        .attr("id", "xlabelAlbum")
        .text(xdim);

    let ylabel = chart.selectAll("text#ylabelAlbum").data([ydim]);
    ylabel = ylabel.enter().append("text").merge(ylabel);

    ylabel
        .attr("transform",
        "translate(" + (buffer / 3) + " ," +
        (height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .attr("id", "ylabelAlbum")
        .text(ydim);


    let circles = chart.selectAll("image").data(data)

    circles.exit().remove()

    circles = circles
        .enter().append("image").merge(circles);

    circles
        .attr("id", d => d.id)
        .attr("href", d => encodeURI("data/images/" + String(d.id)))//d.album.images[1].url
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


    circles
        .on("mouseover", function (d) {
            console.log(d.name + "\n" + d.artists[0].name)
            d3.select(this)
                .attr("width", 1.5 * buffer)
                .attr("height", 1.5 * buffer)
        })
        .on("mouseout", function (d) {
            d3.select(this).attr("width", .75 * buffer)
                .attr("height", .75 * buffer)
        })
        .on("click", function (d) {
            console.log(d)
            loadSpotifyPlayer(d.id)
        })

}






function updateDimensionCharts() {

    d3.json("data/top200ByDate.json", function (error, data) {
        drawDimensions(data, 50)

    })
}


function loadDimensions() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(4) a').classed('selected', true)

    if (false)
        addDiv().append('input')
            .attr('type', "text")
            .attr('name', "search")
            .attr('id', "searchentry")

    addDiv('canvas', true)

    let dates = ["2016-12-23", "2016-12-30", "2017-01-06", "2017-01-13", "2017-01-20", "2017-01-27", "2017-02-03", "2017-02-10", "2017-02-17", "2017-02-24", "2017-03-03", "2017-03-10", "2017-03-17", "2017-03-24", "2017-03-31", "2017-04-07", "2017-04-14", "2017-04-21", "2017-04-28", "2017-05-05", "2017-05-12", "2017-05-19", "2017-05-26", "2017-06-02", "2017-06-09", "2017-06-16", "2017-06-23", "2017-07-07", "2017-07-14", "2017-07-21", "2017-07-28", "2017-08-11", "2017-08-18", "2017-08-25", "2017-09-01", "2017-09-08", "2017-09-22", "2017-09-29", "2017-10-06", "2017-10-13", "2017-10-20", "2017-10-27", "2017-11-03", "2017-11-10"]




    d3.select('#date-select')
        .append('select')
        .attr('id', 'dateSelect')
        .on("change", updateDimensionCharts)


    for (let date of dates) {
        d3.select("#dateSelect").append("option")
            .attr("value", date)
            .text(date)
    }

    let dims = []

    d3.select('#chart-dim')
        .append('select')
        .attr('id', 'xdim')
        .on("change", updateDimensionCharts)
        .selectAll('option').data(["valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "speechiness"]).enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)

    d3.select('#chart-dim')
        .append('select')
        .attr('id', 'ydim')
        .on("change", updateDimensionCharts)
        .selectAll('option').data(["danceability", "valence", "energy", "acousticness", "instrumentalness", "liveness", "speechiness"]).enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)


    updateDimensionCharts()
}

