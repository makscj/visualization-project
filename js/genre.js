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


    drawChordDiagram(genreList)
    drawGenreBars(genreList)


}


function drawGenreBars(genreList){



    let top10 = genreList.filter(x => x.songs.length > 100)
    console.log(top10)

    a = ["pop", "tropical house", "post-teen pop", "dance pop", "pop rap", "rap", "trap music", "dwn trap", "southern hip hop", "hip hop"]
    let b = ["0055ff", "39438e", "9ca6f4", "4b5ff4", "aa66ff", "ff0033", "5b271e", "ce4c35", "f4d3cd", "ed9282"]

    let colors =  {}
    a.forEach((x,i) => {
        colors[x] = b[i]
    })

    console.log(colors)


    let width = 960
    let height = 960

    let padding = 200

    let svg = d3.select("#bars").select("svg")
        .attr("width", width)
        .attr("height", height)


   
    
    let bars = svg.selectAll("rect").data(top10)

    bars.exit().remove();

    let xscale = d3.scaleLinear()
        .domain([0, 9])
        .range([padding, width - padding])

    console.log(d3.max(top10.map(x => x.songs.length)))

    let yscale = d3.scaleLinear()
        .domain([0,d3.max(top10.map(x => x.songs.length))])
        .range([height - 10, padding])

        svg.append("g")
        .call(d3.axisLeft(yscale))
        .attr("transform", "translate(" + (padding-10) + "," + (0) + ")")

    bars = bars.enter().append("rect")
        .attr("x", function(d, i){
            console.log(d.genre + " " + i)
            return xscale(i)
        })
        .attr("y", function(d, i){
            console.log(d.genre + " " + i)
            return yscale(d.songs.length)
        })
        .attr("width", function(d){
            return 50
        })
        .attr("height", function(d, i){
            console.log(d.genre + " " + (height - yscale(d.songs.length)))
            return height - yscale(d.songs.length) - 10
        })
        .style("fill", function(d){
            return colors[d.genre]
        })
        .on("mouseover", function(d){
            console.log(d.genre)
        })
        

}


function drawChordDiagram(genreList) {
    let top10 = genreList.filter(x => x.songs.length > 100)

    let topGenres = top10.map(x => x.genre)
    topGenres = ["pop", "tropical house", "post-teen pop", "dance pop", "pop rap", "rap", "trap music", "dwn trap", "southern hip hop", "hip hop"]
    let genreColors = ["0055ff", "39438e", "9ca6f4", "4b5ff4", "aa66ff", "ff0033", "5b271e", "ce4c35", "f4d3cd", "ed9282"]

    let chordMatrix = {};

    // console.log(top10)



    // console.log(topGenres)
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



    let width = 960
    let height = 960

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

    group.append("path")
        .style("fill", function (d) { return color(d.index); })
        .style("stroke", function (d) { return d3.rgb(color(d.index)).darker(); })
        .attr("class", function (d) {
            return "genre " + topGenres[d.index].replace(" ", "-")
        })
        .attr("d", arc)
        .on("mouseover", function (d) {
            let classes = d3.select(this).attr("class").split(" ");
            let srcGenre = classes[1]
            let trgGenre = classes[1]

            d3.selectAll("." + trgGenre).style("opacity", 1.0)

        })
        .on("mouseout", function (d) {
            d3.selectAll(".ribbons").style("opacity", 0.4)
        })

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

    g.append("g")
        .selectAll("path")
        .data(function (chords) { return chords; })
        .enter().append("path")
        .attr("d", ribbon)
        .style("opacity", 0.4)
        .attr("class", function (d) {
            return "ribbons " + topGenres[d.source.index].replace(" ", "-") + " " + topGenres[d.target.index].replace(" ", "-")
        })
        .style("fill", function (d) { return color(d.target.index); })
        .style("stroke", function (d) { return d3.rgb(color(d.target.index)).darker(); })
        .on("mouseover", function (d) {
            let classes = d3.select(this).attr("class").split(" ");
            let srcGenre = classes[1]
            let trgGenre = classes[2]

            d3.selectAll("." + trgGenre).style("opacity", 1.0)

        })
        .on("mouseout", function (d) {
            d3.selectAll(".ribbons").style("opacity", 0.4)
        })

    // Returns an array of tick angles and values for a given group and step.
    function groupTicks(d, step) {
        var k = (d.endAngle - d.startAngle) / d.value;
        return d3.range(0, d.value, step).map(function (value) {
            return { value: value, angle: value * k + d.startAngle, index: d.index };
        });
    }
}

function updateCharts() {
    d3.json("../data/songs.json", function (error, data) {
        // let limit = document.getElementById('limitSelect').value;
        drawByGenre(data)
    })
}