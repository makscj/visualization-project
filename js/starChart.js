// Based on example: http://bl.ocks.org/kevinschaul/8213691

/* EXAMPLE USE
starData = { 'D' : 1,
'V' : 1,
'L' : 0.9,
'E' : 0.3,
'P' : 0.5,
'I' : 1 };
let starSvg = d3.select('.star')
.append('svg')
.attr('height', 100)
.attr('width', 140);
drawStarChart(starSvg, starData);
*/

function drawLines(starData, cx, cy, g) {
    let radius = 0;
    for (let i = 0; i < Object.keys(starData).length; i++) {
      let length = g.attr('height') / 2 - 15;
      let x = length * Math.cos(radius);
      let y = length * Math.sin(radius);
      g.append('line')
        .attr('class', 'star-axis')
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', cx + x)
        .attr('y2', cy + y)

      radius += (2 * Math.PI) / Object.keys(starData).length;
    }
};

function drawLabels(starData, cx, cy, g) {
    let radius = 0;
    for (let i = 0; i < Object.keys(starData).length; i++) {
        let length = g.attr('height') / 2;
        let x = length * Math.cos(radius);
        let y = length * Math.sin(radius);

        g.append('text')
            .attr('class', 'star-label')
            .attr('x', cx + x)
            .attr('y', cy + y)
            .text(Object.keys(starData)[i])
            .style('text-anchor', 'middle')
            .style('dominant-baseline', 'central')

        radius += (2 * Math.PI) / Object.keys(starData).length;
    }
};

function drawArea(starData, cx, cy, g) {
    var path = d3.radialLine();

    let scale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, 30]);

    let pathData = [];
    let radius = Math.PI / 2;
    for (let i = 0; i < Object.keys(starData).length; i++) {
        let d = starData[Object.keys(starData)[i]];
        pathData.push([radius, scale(d)]);
        radius += (2 * Math.PI) / Object.keys(starData).length;
    }

    g.append('path')
      .classed('star-path', true)
      .attr('transform', 'translate(' + cx + ',' + cy + ')')
      .attr('d', path(pathData) + 'Z');
};

function drawStarChart(svg, starData) {
    let SVG_HEIGHT = svg.attr('height');
    let SVG_WIDTH = svg.attr('width');
    
    let g = svg.append('g')
        .attr('height', svg.attr('height'))
        .attr('width', svg.attr('width'));
    
    g.append('circle')
        .attr('cx', SVG_WIDTH / 2)
        .attr('cy', SVG_HEIGHT / 2)
        .attr('r', 2);
    
    drawLines(starData, (SVG_WIDTH / 2), (SVG_HEIGHT / 2), g);
    drawLabels(starData, (SVG_WIDTH / 2), (SVG_HEIGHT / 2), g);
    drawArea(starData, (SVG_WIDTH / 2), (SVG_HEIGHT / 2), g);
};