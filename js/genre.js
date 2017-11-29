let opacity = {
    default: 0.35,
    hover: 1.0,
    rap: 0.5
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

    console.log(genreLookup)

    d3.json("data/top200.json", function (error, weekly) {
        weekly = weekly.filter(x => x.position <= 50)
        for (let song of weekly) {
            let genres = song.genres
            let bGenre = d3.min(genres.map(x => genreLookup.indexOf(x)))
            song.genre = bGenre == undefined ? "" : genreLookup[bGenre]
        }

        drawSongsWithGenre(weekly, 50)


    })



    // for (let song of data) {
    //     let genres = song.song.genres
    //     let bGenre = d3.min(genres.map(x => genreLookup.indexOf(x)))
    //     song.song.genre = bGenre == undefined ? "" : genreLookup[bGenre]
    //     // console.log(song.song.name + " " + song.artists.artists[0].name + " " + genreLookup[bGenre] + " " + bGenre)
    // }

    // console.log(data)

    drawChordDiagram(genreList)
    drawGenreBars(genreList)

    // drawSongsWithGenre()

}

function drawSongsWithGenre(data, limit) {
    a = ["pop", "tropical house", "post-teen pop", "dance pop", "pop rap", "rap", "trap music", "dwn trap", "southern hip hop", "hip hop"]
    let b = ["0055ff", "39438e", "9ca6f4", "4b5ff4", "aa66ff", "ff0033", "5b271e", "ce4c35", "f4d3cd", "ed9282"]

    let colors = {}
    a.forEach((x, i) => {
        colors[x] = b[i]
    })


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


    let images = svg.selectAll("rect").data(data);
    images.exit().remove()
    images = images.enter().append("rect").merge(images)

    let hideRap = 0.5


    // let imgsize = 50;


    images
        .style("fill", function(d){
            return colors[d.genre]
        })
        .attr("class", function (d) {
            if(d.genres.length > 0){
                return "box " + d.id + " " + d.genres.map(x => x.replace(/ /g, "-")).join(" ")
            }
            return "box " + d.id
            
        })
        .transition()
        .duration(500)
        .attr("x", function (d) {
            return xscale(d.position)
        })
        .attr("y", function (d) {
            return yscale(dates.indexOf(d.date))
        })
        .attr("width", imgsize)
        .attr("height", imgsize)
        .style("opacity", d => {
            if(a.indexOf(d.genre) >= 4)
                return hideRap
            return 0.5
        })

    images
        .on("mouseover", function (d) {
            images.style("opacity", function (im) {
                if (im.id == d.id)
                    return opacity.hover
                if(a.indexOf(im.genre) >= 4)
                    return opacity.rap
                return opacity.default
            })

            let joinedGenres = d.genres.map(x => x.replace(/ /g, "-")).map(x => ".genre."+x+",.bar."+x+",.ribbon."+x).join(",")

            d3.selectAll(joinedGenres).style("opacity", opacity.hover)


            

        })
        /*
        function (d) {
            images.style("opacity", im => {
                if(a.indexOf(im.genre) >= 4)
                    return opacity.rap
                return opacity.default
            })
        }
        */
        .on("mouseout", resetCharts)
        .on("click", function (d) {
            console.log(d)
            loadSpotifyPlayer(d.id)
        })


}


function drawGenreBars(genreList) {



    let top10 = genreList.filter(x => x.songs.length > 100)

    a = ["pop", "tropical house", "post-teen pop", "dance pop", "pop rap", "rap", "trap music", "dwn trap", "southern hip hop", "hip hop"]
    let b = ["0055ff", "39438e", "9ca6f4", "4b5ff4", "aa66ff", "ff0033", "5b271e", "ce4c35", "f4d3cd", "ed9282"]

    let colors = {}
    a.forEach((x, i) => {
        colors[x] = b[i]
    })



    let width = 300
    let height = 300

    let padding = 40

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
        .attr("transform", "translate(" + (padding) + "," + (0) + ")")

    bars = bars.enter().append("rect")
        .attr("class", function(d){
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
            return colors[d.genre]
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
    let genreColors = ["0055ff", "39438e", "9ca6f4", "4b5ff4", "aa66ff", "ff0033", "5b271e", "ce4c35", "f4d3cd", "ed9282"]

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



    let width = 300
    let height = 300

    let svg = d3.select("#chord").select("svg")
        .attr("width", width + 100)
        .attr("height", height + 100)

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

    var color = d3.scaleOrdinal()
        .domain(d3.range(10))
        .range(genreColors);

    var g = svg.append("g")
        .attr("transform", "translate(" + (width / 2 + 100) + "," + (height / 2 + 50) + ")")
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
        .style("fill", function (d) { return color(d.index); })
        .style("stroke", function (d) { return d3.rgb(color(d.index)).darker(); })
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

    // groupTick.append("line")
    //     .attr("x2", 6);

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
        .style("fill", function (d) { return color(d.target.index); })
        .style("stroke", function (d) { return d3.rgb(color(d.target.index)).darker(); })
        .on("mouseover", function (d) {
            let classes = d3.select(this).attr("class").split(" ");
            let srcGenre = classes[1]
            let trgGenre = classes[2]

            console.log(".bar."+trgGenre + ",.bar."+srcGenre)            

            d3.selectAll("." + trgGenre+"." + srcGenre).style("opacity", opacity.hover)
            d3.selectAll(".bar."+trgGenre + ",.bar."+srcGenre).style("opacity", opacity.hover)
            d3.selectAll(".genre."+trgGenre + ",.genre."+srcGenre).style("opacity", opacity.hover)

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

function updateGenreCharts() {
    d3.json("../data/songs.json", function (error, data) {
        // let limit = document.getElementById('limitSelect').value;
        drawByGenre(data)
    })
}


function resetCharts(){
    d3.selectAll(".ribbons,.box,.genre,.bar").style("opacity", opacity.default)
}

function loadGenre() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(2) a').classed('selected', true)

    if (false)
        addDiv().append('input')
            .attr('type', "text")
            .attr('name', "search")
            .attr('id', "searchentry")
    addDiv('bars', true)
    addDiv('chord', true)
    addDiv('canvas', true)

    // d3.select('#weekly-limit').append('select')
    //     .attr('id', 'limitSelect')
    //     .on("change", updateTimeCharts)
    //     .selectAll('option').data([10, 25, 50, 200]).enter()
    //     .append('option')
    //     .attr('value', d => d)
    //     .text(d => d)

    updateGenreCharts()
}