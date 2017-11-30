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
        // 'script',
        // 'search',
        'starChart',
        'weekly'
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
        d3.select("#sidebar").html(text)
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
    d3.select('#spotify-player').selectAll('*').remove()
    d3.select('#view-select ul ul').remove()
    d3.select('#sidebar .selected').classed('selected', false)
    d3.selectAll('#chart-dim *').remove()
    d3.selectAll('#weekly-limit *').remove()
    d3.selectAll('#toggle *').remove()
    d3.selectAll('#date-select *').remove()
}

function loadSpotifyPlayer(id) {
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

    player
        .attr("width", bounds.width)
        .attr("height", height)
        .attr("frameborder", 0)
        .attr("allowtransperancy", true)
        .attr("src", "https://open.spotify.com/embed?uri=spotify:track:" + id)
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

d3.text("html/sidebar.html", function(text){
    d3.select("#sidebar").html(text)
})
loadJavascript()
//loadSidebar()
computeContentWidth()
