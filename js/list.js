function drawList(data, limit) {

    let dates = ["2016-12-23", "2016-12-30", "2017-01-06", "2017-01-13", "2017-01-20", "2017-01-27", "2017-02-03", "2017-02-10", "2017-02-17", "2017-02-24", "2017-03-03", "2017-03-10", "2017-03-17", "2017-03-24", "2017-03-31", "2017-04-07", "2017-04-14", "2017-04-21", "2017-04-28", "2017-05-05", "2017-05-12", "2017-05-19", "2017-05-26", "2017-06-02", "2017-06-09", "2017-06-16", "2017-06-23", "2017-07-07", "2017-07-14", "2017-07-21", "2017-07-28", "2017-08-11", "2017-08-18", "2017-08-25", "2017-09-01", "2017-09-08", "2017-09-22", "2017-09-29", "2017-10-06", "2017-10-13", "2017-10-20", "2017-10-27", "2017-11-03", "2017-11-10"]

    data = makeData(data, limit)


    let svgWidth = contentWidth
    let numRows = 3
    let marg = oneEm * 2
    let hei = oneEm * 1.5 * numRows
    let rowHeight = hei / numRows
    let horizontalBoxes = Math.floor(svgWidth / hei)
    let imgSize = hei
    let starSize = hei
    let maxTextLength = 16 * oneEm
    let miniChartWidth = svgWidth - imgSize - maxTextLength - starSize - oneEm

    let svg = d3.select("#canvas svg")
        .attr("width", svgWidth)
        .attr("height", (hei + marg) * data.length)
        .classed("hover-cursor", true)

    // TODO implement a less poopy update
    svg.selectAll('*').remove()

    /*
    let tbody = svg.append("g")
        .attr('transform', 'translate(0, ' + (hei / numRows) + ')')
    */

    let i = 0
    let rows = svg.selectAll("svg>g")
        .data(data)
       

    rows.exit().remove()

    rows =  rows.enter().append("g").merge(rows)
        
    rows.attr('transform', d => 'translate(0, ' + (i++ * (hei + marg)) + ')')
        .attr('width', svgWidth)
        .on('mouseover', function() {
            d3.select(this).select('.list-rect')
                .classed('hover-list-item', true);
        })
        .on('mouseout', function() {
            d3.select(this).select('.list-rect')
                .classed('hover-list-item', false);
        })
        .on("click", function (d) {
            loadSpotifyPlayer(d.id);
            displaySongStatsInSidebar(d.song.features.energy,
                d.song.features.valence, d.song.features.danceability);
        });

    // background rect START
    rows.append('rect')
        .classed('list-rect', true)
        .attr('width', svgWidth + oneEm)
        .attr('height', hei + oneEm)
        .attr('x', -oneEm)
        //.attr('y', -0 * 1.5)
    // background rect END

    // TODO handle too long songs and artists
    let cells = rows.selectAll("g")
        .data(function (row) {
            return [
                { type: "img", value: "data/images/" + row.id, id: row.id },
                { type: "song", value: row.song.name, translate: [oneEm * 2 + imgSize, rowHeight] },
                { type: "artists", value: row.artists.artists.map(x => x.name).join(", "), 
                            translate: [oneEm * 3 + imgSize, 2 * rowHeight] },
                { type: "streams", value: "Streams: " + d3.sum(row.chart, x => +x.streams).toLocaleString(), 
                            translate: [oneEm * 2 + imgSize, 3 * rowHeight]},
                { type: "starChart", value: row.song.features },
                { type: "miniChart", value: row.chart }
            ]
        })

    let cent = cells.enter()

    // row text START
    cent.filter(d => d.type != 'starChart' && d.type != "img" && d.type != "miniChart")
        .append("text")
        .attr("width", oneEm * 10)
        .attr('class', d => d.type)
        .text(d => d.value)
        .filter(d => d.translate != null)
        .attr('transform', d => 'translate(' + d.translate[0] + ', ' + d.translate[1] + ')')
    // row text END


    // album image START
    cent.filter(d => d.type == "img")
        .append("image")
        .attr("width", imgSize)
        .attr("height", imgSize)
        .attr("xlink:href", d => d.value)

        .attr('transform', 'translate(' + oneEm / 2 + ', ' + oneEm / 2 + ')')
    // album image END


    // make log miniChart START
    let miniPlotX = d3.scaleLinear()
        .domain([0, dates.length])
        .range([oneEm * 1.5, miniChartWidth])

    let miniPlotY = d3.scaleLog()
        .domain([1, 200])
        .range([0, hei])

    //Slightly smaller scale for y axis
    let yAxisPlot = d3.scaleLog()
        .domain([1, 200])
        .range([oneEm/4, hei - oneEm/4])

    let miniPlotFn = d3.line()
        .x(d => miniPlotX(dates.indexOf(d.date)))
        .y(d => miniPlotY(+d.position))

    let miniChart = cent.filter(d => d.type == "miniChart").append('g')
        .attr('transform', 'translate(' + (svgWidth - starSize - miniChartWidth - oneEm * 2) + ', ' + oneEm / 2 + ')')
        .attr("class", d => d.type)

    // background
    miniChart.append('rect')
        .attr('width', miniChartWidth)
        .attr('height', hei + oneEm / 3)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('transform', 'translate(3, -3)');

    // plot
    miniChart.append("path")
        .attr("d", d => miniPlotFn(d.value))

    // y axis
    miniChart.append('g')
        .attr("transform", 'translate(' + oneEm / 3 + ', 0)')
        .call(d3.axisLeft(yAxisPlot)
                .tickValues([1,10,50,200])
                .tickFormat(d3.format("1d"))
                .tickSize(-3))
    // make log miniChart END

    // star chart START
    let starSvg = cent.filter(d => d.type == 'starChart')
        .append('g')
        .attr('transform', 'translate(' + (svgWidth - starSize - oneEm) + ', ' + (oneEm / 2) + ')')
        .attr('class', d => d.type)
        .attr('width', starSize)
        .attr('height', starSize)
    starSvg.append('rect')
        .classed('star-chart-background', true)
        .attr('width', starSize + oneEm / 2)
        .attr('height', starSize + oneEm / 2)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('transform', 'translate(0, -' + (oneEm / 4) + ')')
    starSvg.each(function (d, i) {
        let svg = d3.select(this)
        let v = d.value
        let data = {
            'Dancy': v.danceability,
            'Valence': v.valence,
            'Energy': v.energy
        }
        drawStarChart(svg, data)
    })
    // star chart END
}

