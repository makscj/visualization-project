function updateCharts(drawList){
    d3.json("./data/top50withalbums.json", function (error, data) {
        console.log(data)

        for(let i = 0; i < data.length; i++)
            data[i].features.popularity = data[i].popularity/100.0
    
        //if(drawList)
            //makeSongList(data);
            
        //drawCircleChart(data);
        //drawAlbumChart(data);
    
    })
}

function makeDimensionSelectors() {
    let values = ['valence', 'energy', 'danceability', 'popularity']
    let dim = d3.select('#chart-dim')
    dim.append('h4').text('Change Dimensions')
    dim = dim.selectAll('div').data(['x', 'y']).enter().append('div')
    dim.append('h5').text(d => d.toUpperCase() + ': ')
    .append('select')
        .attr('id', d => d + 'dim')
        .attr('onchange', 'updateCharts()')
            .selectAll('option')
            .data(values)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d.toProperCase())
    dim.select('#xdim')
        .property('value', values[0])
    dim.select('#ydim')
        .property('value', values[2])
}

function makeScrollToCharts() {
    let mainLi = d3.select('#view-select li')
    mainLi = mainLi.append('ul').selectAll('li')
        .data([
            {text: 'Circle chart', selector: '#chart-circles'},
            {text: 'Album chart', selector: '#chart-albums'},
            {text: 'Info', selector: '#info'}
        ])
    mainLi.enter().append('li').append('a')
        .attr('onclick', d => 'scrollToTopOfElement("' + d.selector + '")')
        .text(d => d.text)
}

function loadMain () {
    clearPage();
    d3.select('#sidebar #outer-list>li a').classed('selected', true)

    addDiv('canvas', true)
    addDiv('chart-circles', true)
    addDiv('chart-albums', true)
    addDiv('info')

    d3.text("info.html", function(text){
        d3.select("#info").html(text)
    })

    makeScrollToCharts()
    makeDimensionSelectors()

    updateCharts(true)
}
