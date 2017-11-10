



d3.json("./data/spotify/top50-larger.json", function (error, data) {
    console.log(data)


    let chart = d3.select("#chart").append("svg").style("border", "solid black 2px")
    
    chart.attr("height", 1000).attr("width", 800)

    let circles = chart.selectAll("circle").data(data).enter().append("circle");

    let xscale = d3.scaleLinear()
        .domain([0, 100])
        .range([100, 700])

    let yscale = d3.scaleLinear()
        .domain([0, 100])
        .range([100, 900])

    let colorScale = d3.scaleLinear()
        .domain([50,100])
        .range(["#0000ff", "#ff0000"])

    circles = circles.attr("cx", function(d){
        return xscale(d.features.valence*100)
    })
    .attr("cy", function(d){
        return yscale(d.features.danceability*100)
    })
    .attr("r", function(d){
        return 10
    })
    .style("fill", function(d){
        return colorScale(d.popularity)
    })
    .on("mouseover", function(d){
        console.log(d.song + " by " + d.artists[0])
    })

    let svg = d3.select("#canvas")//.append("svg");

    // svg.attr("width", 1000)
    // svg.attr("height", 1000)

    let tbody = svg.append("table").append("tbody")





    data = data.sort((a,b) => {
        // console.log(b.features.danceability)
        return b.features.danceability - a.features.danceability
    })

    console.log(data)
    

    let rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");


    let cells = rows.selectAll("td")
        .data(function (row) {
            return [
                // {type: "image", value: row.images[2].url},
                {type: "song", value: row.song },
                {type: "arists", value: row.artists.join(", ") },
                // {type: "id", value: row.songId },
                {type: "danceability", value: row.features.danceability },
                {type: "valence", value: row.features.valence },
                // {type: "popularity", value: row.popularity },
                {type: "fmeasure", value: 2.0*(row.features.valence * row.features.danceability)/(row.features.valence + row.features.danceability + 0.0) },
                // {type: "features", value: row.features },
            ]
        })
        .enter()
        .append("td")
        .html(function (d, i) {
            if(d.type == "image"){
                return "<img src=\"" + d.value + "\">"
            }
            if(d.type == "id" && d.value != null){
                return "<iframe src=\"" + "https://open.spotify.com/embed?uri=spotify:track:" + d.value + "\" width=\"100\" height=\"100\" frameborder=\"0\" allowtransparency=\"true\"></iframe>"
            }
            if(d.type != "features")
                return d.value
        })

        let features = cells.filter(x => x.type == "features");

        console.log(features)

        features.append("svg")
            .attr("height", 50)
            .attr("width", 100)
            .append("circle")
            .attr("cx", 20)
            .attr("cy", 20)
            .attr("r", 5)

    
        

        // if(d.type == "features"){
        //     let chart = d3.select(this).append("svg")

        //     console.log(d.value)
        //     let circle = chart.attr("width", 100)
        //         .attr("height", 50)
        //         .data([d.value])
        //         .enter()
        //         .append("circle")
        //         .attr("cx", 20)
        //         .attr("cy", 20)
        //         .attr("r", 5)

        //     console.log(circle)

        //     return circle
        // }
    //     var star = d3.starPlot()
    //     .properties([
    //       'Body',
    //       'Sweetness',
    //       'Smokey'
    //     ])
    //     .scales(scale)
    //     .labels([
    //       'Body',
    //       'Sweetness',
    //       'Smokey'
    //     ])
      
    //   data.forEach(function(d) {
    //     d3.select(body).append('svg')
    //       .datum(d)
    //       .call(star)
    //   });






})


