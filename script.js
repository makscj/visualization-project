d3.json("./data/spotify/top50.json", function (error, data) {
    console.log(data)

    let svg = d3.select("#canvas")
    let bounds = svg.node().getBoundingClientRect()
    svg = svg.append("svg")
    let svgWidth = bounds.width

    let numRows = 3
    let hei = 25 * numRows 
    let marg = 10
    svg.attr("width", svgWidth)
    svg.attr("height", hei * data.length)

    let tbody = svg.append("g")
        .attr('transform', 'translate(0, ' + (hei / numRows) + ')')

    let i = 0
    let rows = tbody.selectAll("svg>g>g")
        .data(data)
        .enter()
        .append("g")
        .attr('transform', d => 'translate(0, ' + (i++ * (hei + marg)) + ')')


    let cells = rows.selectAll("g")
        .data(function (row) {
            return [
                {type: "song", value: row.song },
                {type: "artists", value: row.artists.join(", ") },
                {type: "popularity", value: 'Popularity: ' + row.popularity/100.0 },
                {type: "features", value: row.features },
            ]
        })

    let cent = cells.enter()

    cent.filter(d => d.type != 'features')
        .append("text")
        .attr('class', d => d.type)
        .text(d => d.value)

    cent.select('.artists')
        .attr('transform', 'translate(20, ' + (hei / numRows) + ')')

    cent.select('.popularity')
        .attr('transform', 'translate(20, ' + (hei / numRows * 2) + ')')

    let r = 5
    cent.filter(d => d.type == 'features')
    // put svg for star chart here
        .append("circle")
        .attr('class', d => d.type)
        .attr("cx", svgWidth - r)
        .attr("cy", 0)
        .attr("r", r)

    let features = cells.filter(x => x.type == "features")

    console.log(features)
    console.log(features.data())
})
