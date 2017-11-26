
function drawTopByWeekGraph(data, limit) {

    data = data.filter(x => x.position <= limit).filter(x => x.name != "")


    let dates = Array.from(new Set(data.map(x => x.date)))

    let numberOfWeeks = dates.length;

    console.log(data)

    let svg = d3.select("#canvas").select("svg")


    let width = window.innerWidth

    let imgsize = Math.ceil(width/(limit+1)) - 5

    let height = (imgsize + 5)*numberOfWeeks


    console.log(limit)
    console.log(width)
    console.log(imgsize)
    console.log(height)

    // let height = 2 * window.innerHeight

    svg.attr("height", height)
        .attr("width", width)


    let buffer = 20

    let xscale = d3.scaleLinear()
        .domain([1, limit])
        .range([0, width-imgsize])

    let yscale = d3.scaleLinear()
        .domain([0, dates.length])
        .range([0, height])


    let images = svg.selectAll("image").data(data);

    images.exit().remove()

    images = images.enter().append("image").merge(images)

    

    // let imgsize = 50;


    images
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
        .attr("href", function (d) {
            return "../data/images/"+d.id
        })
        .attr("class", function (d) {
            return d.id
        })
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

function updateCharts() {
    d3.json("../data/top200.json", function (error, data) {
        let limit = document.getElementById('limitSelect').value;
        drawTopByWeekGraph(data, +limit)
    })
}






