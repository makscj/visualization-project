let opacity = {
    default: 0.2,
    hover: 1.0,
    rap: 0.2
}

let listTopGenres = ["pop", "tropical house", "post-teen pop", "dance pop", "pop rap", "rap", "trap music", "dwn trap", "southern hip hop", "hip hop"]
let listTopGenreColors = ["0055ff", "39438e", "9ca6f4", "4b5ff4", "aa66ff", "ff0033", "5b271e", "ce4c35", "f4d3cd", "ed9282"]

let genreColors = {}
listTopGenres.forEach((x, i) => {
    genreColors[x] = listTopGenreColors[i]
})

function drawByGenre(data, toggled) {


    data = data.filter(x => x.song.name != "")
    console.log(data)

    let totalSongs = new Set(data)


    let genres = Array.from(new Set(data.map(x => x.song.genres).reduceRight((a, b) => a.concat(b), [])))


    let songsPerGenre = {}

    for (let genre of genres) {
        songsPerGenre[genre] = [];
    }

    for (let song of data) {
        for (let genre of song.song.genres) {
            songsPerGenre[genre].push(song)
        }
    }



    let genreList = [];

    for (let genre of genres) {
        genreList.push({
            genre: genre,
            songs: songsPerGenre[genre]
        })
    }

    genreList.sort((a, b) => b.songs.length - a.songs.length)

    let genreLookup = genreList.map(x => x.genre)


    d3.json("data/top200.json", function (error, weekly) {
        weekly = weekly.filter(x => x.position <= 50).filter(x => x.name != "")
        for (let song of weekly) {
            let genres = song.genres
            let bGenre = d3.min(genres.map(x => genreLookup.indexOf(x)))
            song.genre = bGenre == undefined ? "" : genreLookup[bGenre]
        }

        drawSongsWithGenre(weekly, 50)
    })

    if (!toggled) {
        drawChordDiagram(genreList)
        drawGenreBars(genreList)
    }



}


function drawSongsWithGenre(data, limit) {



    let isChecked = document.getElementById('displayImage').checked;

    let shape = isChecked ? "image" : "rect"
    let oldShape = isChecked ? "rect" : "image"



    let dates = Array.from(new Set(data.map(x => x.date)))
    let numberOfWeeks = dates.length;
    let svg = d3.select("#canvas svg")
    let width = contentWidth
    let imgsize = Math.ceil(width / (limit + 1)) - 1
    let height = (imgsize + 1) * numberOfWeeks


    svg.attr("height", height)
        .attr("width", width)


    let xscale = d3.scaleLinear()
        .domain([1, limit])
        .range([0, width - imgsize])
    let yscale = d3.scaleLinear()
        .domain([0, dates.length])
        .range([0, height])

    let images = svg.selectAll(oldShape).data([])
    images.exit().remove()



    images = svg.selectAll(shape).data(data);
    images.exit().remove()
    images = images.enter().append(shape).merge(images)




    images
        .style("fill", function (d) {
            return genreColors[d.genre]
        })
        .attr("href", function (d) {
            return "data/images/" + d.id
        })
        .attr("class", function (d) {
            if (d.genres.length > 0) {
                return "box " + d.id + " " + fixGenres(d.genres).join(" ")
            }
            return "box " + d.id

        })
        .attr("x", function (d) {
            return xscale(d.position)
        })
        .attr("y", function (d) {
            return yscale(dates.indexOf(d.date))
        })
        .attr("width", imgsize)
        .attr("height", imgsize)
        .style("opacity", d => {
            // if(a.indexOf(d.genre) >= 4)
            //     return opacity.rap
            return opacity.default
        })

    images
        .on("mouseover", function (d) {
            images.style("opacity", function (im) {
                if (im.id == d.id)
                    return opacity.hover
                // if(a.indexOf(im.genre) >= 4)
                //     return opacity.rap
                return opacity.default
            })
            let joinedGenres = fixGenres(d.genres).map(x => ".genre." + x + ",.bar." + x + ",.ribbon." + x).join(",")
            d3.selectAll(joinedGenres).style("opacity", opacity.hover)

        })

        .on("mouseout", resetCharts)
        .on("click", function (d) {
            console.log(d)
            loadSpotifyPlayer(d.id, true)
        })


}


