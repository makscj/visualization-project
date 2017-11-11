function makeSongList(data){
    let svg = d3.select("#canvas")
    let bounds = svg.node().getBoundingClientRect()
    svg = svg.append("svg")
    let svgWidth = bounds.width

    let numRows = 3
    let hei = 25 * numRows 
    let marg = 10
    svg.attr("width", svgWidth)
    svg.attr("height", hei * data.length)

    let imgSize = hei

    let tbody = svg.append("g")
        .attr('transform', 'translate(' + imgSize + ', ' + (hei / numRows) + ')')

    let i = 0
    let rows = tbody.selectAll("svg>g>g")
        .data(data)
        .enter()
        .append("g")
        .attr('transform', d => 'translate(0, ' + (i++ * (hei + marg)) + ')')




    let cells = rows.selectAll("g")
        .data(function (row) {
            row.features.popularity = row.popularity
            return [
                {type: "song", value: row.song },
                {type: "artists", value: row.artists.join(", ") },
                {type: "popularity", value: 'Popularity: ' + row.popularity/100.0 },
                {type: "features", value: row.features },
                {type: "img", value: row.images[1].url, id: row.songId}
            ]
        })

    let cent = cells.enter()

    cent.filter(d => d.type != 'features' && d.type != "img")
        .append("text")
        .attr('class', d => d.type)
        .text(d => d.value)

    cent.select('.artists')
        .attr('transform', 'translate(20, ' + (hei / numRows) + ')')

    cent.select('.popularity')
        .attr('transform', 'translate(20, ' + (hei / numRows * 2) + ')')

    
    cent.filter(d => d.type == "img")
        
        .append('g')
        .attr('transform', 'translate(' + (-imgSize) + ')')
        .attr("class", d=>d.type)
        .append("image")
        .attr("width", imgSize)
        .attr("height", imgSize)
        .attr("xlink:href", d=>d.value)
        .on("click", function(d){
            loadSpotifyPlayer(d.id)
        })

    let r = 5
    let starWidth = svgWidth / 3
    cent.filter(d => d.type == 'features')
    // put svg for star chart here
    /*
        .append("circle")
        .attr('class', d => d.type)
        .attr("cx", svgWidth - r)
        .attr("cy", 0)
        .attr("r", r)
    */
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
                'P' : v.popularity/100.0,
                'L' : v.liveness,
                'I' : v.instrumentalness
            }
            drawStarChart(svg, data)
        })

    let features = cells.filter(x => x.type == "features")

    console.log(features)
    console.log(features.data())
}