
function drawByDate(data) {


    let limit = 10

    data = data.filter(x => x.position <= limit).filter(x => x.name != "")

    let xdim = document.getElementById('xdim').value;
    let ydim = document.getElementById('ydim').value;



    let dates = Array.from(new Set(data.map(x => x.date)))

    console.log(data)

    let svg = d3.select("#canvas").select("svg")


    let width = window.innerWidth - 200
    let height = 2*window.innerHeight

    svg.attr("height", height)
        .attr("width", width)


    let buffer = 20

    let xscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0 + buffer, width - 200])

    let yscale = d3.scaleLinear()
        .domain([0, dates.length - 1])
        .range([0 + buffer, height])


    let images = svg.selectAll("image").data(data);

    images = images.enter().append("image").merge(images)

    let imgsize = 50;


    images
        .transition()
        .duration(500)
        .attr("x", function (d) {
            // return xscale(d.position / (limit + 0.0))
            return xscale(d.features[xdim])
        })
        .attr("y", function (d) {

            return yscale(dates.indexOf(d.date))
        })
        .attr("width", .75 * imgsize)
        .attr("height", .75 * imgsize)
        .attr("xlink:href", function (d) {
            return d.album.images[1].url
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
            // .attr("width", function (im) {
            //     if (im.id != d.id)
            //         return .75*imgsize
            //     return imgsize
            // })
            // .attr("height", function (im) {
            //     if (im.id != d.id)
            //         return .75*imgsize
            //     return imgsize
            // })
        })
        .on("mouseout", function (d) {
            images.style("opacity", .5)
            // .attr("width", .75 * imgsize)
            // .attr("height", .75 * imgsize)
        })
        .on("click", function (d) {
            loadSpotifyPlayer(d.id)
        })


}

function updateCharts(drawList) {
    d3.json("./data/top200.json", function (error, data) {
        drawByDate(data)
    })
}


function loadSpotifyPlayer(id) {
    let player = d3.select("#spotify-player")
        .selectAll("iframe")
        .data([id])

    player = player.enter()
        .append("iframe")
        .merge(player)

    player
        .attr("width", 250)
        .attr("height", 300)
        .attr("frameborder", 0)
        .attr("allowtransperancy", true)
        .attr("src", "https://open.spotify.com/embed?uri=spotify:track:" + id)
}

d3.text("sidebar.html", function (text) {
    d3.select("#sidebar-wrapper").html(text)
    updateCharts(true)
})


