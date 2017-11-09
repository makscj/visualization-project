



d3.json("./data/spotify/top50.json", function (error, data) {
    console.log(data)

    let svg = d3.select("#canvas")//.append("svg");

    // svg.attr("width", 1000)
    // svg.attr("height", 1000)

    let tbody = svg.append("table").append("tbody")



    let rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");


    let cells = rows.selectAll("td")
        .data(function (row) {
            return [
                {type: "song", value: row.song },
                {type: "arists", value: row.artists.join(", ") },
                {type: "popularity", value: row.popularity/100.0 },
                {type: "features", value: row.features },
            ]
        })
        .enter()
        .append("td")
        .html(function (d, i) {
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


