function song(data) {
    console.log(data)
    let songs = {};
    let ids = Array.from(new Set(data.map(x => x.id)));

    console.log(ids)

    for (let id of ids) {
        songs[id] = { id: id, chart: [], artists: null, album: null, song: null }
    }

    for (let entry of data) {
        let id = entry.id;

        songs[id].chart.push({
            position: entry.position,
            date: entry.date,
            streams: entry.streams
        })

        songs[id].album = entry.album
        songs[id].artists = {
            artists: entry.artists,
            followers: entry.followers.total,
        }

        songs[id].song = {
            name: entry.name,
            duration: entry.duration,
            explicit: entry.explicit,
            features: entry.features,
            markets: entry.markets,
            genres: entry.genres,
        }

    }



    let out = []

    for (let id of ids) {
        out.push(songs[id])
    }


    download(JSON.stringify(out), "songs.json")


}