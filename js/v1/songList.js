function makeSongList(data){
    let svg = d3.select("#canvas svg")

    let svgWidth = contentWidth
    let numRows = 3
    let marg = oneEm * 2
    let hei = oneEm * 1.5 * numRows 
    svg.attr("width", svgWidth)
    svg.attr("height", (hei + marg) * data.length)

    let imgSize = hei

    let tbody = svg.append("g")
        .attr('transform', 'translate(0, ' + (hei / numRows) + ')')

    let i = 0
    let rows = tbody.selectAll("svg>g>g")
        .data(data)
        .enter()
        .append("g")
        .attr('transform', d => 'translate(0, ' + (i++ * (hei + marg)) + ')')
        .attr('width', svgWidth)

    rows.append('rect')
        .attr('width', svgWidth + oneEm)
        .attr('height', hei + oneEm)
        .attr('x', -oneEm)
        .attr('y', -oneEm * 1.5)


    let cells = rows.selectAll("g")
        .data(function (row) {
            // row.features.popularity = row.popularity
            return [
                {type: "song", value: row.song, translate: [oneEm * 2 + imgSize, 0]},
                {type: "artists", value: row.artists.join(", "), translate: [oneEm * 3 + imgSize, hei / numRows]},
                {type: "popularity", value: 'Popularity: ' + row.popularity, translate: [oneEm * 3 + imgSize, hei / numRows * 2]},
                {type: "features", value: row.features },
                {type: "img", value: row.images[1].url, id: row.songId}
            ]
        })

    let cent = cells.enter()

    cent.filter(d => d.type != 'features' && d.type != "img")
        .append("text")
        .attr('class', d => d.type)
        .text(d => d.value)
        .filter(d => d.translate != null)
            .attr('transform', d => 'translate(' + d.translate[0] + ', ' + d.translate[1] + ')')

    
    cent.filter(d => d.type == "img")
        .append('g')
        .attr('transform', 'translate(' + oneEm / 2 + ', -' + oneEm + ')')
        .attr("class", d=>d.type)
        .append("image")
        .attr("width", imgSize)
        .attr("height", imgSize)
        .attr("xlink:href", d=>d.value)
        .on("click", function(d){
            loadSpotifyPlayer(d.id)
        })

    /*
    let r = 5
    let starWidth = svgWidth / 3
    cent.filter(d => d.type == 'features')
        .append('g')
        .attr('transform', 'translate(' + (svgWidth - starWidth) + ')')
        .attr('class', d => d.type)
        .attr('width', svgWidth / 3)
        .attr('height', hei)
        .each(function(d, i) {
            let svg = d3.select(this)
            let v = d.value
            let data = { 
                'D': v.danceability, 
                'V' : v.valence,
                'E' : v.energy,
                'P' : v.popularity
                // 'L' : v.liveness,
                // 'I' : v.instrumentalness
            }
            drawStarChart(svg, data)
        })

    let features = cells.filter(x => x.type == "features")

    console.log(features)
    console.log(features.data())
    */
}
