
function drawTopByWeekGraph(data, limit, maxPerWeek, maxStream, minStream) {

    console.log(maxPerWeek)

    data = data.filter(x => x.position <= limit).filter(x => x.name != "")


    let dates = Array.from(new Set(data.map(x => x.date)))

    let numberOfWeeks = dates.length;

    console.log(data)

    let svg = d3.select("#canvas").select("svg")


    let width = window.innerWidth

    let imgsize = Math.ceil(width / (limit + 1)) - 5

    let height = (imgsize + 5) * numberOfWeeks


    console.log(limit)
    console.log(width)
    console.log(imgsize)
    console.log(height)

    // let height = 2 * window.innerHeight

    svg.attr("height", height)
        .attr("width", width)


    let buffer = 20

    // console.log(maxStream)
    // let xscale = d3.scaleLinear()
    //     .domain([+maxStream, +minStream])
    //     .range([0, width - imgsize])

    let xscale = d3.scaleLinear()
        .domain([0, 200])
        .range([0, width - imgsize])

    let yscale = d3.scaleLinear()
        .domain([0, dates.length])
        .range([0, height])


    let images = svg.selectAll("image").data(data);

    images.exit().remove()

    images = images.enter().append("image").merge(images)

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
            // return xscale((+d.streams))
            return xscale(d.features.tempo)
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

function updateCharts() {
    d3.json("../data/top200.json", function (error, data) {
        d3.json("../data/top200ByDate.json", function (error, data2) {
            let maxPerWeek = {};
            let maxStream = 0;
            let minStream = Infinity
            for (let week of data2) {
                let val = d3.max(week.songs, x => +x.streams)
                let min = d3.min(week.songs, x => +x.streams)
                maxPerWeek[week.date] = val
                if (val > maxStream)
                    maxStream = val
                if (min < minStream)
                    minStream = min

            }
            drawTopByWeekGraph(data, 25, maxPerWeek, maxStream, minStream)
        })
        // let limit = document.getElementById('limitSelect').value;

    })
}

// updateCharts()






