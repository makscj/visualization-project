

updateStreamCharts()

function drawStreams(weekly, songs){

    console.log(weekly)

    console.log(songs)

    let totalStreams = {}

    let albumStreams = {}

    

    for(let song of songs){
        if(song.song.name == "")
            continue
        totalStreams[song.id] = {
            streams: 0,
            name: song.song.name,
            artists: song.artists.artists[0].name,
            id: song.id
        }
        albumStreams[song.album.id] = {
            streams: 0,
            artists: song.artists.artists[0].name,
            name: song.album.name,
            image: song.album.images[1].url,
            id: song.album.id
        }
    }
    console.log(songs)

    for(let item of weekly){
        if(item.name  == "")
            continue
        totalStreams[item.id].streams += (+item.streams)
        albumStreams[item.album.id].streams += (+item.streams)
    }

    console.log(totalStreams)
    console.log(albumStreams)

    let albumids = Object.keys(albumStreams)


    let total = []
    let album = []

    for(let song of songs){
        total.push(totalStreams[song.id])
    }

    for(let albumid of albumids){
        album.push(albumStreams[albumid])
    }

    console.log(total.sort((a,b) => b.streams - a.streams).slice(0,25))
    console.log(album.sort((a,b) => b.streams - a.streams).slice(0,25))


}




function updateStreamCharts() {

    d3.json("../data/top200.json", function (error, weekly) {
        d3.json("../data/songs.json", function (error, songs) {
            drawStreams(weekly, songs)
    
        })
    })
}


function loadStreams() {


}

