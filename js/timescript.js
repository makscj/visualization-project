

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


    let width = window.innerWidth - 200
    let height = 2 * window.innerHeight

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


function drawTopByWeekGraph(data, limit) {

    // console.log(data)


    data = data.filter(x => x.position <= limit).filter(x => x.name != "")

    let genres = new Map()
    for (let item of data) {
        for (let genre of item.genres) {
            if (!genres.has(genre))
                genres.set(genre, 0)
            let amount = genres.get(genre) + 1

            genres.set(genre, amount)
        }
    }
    let genreCounts = []
    for (let g of genres)
        genreCounts.push({ genre: g[0], count: g[1] })

    // console.log(genreCounts.sort((a, b) => b.count - a.count).filter(x => x.count > 0))





    let xdim = document.getElementById('xdim').value;
    let ydim = document.getElementById('ydim').value;



    let dates = Array.from(new Set(data.map(x => x.date)))

    console.log(data)

    let svg = d3.select("#canvas").select("svg")


    let width = window.innerWidth - 200
    let height = 2 * window.innerHeight

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
            return xscale(d.position / (limit + 0.0))
            // return xscale(d.features[xdim])
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


function drawByGenre(data) {


    data = data.filter(x => x.song.name != "")
    console.log(data)

    let totalSongs = new Set(data)

    // let limit = 25

    // data = data.filter(x => x.position <= limit).filter(x => x.name != "")

    let genres = Array.from(new Set(data.map(x => x.song.genres).reduceRight((a, b) => a.concat(b), [])))

    // let songIds = Array.from(new Set(data.map(x => x.id)))

    console.log(genres)

    let m = {}

    for (let genre of genres) {
        m[genre] = [];
    }

    for (let song of data) {
        for (let genre of song.song.genres) {
            m[genre].push(song)
        }
    }

    let genredata = [];

    for (let genre of genres) {
        genredata.push({
            genre: genre,
            songs: m[genre]
        })
    }

    let topGenres = genredata.filter(x => x.songs.length > 100)

    console.log(topGenres)

    let topSongs = new Set(topGenres.map(x => x.songs).reduceRight((a, b) => a.concat(b), []))

    console.log(topSongs)


    let leftOver = totalSongs.difference(topSongs)

    console.log(leftOver)


    // let genres = new Map()
    // for (let item of data) {
    //     for (let genre of item.genres) {
    //         if (!genres.has(genre))
    //             genres.set(genre, 0)
    //         let amount = genres.get(genre) + 1

    //         genres.set(genre, amount)
    //     }
    // }
    // let genreCounts = []
    // for (let g of genres)
    //     genreCounts.push({ genre: g[0], count: g[1] })

    // console.log(genreCounts.sort((a,b) => b.count - a.count).filter(x => x.count > 0))
}

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


function song(data) {
    console.log(data)
    let songs = {};
    let ids = Array.from(new Set(data.map(x => x.id)));

    console.log(ids)

    for (let id of ids) {
        songs[id] = { id: id, chart: [], artists: null, album: null, song: null }
    }

    for (let entry of data) {
        let id = entry.id;

        songs[id].chart.push({
            position: entry.position,
            date: entry.date,
            streams: entry.streams
        })

        songs[id].album = entry.album
        songs[id].artists = {
            artists: entry.artists,
            followers: entry.followers.total,
        }

        songs[id].song = {
            name: entry.name,
            duration: entry.duration,
            explicit: entry.explicit,
            features: entry.features,
            markets: entry.markets,
            genres: entry.genres,
        }

    }



    let out = []

    for (let id of ids) {
        out.push(songs[id])
    }


    download(JSON.stringify(out), "songs.json")


}

function updateCharts(drawList) {
    // search()
    d3.json("./data/top200.json", function (error, data) {
        drawTopByWeekGraph(data, 25)
        // drawByGenre(data)
        // song(data);
    })

    d3.json("./data/songs.json", function (error, data) {
        // drawTopByWeekGraph(data, 25)
        // drawByGenre(data)
        // search(data)
        // song(data);
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


