function drawTopByWeekGraph(data, limit) {

    data = data.filter(x => x.position <= limit).filter(x => x.name != "")


    let dates = Array.from(new Set(data.map(x => x.date)))

    let dat = []
    for(let i in data) {
        let d = data[i]
        let j = dates.indexOf(d.date)
        if(j >= dat.length)
            dat.push({date: d.date, songs:[]})
        dat[j].songs.push(d)
    }


    let numberOfWeeks = dates.length;

    // console.log(data)
    
    // TODO make toggle to init this
    let makeTopLabel = true

    let svg = d3.select("#canvas svg")

    let width = contentWidth
    let dateWidth = oneEm * 5.5 
    let imgsize = Math.ceil((width - dateWidth) / (limit + 1)) - 1
    let topLabelHeight = 0
    if(makeTopLabel)
        topLabelHeight = 2 * oneEm
    let height = (imgsize + .5 * oneEm) * numberOfWeeks + topLabelHeight

    svg.attr("height", height)
        .attr("width", width)


    let xscale = d3.scaleLinear()
        .domain([1, limit])
        .range([dateWidth, width - imgsize])

    let yscale = d3.scaleLinear()
        .domain([0, numberOfWeeks])
        .range([topLabelHeight, height])

    svg.selectAll('text').remove()
    for(let i = 1; i <= limit; i++) {
        let x = xscale(i) + imgsize / 2
        if(x > 9)
            x -= oneEm / 2
        svg.append('text')
            .text(i)
            .attr('transform', 'translate(' + x + ', ' + (topLabelHeight / 2) + ')')
    }

    let rows = svg.selectAll('g').data(dat)
    rows.exit().remove()
    rows = rows.enter().append('g').merge(rows)
    rows.attr('transform', (d, i) => 'translate(0, ' + yscale(i) + ')')

    rows.append('text')
        .text(d => d.date)
        .attr('transform', 'translate(0, ' + (imgsize / 2) + ')')

    let images = rows.selectAll("image").data(d => d.songs)
    images.exit().remove()
    images = images.enter().append("image").merge(images)

    images
        .style("opacity", 0)
        .attr("href", function (d) {
            return "data/images/" + d.id
        })
        .attr("class", function (d) {
            return d.id
        })
        .attr("x", function (d) {
            return xscale(d.position)
        })
        .attr("width", imgsize)
        .attr("height", imgsize)
        .transition()
        .duration(300)
        .style("opacity", .5)

    images
        .on("mouseover", function (d) {
            images.style("opacity", function (im) {
                if (im.id != d.id)
                    return 0.5
                return 1.0
            })
        })
        .on("mouseout", function (d) {
            images.style("opacity", .5)
        })
        .on("click", function (d) {
            console.log(d)
            loadSpotifyPlayer(d.id)
        })
}

function updateTimeCharts() {
    d3.json("data/top200.json", function (error, data) {
        let limit = document.getElementById('limitSelect').value;
        drawTopByWeekGraph(data, +limit)
    })
}

function loadTime() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(2) a').classed('selected', true)

    if(false)
        addDiv().append('input')
            .attr('type', "text")
            .attr('name', "search")
            .attr('id', "searchentry")
    addDiv('canvas', true)

    let limit = d3.select('#weekly-limit')
    limit.append('h4').text('# per week: ')
        .append('select')
        .attr('id', 'limitSelect')
        .on("change", updateTimeCharts)
        .selectAll('option').data([10, 25, 50, 200]).enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)

    updateTimeCharts()
}

// loadTime()
