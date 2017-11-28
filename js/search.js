function search() {
    $("#searchentry").keyup(function (event) {
        if (event.keyCode === 13) {
            d3.json("./data/songs.json", function (error, data) {
                let searchList = data.filter(x => x.song.name != "").map(x => {
                    return {
                        str: x.song.name + " " + x.artists.artists.map(y => y.name).join(" "),
                        id: x.id
                    }
                })
                let value = document.getElementById('searchentry').value;
                let nvalue = value.split(" ").join(".*")
                let matches = searchList.filter(x => x.str.match(new RegExp(".*" + nvalue + ".*", "i"))).map(x => x.id)
                d3.json("./data/top200.json", function (error, data) {
                    drawTopByWeekGraphwithSearch(data, 25, matches)
                })
            })
        }
    });
}

function drawTopByWeekGraphwithSearch(data, limit, ids) {
    data = data.filter(x => x.position <= limit).filter(x => x.name != "")

    let xdim = document.getElementById('xdim').value;
    let ydim = document.getElementById('ydim').value;


    let opacities = {
        hover: 1.0,
        default: 0.5,
        exclude: 0.1
    }

    let dates = Array.from(new Set(data.map(x => x.date)))


    let svg = d3.select("#canvas").select("svg")


    let width = contentWidth
    let height = 2 * window.innerHeight

    svg.attr("height", height)
        .attr("width", width)


    let xscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width - 200])

    let yscale = d3.scaleLinear()
        .domain([0, dates.length - 1])
        .range([0, height])


    let images = svg.selectAll("image").data(data);

    images.exit().remove()

    images = images.enter().append("image").merge(images)


    let imgsize = 50;


    images
        .transition()
        .duration(500)
        .attr("x", function (d) {
            return xscale(d.position / (limit + 0.0))
            // return xscale(d.features[xdim])
        })
        .attr("y", function (d) {

            return yscale(dates.indexOf(d.date))
        })
        .attr("width", .75 * imgsize)
        .attr("height", .75 * imgsize)
        .attr("xlink:href", function (d) {
            let url = "./data/images2/" + d.id;
            return url
        })
        .attr("class", function (d) {
            return d.id
        })
        .style("opacity", function (im) {

            if (ids.indexOf(im.id) == -1)
                return opacities.exclude
            return opacities.default
        })

    images
        .on("mouseover", function (d) {
            images.style("opacity", function (im) {
                if (im.id != d.id) {
                    if (ids.indexOf(im.id) == -1)
                        return opacities.exclude
                    return opacities.default
                }

                return opacities.hover
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
            images.style("opacity", function (im) {
                if (ids.indexOf(im.id) == -1) {
                    return opacities.exclude
                }
                return opacities.default
            })
            // .attr("width", .75 * imgsize)
            // .attr("height", .75 * imgsize)
        })
        .on("click", function (d) {
            console.log(d)
            loadSpotifyPlayer(d.id)
        })

}