function makeData(data, limit) {
    data = data.filter(x => x.chart.some(x => +x.position <= limit)).filter(x => x.song.name != "")

    let selectors = d3.select('#sort-selection')
    let sort = selectors.select('select:first-of-type').node().value
    let sortDirection = selectors.select('select:last-of-type').node().value

    let sortFunctions = {
                "Artist" : (x,y) => compareStrings(x.artists.artists[0].name,y.artists.artists[0].name, sortDirection),
                "Song" : (x,y) => compareStrings(x.song.name,y.artists.artists[0].name, sortDirection),
                "Streams" : (x,y) => sortDirection*(d3.sum(y.chart, z => +z.streams) - d3.sum(x.chart, z => +z.streams)),
                "Position" : (x,y) => sortDirection*(d3.min(x.chart, z => +z.position) - d3.min(y.chart, z => +z.position)),
                "Weeks" : (x,y) => sortDirection*(y.chart.length - x.chart.length),
                "Danceability" : (x,y) => sortDirection*(y.song.features.danceability - x.song.features.danceability),
                "Valence" : (x,y) => sortDirection*(y.song.features.valence - x.song.features.valence),
                "Energy" : (x,y) => sortDirection*(y.song.features.energy - x.song.features.energy)
            }

    data.sort(sortFunctions[sort])
    return data
}


function updateSongList() {
    d3.json("data/songs.json", function (error, data) {
        drawList(data, 25)

    })
}


function loadList() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(1) a').classed('selected', true)

    if (false)
        addDiv().append('input')
            .attr('type', "text")
            .attr('name', "search")
            .attr('id', "searchentry")

    addDiv('canvas', true)

    let sorts = ["Artist", "Danceability", "Energy", "Position", "Song", "Streams", "Valence", "Weeks"]
    let direction = ['Descending', 'Ascending']
    let div = d3.select('#sort-selection')
    div.append('h4').text('Sort')
    div.append('select')
        .selectAll('option').data(sorts).enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)
        .filter(d => d == sorts[5])
        .property('selected', 'selected')
    div.append('select')
        .selectAll('option').data(direction).enter()
        .append('option')
        .attr('value', (d, i) => i == 0 ? 1 : -1)
        .text(d => d)
    div.selectAll('select')
        .on('change', updateSongList)


    updateSongList()
}

loadList()
