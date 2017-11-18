


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


function loadSpotifyPlayer(id) {
    let player = d3.select("#spotify-player")
        .selectAll("iframe")
        .data([id])

    player = player.enter()
        .append("iframe")
        .merge(player)

    player
        .attr("width", 250)
        .attr("height", 300)
        .attr("frameborder", 0)
        .attr("allowtransperancy", true)
        .attr("src", "https://open.spotify.com/embed?uri=spotify:track:" + id)
}

d3.text("sidebar.html", function(text){
    d3.select("#sidebar-wrapper").html(text)
    updateCharts(true)
})







String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};