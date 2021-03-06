function addDiv(id, addSVG) {
    let div = d3.select('#content').append('div')
    if(id != null)
        div.attr('id', id)
    if(addSVG)
        div.append('svg')
    return div
}

function loadJavascript() {
    let scripts = [
        'dimensions',
        // 'features',
        'genre',
        'kendrick',
        // 'script',
        // 'search',
        'starChart',
        'weekly',
        'list'
        // 'streams'
    ]
    let body = d3.select('body')
    for(let s = 0; s < scripts.length; s++)
        body.append('script')
            .attr('type', 'text/javascript')
            .attr('src', 'js/' + scripts[s] + '.js')
}

function loadSidebar() {
    d3.text("html/sidebar.html", function(text){
        d3.select("#sidebar").html(text);
    })
}

function computeContentWidth() {
    let em = getComputedStyle(d3.select('body').node()).fontSize
    oneEm = parseFloat(em)
    sidebarWidth = oneEm * 18
    contentWidth = window.innerWidth - sidebarWidth - oneEm
}

function windowResized() {
    computeContentWidth()
    let selected = d3.select('#sidebar .selected').node().click()
    // TODO implement update instead of click given time
    /*
    let update = selected.attr('update')
    window[update]()
    */
}

function scrollToTopOfElement(selector) {
    d3.select(selector).node().scrollIntoView()
}

function clearPage () {
    d3.select('#content').selectAll('*').remove()
    d3.select('#view-select ul ul').remove()
    d3.select('#sidebar .selected').classed('selected', false)
    d3.selectAll('#sidebar div:not(#about):not(:first-of-type) *').remove()
}

function loadSpotifyPlayer(id, isCompact = false) {
    let player = d3.select("#spotify-player")
    let bounds = player.node().getBoundingClientRect()

    player = player.selectAll("iframe")
        .data([id])

    player = player.enter()
        .append("iframe")
        .merge(player)

    let height = bounds.width * 1.1
    if(height < 300)
        height = 300
    
    //todo fix it cause I don't care
    if(isCompact)
        height = 80

    player
        .attr("width", bounds.width)
        .attr("height", height)
        .attr("frameborder", 0)
        .attr("allowtransperancy", true)
        .attr("src", "https://open.spotify.com/embed?uri=spotify:track:" + id)
}

function displaySongStatsInSidebar(e, v, d) {
    d3.select('#song-stats').html('');
    let bounds = d3.select('#song-stats')
        .node().getBoundingClientRect();
    let barBounds = bounds.width * 0.75;

    let xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, barBounds]);

    let colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["#FAEB0A", "#FA630A"]);

    let statsSvg = d3.select("#song-stats")
        .append('svg')
        .attr("width", bounds.width)
        .attr('height', '6em')

    // Energy
    let label = statsSvg.append('g')
        .append('text')
        .attr('transform', 'translate(0,30)')
        .text("Energy: ");
    let rectX = label.node().getBoundingClientRect().width + 7;
    let rectY = label.node().getBoundingClientRect().height + 3;
    statsSvg.append('rect')
        .attr('transform', 'translate(' + rectX 
            + ',' + rectY + ')')
        .attr("height", 10)
        .attr("width", 0)
        .attr("fill", colorScale(e))
        .transition()
        .duration(500)
        .attr("width", xScale(e));

    // Valence
    label = statsSvg.append('g')
        .append('text')
        .attr('transform', 'translate(0,60)')
        .text("Valence: ");
    rectY = label.node().getBoundingClientRect().height + 33;
    statsSvg.append('rect')
        .attr('transform', 'translate(' + rectX 
            + ',' + rectY + ')')
        .attr("height", 10)
        .attr("width", 0)
        .attr("fill", colorScale(v))
        .transition()
        .duration(500)
        .attr("width", xScale(v));
    
    // Danceability
    label = statsSvg.append('g')
    .append('text')
    .attr('transform', 'translate(0,90)')
    .text("Dancy: ");
    rectY = label.node().getBoundingClientRect().height + 63;
    statsSvg.append('rect')
        .attr('transform', 'translate(' + rectX 
            + ',' + rectY + ')')
        .attr("height", 10)
        .attr("width", 0)
        .attr("fill", colorScale(d))
        .transition()
        .duration(500)
        .attr("width", xScale(d));
}

function download(text, name) {
    var a = document.createElement("a");
    var file = new Blob([text], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function compareStrings(str1, str2, d = 1){
    var s1 = str1.toUpperCase();
    var s2 = str2.toUpperCase();
    if (s1 < s2) {
        return d*-1;
      }
      if (s1 > s2) {
        return d*1;
      }
      // strings must be equal
      return 0;
}

function loadAbout() {
    clearPage()
    let div = addDiv('about-page')
        .style('text-align', 'center')
    div.append('h2')
        .text('Created by')
    div.selectAll('div').data([{name: 'Maks Cegieslski-Johnson', git: 'makscj'},
            {name: 'Jake Pitkin', git: 'jspitkin'},
            {name: 'Jackson Stafford', git: 'jackmstafford'}])
        .enter().append('div').append('a')
        .text(d => d.name)
        .attr('href', d => 'https://www.github.com/' + d.git)
}

loadSidebar()
loadJavascript()
computeContentWidth()
