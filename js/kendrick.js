function loadKendrick() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(3) a').classed('selected', true);
    loadSpotifyPlayerKendrick();
    loadNavigation();

    d3.select('#nav-blood').on('click', this.loadStoryBlood);
    d3.select('#nav-dna').on('click', this.loadStoryDna);
    d3.select('#nav-loyalty').on('click', this.loadStoryLoyalty);
    d3.select('#nav-humble').on('click', this.loadStoryHumble);
    d3.select('#nav-love').on('click', this.loadStoryLove);
}


function loadSpotifyPlayerKendrick() {
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


function loadStoryBlood() {
    clearStory();
    setNavColoring('#nav-blood');
    let storyDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-story-1')
        .classed('ken-story', true);
    
    storyDiv.append('p')
        .text("On April 14th 2017 Kendrick Lamar released his fourth studio album Damn.")
        .style('opacity', 0)
        .attr('id', 'ken-1-1')
        .classed('ken-story-text', true);

    storyDiv.append('img').attr('src', "../public/images/damn-album-cover.jpg")
        .style('opacity', 0)
        .attr('width', 300)
        .attr('height', 300)
        .classed('ken-image', true)
        .attr('id', 'ken-1-2');
    
    storyDiv.append('p')
        .text("He held the top spot on Spotify for nine consecutive weeks. ")
        .style('opacity', 0)
        .attr('id', 'ken-1-3')
        .classed('ken-story-text', true);

    storyDiv.append('p')
        .text("✨🏆✨")
        .style('opacity', 0)
        .attr('id', 'ken-1-4')
        .classed('ken-story-text', true);

    d3.select('#ken-1-1').transition()
        .duration(500)
        .style('opacity', 1)

    d3.select('#ken-1-2').transition()
        .duration(500)
        .style('opacity', 1)

    d3.select('#ken-1-3').transition()
        .duration(500)
        .style('opacity', 1)

    d3.select('#ken-1-4').transition()
        .duration(200)
        .style('opacity', 1);
}


function loadStoryDna() {
    clearStory();
    setNavColoring('#nav-dna');
    let storyDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-story-2')
        .classed('ken-story', true);
    
    storyDiv.append('p')
        .text("Kendrick released his single HUMBLE. and it helt the top spot both weeks.")
        .style('opacity', 0)
        .attr('id', 'ken-2-1')
        .classed('ken-story-text', true);

    let singleSvg = storyDiv.append('svg');
    d3.json("/data/top200.json", function (error, data) {
            drawTopByWeekGraphKendrick(data, 14, 16, singleSvg);
    })
    
    storyDiv.append('p')
        .text("He held most of the top ten spots on album release week.")
        .style('opacity', 0)
        .attr('id', 'ken-2-2')
        .classed('ken-story-text', true);

    let releaseSvg = storyDiv.append('svg');
    d3.json("/data/top200.json", function (error, data) {
            drawTopByWeekGraphKendrick(data, 16, 23, releaseSvg);
    })
    
      d3.select('#ken-2-1').transition()
        .duration(500)
        .style('opacity', 1);

      d3.select('#ken-2-2').transition()
        .duration(500)
        .style('opacity', 1);
}


function loadStoryLoyalty() {
    clearStory();
    setNavColoring('#nav-loyalty');
    let storyDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-story-3')
        .classed('ken-story', true);
    
    storyDiv.append('p')
        .text("During Kendrick's nine week run, rap dominated the top charts.")
        .style('opacity', 0)
        .attr('id', 'ken-3-1')
        .classed('ken-story-text', true);

    d3.select('#ken-3-1').transition()
        .duration(500)
        .style('opacity', 1);
    
}


function loadStoryHumble() {
    clearStory();
    setNavColoring('#nav-humble');
}

    
function loadStoryLove() {
    clearStory();
    setNavColoring('#nav-love');
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
    list.append('li').text('HUMBLE.')
        .attr('id', 'nav-dna')
        .classed('ken-nav-item', true);
    list.append('li').text('LOYALTY.')
        .attr('id', 'nav-loyalty')
        .classed('ken-nav-item', true);
    list.append('li').text('DNA.')
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
            this.loadStoryBlood();
        }.bind(this));
}


function setNavColoring(id) {
    d3.selectAll('.ken-nav-item').classed('nav-selected', false);
    d3.select(id).classed('nav-selected', true);
}

function clearStory() {
    d3.select('.ken-story')
        .transition()
        .duration(200)
        .style('opacity', 0)
        .on('end', function() {
            d3.select('.ken-story').remove();
        })
}

function drawTopByWeekGraphKendrick(data, start, end, svg) {

    data = data.filter(x => x.position <= 10).filter(x => x.name != "");
    data = data.slice(start * 10, end * 10);
    let dates = Array.from(new Set(data.map(x => x.date)));
    let numberOfWeeks = dates.length;
    let width = contentWidth;
    let imgsize = Math.ceil(width / (10 + 1)) - 1;
    let height = (imgsize + 1) * numberOfWeeks;

    svg.attr("height", height)
        .attr("width", width);

    let xscale = d3.scaleLinear()
        .domain([1, 10])
        .range([0, width - imgsize]);

    let yscale = d3.scaleLinear()
        .domain([0, dates.length])
        .range([0, height]);

    let images = svg.selectAll("image").data(data);
    images.exit().remove();
    images = images.enter().append("image").merge(images);

    images
        .attr("href", function (d) {
            return "../data/images/" + d.id
        })
        .attr("class", function (d) {
            return d.id
        })
        .style('opacity', 0)
        .attr("x", function (d) {
            return xscale(d.position)
            // return xscale(d.features[xdim])
        })
        .attr("y", function (d) {
            return yscale(dates.indexOf(d.date))
        })
        .attr("width", imgsize)
        .attr("height", imgsize)
        .transition()
        .duration(1000)
        .style("opacity", 1)
}