function fixGenres(genres) {
    return genres.map(x => x.replace(/ /g, "-")).filter(x => x.indexOf("&") == -1)
}


function drawGenreBars(genreList) {



    let top10 = genreList.filter(x => x.songs.length > 100)


    let width = sidebarWidth - 20
    let height = sidebarWidth - 20

    let padding = 200

    let svg = d3.select("#bars").select("svg")
        .attr("width", width)
        .attr("height", height)




    let bars = svg.selectAll("rect").data(top10)

    bars.exit().remove();

    let xscale = d3.scaleLinear()
        .domain([0, 9])
        .range([padding, width - padding])


    let yscale = d3.scaleLinear()
        .domain([0, d3.max(top10.map(x => x.songs.length))])
        .range([height - 10, padding])

    svg.append("g")
        .call(d3.axisLeft(yscale))
        .attr("transform", "translate(" + (padding-10) + "," + (0) + ")")

    bars = bars.enter().append("rect")
        .attr("class", function (d) {
            return "bar " + d.genre.replace(/ /g, "-")
        })
        .attr("x", function (d, i) {
            return xscale(i)
        })
        .attr("y", function (d, i) {
            return yscale(d.songs.length)
        })
        .attr("width", function (d) {
            return width / 10 - padding / 4
        })
        .attr("height", function (d, i) {
            return height - yscale(d.songs.length) - 10
        })
        .style("fill", function (d) {
            return genreColors[d.genre]
        })
        .style("opacity", opacity.default)
        .on("mouseover", function (d) {
            d3.selectAll("." + d.genre.replace(/ /g, "-")).style("opacity", opacity.hover)
        })
        .on("mouseout", resetCharts)


}


