function loadKendrick() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(3) a').classed('selected', true);
    loadSpotifyPlayerKendrick();
    loadNavigation();
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


function loadStoryOne() {
    this.setNavColoring('#nav-blood');
    let storyDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-story-1')
        .classed('ken-story', true);
    
    storyDiv.append('p')
    .text("On April 14th 2017 Kendrick Lamar released his fourth studio album Damn.")
    .style('opacity', 0)
    .attr('id', 'ken-1-1');

    storyDiv.append('p').text("more")
        .style('opacity', 0)
        .attr('id', 'ken-1-2');

    d3.select('#ken-1-1').transition()
        .duration(500)
        .style('opacity', 1)
        .on('end', function() {
            d3.select('#ken-1-2').transition()
                .duration(500)
                .style('opacity', 1);
        })


}


function loadNavigation() {
    let navigationDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-navigation')
        .style('opacity', 0);
    
    let list = navigationDiv.append('ul').classed('ken-nav-list', true);
    list.append('li').text('BLOOD.')
        .attr('id', 'nav-blood')
        .classed('ken-nav-item', true)
        .classed('nav-selected', true);
    list.append('li').text('DNA.')
        .attr('id', 'nav-dna')
        .classed('ken-nav-item', true);
    list.append('li').text('LOYALTY.')
        .attr('id', 'nav-loyalty')
        .classed('ken-nav-item', true);
    list.append('li').text('HUMBLE.')
        .attr('id', 'nav-humble')
        .classed('ken-nav-item', true);
    list.append('li').text('LOVE.')
        .attr('id', 'nav-love')
        .classed('ken-nav-item', true);

    d3.select("#ken-navigation")
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .on('end', function() {
            this.loadStoryOne();
        }.bind(this));
}


function setNavColoring(id) {
    d3.selectAll('.ken-nav-item').classed('nav-selected', false);
    d3.select(id).classed('nav-selected', true);
}