function drawTopByWeekGraph(data, limit) {

    data = data.filter(x => x.position <= limit).filter(x => x.name != "")


    let dates = Array.from(new Set(data.map(x => x.date)))

    let numberOfWeeks = dates.length;

    console.log(data)

    let svg = d3.select("#canvas svg")


    let width = contentWidth

    let imgsize = Math.ceil(width / (limit + 1)) - 1

    let height = (imgsize + 1) * numberOfWeeks


    

    // let height = 2 * window.innerHeight

    svg.attr("height", height)
        .attr("width", width)


    let xscale = d3.scaleLinear()
        .domain([1, limit])
        .range([0, width - imgsize])

    let yscale = d3.scaleLinear()
        .domain([0, dates.length])
        .range([0, height])


    let images = svg.selectAll("image").data(data);

    images.exit().remove()

    images = images.enter().append("image").merge(images)



    // let imgsize = 50;


    images
        .attr("href", function (d) {
            return "../data/images/" + d.id
        })
        .attr("class", function (d) {
            return d.id
        })
        .transition()
        .duration(500)
        .attr("x", function (d) {
            return xscale(d.position)
            // return xscale(d.features[xdim])
        })
        .attr("y", function (d) {
            return yscale(dates.indexOf(d.date))
        })
        .attr("width", imgsize)
        .attr("height", imgsize)
        .style("opacity", .5)

    images
        .on("mouseover", function (d) {
            images.style("opacity", function (im) {
                if (im.id != d.id)
                    return 0.5
                return 1.0
            })
        })
        .on("mouseout", function (d) {
            images.style("opacity", .5)
        })
        .on("click", function (d) {
            console.log(d)
            loadSpotifyPlayer(d.id)
        })


}

function updateTimeCharts() {
    d3.json("../data/top200.json", function (error, data) {
        let limit = document.getElementById('limitSelect').value;
        drawTopByWeekGraph(data, +limit)
    })
}

function loadTime() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(1) a').classed('selected', true)

    if(false)
        addDiv().append('input')
            .attr('type', "text")
            .attr('name', "search")
            .attr('id', "searchentry")
    addDiv('canvas', true)

    d3.select('#weekly-limit').append('select')
        .attr('id', 'limitSelect')
        .on("change", updateTimeCharts)
        .selectAll('option').data([10, 25, 50, 200]).enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)

    updateTimeCharts()
}

loadTime()
