



d3.json("./data/spotify/top50-larger.json", function (error, data) {
    console.log(data)


    drawCircleChart(data);


    let svg = d3.select("#canvas")//.append("svg");

    // svg.attr("width", 1000)
    // svg.attr("height", 1000)

    let tbody = svg.append("table").append("tbody")





    data = data.sort((a, b) => {
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
                { type: "image", value: row.images[2].url, id:row.songId },
                // { type: "id", value: row.songId },
                { type: "song", value: row.song },
                { type: "arists", value: row.artists.join(", ") },
                { type: "danceability", value: row.features.danceability },
                { type: "valence", value: row.features.valence },
                // {type: "popularity", value: row.popularity },
                { type: "fmeasure", value: 2.0 * (row.features.valence * row.features.danceability) / (row.features.valence + row.features.danceability + 0.0) },
                // {type: "features", value: row.features },
            ]
        })
        .enter()
        .append("td")
        .html(function (d, i) {
            if (d.type == "image") {
                return "<img src=\"" + d.value + "\">"
            }
            if (d.type == "id") {

                return "<iframe src=\"https://open.spotify.com/embed?uri=spotify:track:" + d.value + "\" width=\"250\" height=\"300\" frameborder=\"0\" allowtransparency=\"true\" id=\"" + d.value + "\"></iframe>"

            }
            if (d.type != "features")
                return d.value
        })
        .on("click", function(d){
            console.log("click")
            if(d.type == "image")
                loadSpotifyPlayer(d.id)
        })

 

})


