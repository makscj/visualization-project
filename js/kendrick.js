function loadKendrick() {
    clearPage();
    d3.select('#sidebar #outer-list>li:nth-child(5) a').classed('selected', true);
    loadSpotifyPlayerKendrick();
    loadNavigation();

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
        .text("On April 14th 2017 Kendrick Lamar released his fourth studio album DAMN.")
        .style('opacity', 0)
        .attr('id', 'ken-1-1')
        .classed('ken-story-text', true);

    storyDiv.append('img').attr('src', "public/images/damn-album-cover.jpg")
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
        .text("The single HUMBLE. was streamed over 600 million times.")
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


function loadStoryHumble() {
    clearStory();
    setNavColoring('#nav-humble');
    let storyDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-story-2')
        .classed('ken-story', true);
    
    storyDiv.append('p')
        .text("Kendrick released his single HUMBLE. and it held the top spot both weeks.")
        .style('opacity', 0)
        .attr('id', 'ken-2-1')
        .classed('ken-story-text', true);

    let singleSvg = storyDiv.append('svg');
    d3.json("data/top200.json", function (error, data) {
            drawTopByWeekGraphKendrick(data, 14, 16, singleSvg);
    })
    
    storyDiv.append('p')
        .text("He held most of the top ten spots on album release week.")
        .style('opacity', 0)
        .attr('id', 'ken-2-2')
        .classed('ken-story-text', true);

    let releaseSvg = storyDiv.append('svg');
    d3.json("data/top200.json", function (error, data) {
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
        .text("During Kendrick's nine week run, rap and hip-hop dominated the top charts.")
        .style('opacity', 0)
        .attr('id', 'ken-3-1')
        .classed('ken-story-text', true);
    
    storyDiv.append('svg')
        .classed("ken-rap-plot", true);
    d3.json("data/top200.json", function (error, data) {
            drawSongsWithGenreKendrick(data, 14, 23);
    })
    

    d3.select('#ken-3-1').transition()
        .duration(500)
        .style('opacity', 1);
    
}


function loadStoryDna() {
    clearStory();
    setNavColoring('#nav-dna');
    let storyDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-story-4')
        .classed('ken-story', true);
    
    storyDiv.append('p')
        .text("DAMN. was widely regarded as the party album of the summer.")
        .style('opacity', 0)
        .attr('id', 'ken-4-1')
        .classed('ken-story-text', true);

    storyDiv.append('svg')
        .attr("id", "ken-dim-plot");
    d3.json("data/top200.json", function (error, data) {
        // console.log(data[0].album.id);
        data = data.filter(d => d.album.id == "4eLPsYPBmXABThSJ821sqY");
        data = data.filter(d => d.date == "2017-04-14");
        // console.log(data);
        drawDimensionsKendrick(data, 10);
    });
    
    d3.select('#ken-4-1').transition()
        .duration(500)
        .style('opacity', 1);
}

    
function loadStoryLove() {
    clearStory();
    setNavColoring('#nav-love');
    let storyDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-story-5')
        .classed('ken-story', true);

    storyDiv.append('p')
        .text("The album received heavy praise across the internet.")
        .style('opacity', 0)
        .attr('id', 'ken-5-1')
        .classed('ken-story-text', true);
    
    storyDiv.append('iframe')
        .style('opacity', 0)
        .attr('id', 'ken-5-2')
        .attr("width", 560)
        .attr("height", 315)
        .attr("src", "https://www.youtube.com/embed/D4sMeX66tis?rel=0")
        .attr("frameborder", 0)
        .classed('ken-story-text', true);
    
    storyDiv.append('p')
        .classed('ken-story-text', true)
        .text("Kendrick Lamar is nominated for seven Grammys this year.");
    storyDiv.append('a')
        .attr('href', "https://pitchfork.com/thepitch/7-takeaways-from-the-2018-grammy-nominations/")
        .text("Story: 2018 Grammy Predictions by Pitchfork")
        .attr("target", "_blank")
        .attr("id", "ken-5-3");

    d3.select('#ken-5-1').transition()
        .duration(500)
        .style('opacity', 1);
    
    d3.select('#ken-5-2').transition()
        .duration(500)
        .style('opacity', 1);

    d3.select('#ken-5-3').transition()
        .duration(500)
        .style('opacity', 1);
}


function loadNavigation() {
    let navigationDiv = d3.select("#content")
        .append('div')
        .attr('id', 'ken-navigation')
        .style('opacity', 0);
    
    let dat = ['blood', 'humble', 'loyalty', 'dna', 'love']
    let list = navigationDiv
        .append('ul')
        .classed('ken-nav-list', true)
        .selectAll('li')
        .data(dat)
    list.enter().append('li')
        .style('padding-left', (contentWidth - oneEm * 21.5) / 6 + 'px')
        .append('a')
        .attr('id', d => 'nav-' + d)
        .text(d => d.toUpperCase() + '.')
        .classed('ken-nav-item', true)
        .on('click', d => window['loadStory' + d.toProperCase()]())

    d3.select("#ken-navigation")
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .on('end', loadStoryBlood())
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
            return "data/images/" + d.id
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
        .style("opacity", function(d) {
            if (d.album.id == "4eLPsYPBmXABThSJ821sqY") {
                return 1;
            }
            return 0.5;
        })
}

function drawSongsWithGenreKendrick(data, start, end) {
    let shape = "image";
    data = data.filter(x => x.position <= 10).filter(x => x.name != "");
    data = data.slice(start * 10, end * 10);
    let dates = Array.from(new Set(data.map(x => x.date)));
    let numberOfWeeks = dates.length;
    let svg = d3.select(".ken-rap-plot");
    let width = contentWidth;
    let imgsize = Math.ceil(width / (10 + 1)) - 1;
    let height = (imgsize + 1) * numberOfWeeks;

    svg.attr("height", height)
       .attr("width", width);

    let xscale = d3.scaleLinear()
        .domain([1, 10])
        .range([0, width - imgsize]);
    let yscale = d3.scaleLinear()
        .domain([0, 9])
        .range([0, height]);

    let images = svg.selectAll('image').data([]);
    images.exit().remove();
    images = svg.selectAll(shape).data(data);
    images.exit().remove();
    images = images.enter().append(shape).merge(images);

    images
        .attr("href", function (d) {
            return "data/images/" + d.id
        })
        .attr("x", function (d) {
            return xscale(d.position);
        })
        .attr("y", function (d) {
            return yscale(dates.indexOf(d.date))
        })
        .attr("width", imgsize)
        .attr("height", imgsize)
        .style("opacity", function(d) {
            if (d.genres.includes("rap") || d.genres.includes("pop rap")
                || d.genres.includes("hip hop")) {
                return 1;
            }
            return 0.05;
        });
}

function drawDimensionsKendrick(data, limit) {
    
        let date = "2017-04-14";
    
    
        let chart = d3.select("#ken-dim-plot").style("border", "solid black 2px");
    
    
        let xdim = "valence";
        let ydim = "danceability";
    
    
        let buffer = oneEm * 3
        let width = contentWidth * 0.8;
        let height = (contentWidth*(2.0/3.0)) * 0.8;
    
        chart
            .attr("height", height)
            .attr("width", width)
            .attr('transform', 'translate(' + contentWidth * .1 + ', 0)')
    
    
    
        let xscale = d3.scaleLinear()
            .domain([0, 1])
            .range([0 + buffer, width - buffer])
    
        let yscale = d3.scaleLinear()
            .domain([1, 0])
            .range([0 + buffer, height - buffer])
    
        let colorScale = d3.scaleLinear()
            .domain([d3.min(data, x => x.popularity), 100])
            .range(["#0000ff", "#ff0000"])
    
        chart.append("g")
            .attr("transform", "translate(0," + (height - buffer) + ")")
            .call(d3.axisBottom(xscale));
    
        chart.append("g")
            .attr("transform", "translate(" + buffer + "," + 0 + ")")
            .call(d3.axisLeft(yscale));
    
        let xlabel = chart.selectAll("text#xlabelAlbum").data([xdim]);
        xlabel = xlabel.enter().append("text").merge(xlabel);
        xlabel
            .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height - buffer / 4) + ")")
            .style("text-anchor", "middle")
            .attr("id", "xlabelAlbum")
            .text(xdim);
    
        let ylabel = chart.selectAll("text#ylabelAlbum").data([ydim]);
        ylabel = ylabel.enter().append("text").merge(ylabel);
    
        ylabel
            .attr("transform",
            "translate(" + (buffer / 3) + " ," +
            (height / 2) + ") rotate(-90)")
            .style("text-anchor", "middle")
            .attr("id", "ylabelAlbum")
            .text(ydim);
    
    
        let circles = chart.selectAll("image").data(data)
    
        circles.exit().remove()
    
        circles = circles
            .enter().append("image").merge(circles);
    
        circles
            .style("opacity", 0)
            .attr("id", d => d.id)
            .attr("href", d => encodeURI("data/images/" + String(d.id)))
            .attr("x", function (d) {
                return xscale(d.features[xdim])
            })
            .attr("y", function (d) {
                return yscale(d.features[ydim])
            })
            .attr("width", .75 * buffer)
            .attr("height", .75 * buffer)
            .transition()
            .duration(1000)
            .style("opacity", 1);
        
        circles.on('mouseover', function(d) {
           chart.append('text')
                .attr('id', 'ken-dim-label')
                .attr('x', 5)
                .attr('y', 20)
                .text(d.name);
        });

        circles.on('mouseout', function(d) {
            chart.select('#ken-dim-label').remove();
        });
}