function drawChordDiagram(genreList) {
    let top10 = genreList.filter(x => x.songs.length > 100)

    let topGenres = top10.map(x => x.genre)
    topGenres = ["pop", "tropical house", "post-teen pop", "dance pop", "pop rap", "rap", "trap music", "dwn trap", "southern hip hop", "hip hop"]
    // let genreColors = ["0055ff", "39438e", "9ca6f4", "4b5ff4", "aa66ff", "ff0033", "5b271e", "ce4c35", "f4d3cd", "ed9282"]

    let chordMatrix = {};





    for (let genre of topGenres) {
        for (let genre2 of topGenres) {
            if (!(genre in chordMatrix)) {
                chordMatrix[genre] = {}
            }
            chordMatrix[genre][genre2] = 0
        }
    }


    for (let genreGroup of top10) {
        let genre = genreGroup.genre
        for (let song of genreGroup.songs) {
            let genres = song.song.genres;
            for (let genre2 of genres) {
                if (topGenres.indexOf(genre2) > -1) {
                    chordMatrix[genre][genre2] += 1
                }
            }
        }
    }

    let matrix = []



    for (let genre in topGenres) {
        matrix.push([])
        for (let genre2 in topGenres) {
            if (genre == genre2)
                matrix[genre][genre2] = 0
            else
                matrix[genre][genre2] = chordMatrix[topGenres[genre]][topGenres[genre2]]
        }
    }


    console.log(sidebarWidth)

    let width = sidebarWidth - 20
    let height = sidebarWidth - 20

    let svg = d3.select("#chord").select("svg")
        .attr("width", width)
        .attr("height", height)

    let outerRadius = Math.min(width, height) * 0.5 - 40
    let innerRadius = outerRadius - 30;

    var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);


    let chords = chord(matrix);



    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var ribbon = d3.ribbon()
        .radius(innerRadius);



    var g = svg.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .datum(chords);


    var group = g.append("g")
        .attr("class", "groups")
        .selectAll("g")
        .data(function (c) {
            return c.groups;
        })
        .enter().append("g");

    //Outside Genre Section
    group.append("path")
        .style("fill", function (d) { return genreColors[topGenres[d.index]]; })
        .style("stroke", function (d) { return d3.rgb(genreColors[topGenres[d.index]]).darker(); })
        .style("opacity", opacity.default)
        .attr("class", function (d) {
            return "genre " + topGenres[d.index].replace(/ /g, "-")
        })
        .attr("d", arc)
        .on("mouseover", function (d) {
            let classes = d3.select(this).attr("class").split(" ");
            let srcGenre = classes[1]
            let trgGenre = classes[2]
            d3.selectAll("." + trgGenre + ",." + srcGenre).style("opacity", opacity.hover)

        })
        .on("mouseout", resetCharts)

    groupTick = group.append("g")

    var groupTick = group.selectAll(".group-tick")
        .data(function (d) { return groupTicks(d, 1e3); })
        .enter().append("g")
        .attr("class", "group-tick")
        .attr("transform", function (d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });


    groupTick
        .append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
        .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
        .text(function (d) {
            return topGenres[d.index];
        });

    //Ribbon between genres
    g.append("g")
        .selectAll("path")
        .data(function (chords) { return chords; })
        .enter().append("path")
        .attr("d", ribbon)
        .style("opacity", opacity.default)
        .attr("class", function (d) {
            return "ribbons " + topGenres[d.source.index].replace(/ /g, "-") + " " + topGenres[d.target.index].replace(/ /g, "-")
        })
        .style("fill", function (d) { return genreColors[topGenres[d.target.index]]; })
        .style("stroke", function (d) { return d3.rgb(genreColors[topGenres[d.target.index]]).darker(); })
        .on("mouseover", function (d) {
            let classes = d3.select(this).attr("class").split(" ");
            let srcGenre = classes[1]
            let trgGenre = classes[2]

            d3.selectAll("." + trgGenre + "." + srcGenre).style("opacity", opacity.hover)
            d3.selectAll(".bar." + trgGenre + ",.bar." + srcGenre).style("opacity", opacity.hover)
            d3.selectAll(".genre." + trgGenre + ",.genre." + srcGenre).style("opacity", opacity.hover)

        })
        .on("mouseout", resetCharts)

    // Returns an array of tick angles and values for a given group and step.
    function groupTicks(d, step) {
        var k = (d.endAngle - d.startAngle) / d.value;
        return d3.range(0, d.value, step).map(function (value) {
            return { value: value, angle: value * k + d.startAngle, index: d.index };
        });
    }
}

function updateGenreCharts(toggled) {

    d3.json("data/songs.json", function (error, data) {
        // let limit = document.getElementById('limitSelect').value;
        drawByGenre(data, toggled)
    })
}


function resetCharts() {
    d3.selectAll(".ribbons,.box,.genre,.bar").style("opacity", opacity.default)
}

function loadGenre() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(2) a').classed('selected', true);

    if (false)
        addDiv().append('input')
            .attr('type', "text")
            .attr('name', "search")
            .attr('id', "searchentry")
    // addDiv('bars', true)
    // addDiv('chord', true)
    addDiv('canvas', true)

    // d3.select('#weekly-limit').append('select')
    //     .attr('id', 'limitSelect')
    //     .on("change", updateTimeCharts)
    //     .selectAll('option').data([10, 25, 50, 200]).enter()
    //     .append('option')
    //     .attr('value', d => d)
    //     .text(d => d)

    d3.select("#toggle")
        .append("div")
        .text("Display Album Covers")
        .append('input')
        .attr("type", "checkbox")
        .attr("id", "displayImage")
        .on("change", toggle)

    d3.select("#side-chart")
        .append("div")
        .attr("id", "bars")
        .append("svg")

    d3.select("#side-chart")
        .append("div")
        .attr("id", "chord")
        .append("svg")

    updateGenreCharts(false)
}

function toggle() {
    updateGenreCharts(true)
}

function updateCharts() {
    d3.json("../data/songs.json", function (error, data) {
        // let limit = document.getElementById('limitSelect').value;
        drawByGenre(data)
    })
}
