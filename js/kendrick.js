function loadKendrick() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(3) a').classed('selected', true);
    loadSpotifyPlayerKendrick();
}


function loadSpotifyPlayerKendrick() {
    console.log("loading player");
    let playerDiv = d3.select("#spotify-player");
    let bounds = playerDiv.node().getBoundingClientRect();

    let player = playerDiv.append("iframe");

    player
        .attr("width", bounds.width)
        .attr("height", 300)
        .attr("frameborder", 0)
        .attr("allowtransperancy", true)
        .attr("src", "https://open.spotify.com/embed?uri=spotify:album:4eLPsYPBmXABThSJ821sqY");
}