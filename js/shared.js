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

d3.text("sidebar.html", function (text) {
    d3.select("#sidebar-wrapper").html(text)
    updateCharts(true)
})
