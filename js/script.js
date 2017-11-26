function updateCharts(drawList){
    d3.json("./data/top50withalbums.json", function (error, data) {
        console.log(data)

        for(let i = 0; i < data.length; i++)
            data[i].features.popularity = data[i].popularity/100.0
    
        if(drawList)
            makeSongList(data);
            
        drawCircleChart(data);
        drawAlbumChart(data);
    
    })
}

function loadMain () {
    clearPage();
    let content = d3.select('#page-content-wrapper')

    addDiv(content, 'canvas')
    addDiv(content, 'chart', true)
    addDiv(content, 'chart-albums', true)
    addDiv(content, 'info')

    d3.text("info.html", function(text){
        d3.select("#info").html(text)
    })

    updateCharts(true)
}

d3.text("sidebar.html", function(text){
    let sidebar = d3.select("#sidebar-wrapper").html(text)

    let sty = getComputedStyle(sidebar.node())
    oneEm = parseFloat(sty.fontSize)
    sidebar.style('min-width', oneEm * 16 + 'px')
    sidebarWidth = parseFloat(sty.width) + 2 * oneEm
    d3.select('#page-content-wrapper').style('padding-left', sidebarWidth + 'px')
    contentWidth = window.innerWidth - sidebarWidth - oneEm / 2

    loadMain();
})
