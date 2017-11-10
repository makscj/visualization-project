
d3.json("./data/spotify/top50-larger.json", function (error, data) {
    console.log(data)


    drawCircleChart(data);
    makeSongList(data);


})
