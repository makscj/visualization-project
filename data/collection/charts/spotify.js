var Spotify = require('spotify-web-api-js');
var s = new Spotify();

let files = ["regional-us-weekly-2016-12-23--2016-12-30.csv", "regional-us-weekly-2016-12-30--2017-01-06.csv", "regional-us-weekly-2017-01-06--2017-01-13.csv", "regional-us-weekly-2017-01-13--2017-01-20.csv", "regional-us-weekly-2017-01-20--2017-01-27.csv", "regional-us-weekly-2017-01-27--2017-02-03.csv", "regional-us-weekly-2017-02-03--2017-02-10.csv", "regional-us-weekly-2017-02-10--2017-02-17.csv", "regional-us-weekly-2017-02-17--2017-02-24.csv", "regional-us-weekly-2017-02-24--2017-03-03.csv", "regional-us-weekly-2017-03-03--2017-03-10.csv", "regional-us-weekly-2017-03-10--2017-03-17.csv", "regional-us-weekly-2017-03-17--2017-03-24.csv", "regional-us-weekly-2017-03-24--2017-03-31.csv", "regional-us-weekly-2017-03-31--2017-04-07.csv", "regional-us-weekly-2017-04-07--2017-04-14.csv", "regional-us-weekly-2017-04-14--2017-04-21.csv", "regional-us-weekly-2017-04-21--2017-04-28.csv", "regional-us-weekly-2017-04-28--2017-05-05.csv", "regional-us-weekly-2017-05-05--2017-05-12.csv", "regional-us-weekly-2017-05-12--2017-05-19.csv", "regional-us-weekly-2017-05-19--2017-05-26.csv", "regional-us-weekly-2017-05-26--2017-06-02.csv", "regional-us-weekly-2017-06-02--2017-06-09.csv", "regional-us-weekly-2017-06-09--2017-06-16.csv", "regional-us-weekly-2017-06-16--2017-06-23.csv", "regional-us-weekly-2017-06-23--2017-06-30.csv", "regional-us-weekly-2017-07-07--2017-07-14.csv", "regional-us-weekly-2017-07-14--2017-07-21.csv", "regional-us-weekly-2017-07-21--2017-07-28.csv", "regional-us-weekly-2017-07-28--2017-08-04.csv", "regional-us-weekly-2017-08-11--2017-08-18.csv", "regional-us-weekly-2017-08-18--2017-08-25.csv", "regional-us-weekly-2017-08-25--2017-09-01.csv", "regional-us-weekly-2017-09-01--2017-09-08.csv", "regional-us-weekly-2017-09-08--2017-09-15.csv", "regional-us-weekly-2017-09-22--2017-09-29.csv", "regional-us-weekly-2017-09-29--2017-10-06.csv", "regional-us-weekly-2017-10-06--2017-10-13.csv", "regional-us-weekly-2017-10-13--2017-10-20.csv", "regional-us-weekly-2017-10-20--2017-10-27.csv", "regional-us-weekly-2017-10-27--2017-11-03.csv", "regional-us-weekly-2017-11-03--2017-11-10.csv", "regional-us-weekly-2017-11-10--2017-11-17.csv"]

let clientid = "eb8971d82d674024903bc6488998b737"
let secret = "32c3f68f231e4c23b8cefc27573a6e0e"
let redirect = "http://localhost:8080"
let token = ""
let expiration = 0

let tracks = []

let tokenIsSet = true
token = "BQCrvebCr6DRAUX4El4ekC82T6wf4d9GWyG9syjG2evPN8vaG1CezQIcgCgzcQZFRJ3yCIbmw9o_NOesgwuWbg"
let albumPromises = []

function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], { type: type });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}


let getTopSongs = function (t) {
    s.setAccessToken(t)
    return s.getUserPlaylists('Spotify')
        .then(function (data) {
            return data.items[0].id //Top 50
        })
        .then(function (playlistId) {
            return s.getPlaylistTracks('spotify', playlistId)
        })
        .then(function (playlistData) {
            console.log(playlistData);
            tracks = playlistData.items.map(obj => {
                let track = obj.track;
                return {
                    song: track.name,
                    album: track.album.name,
                    albumId: track.album.id,
                    artists: track.artists.map(a => a.name),
                    artistIds: track.artists.map(a => a.id),
                    songId: track.id,
                    popularity: track.popularity,
                    href: track.href,
                    markets: track.available_markets,
                    explicit: track.explicit,
                    images: track.album.images
                }
            })
            // console.log(tracks)
            return tracks;
        })
        .then(function (tracks) {
            console.log(tracks)
            let ids = tracks.map(x => x.songId)
            console.log(ids)
            return s.getAudioFeaturesForTracks(ids);

        })
        .then(function (features) {
            let L = tracks.length;
            console.log(features)
            console.log(features.audio_features)
            for (let i = 0; i < L; i++) {
                tracks[i].features = features.audio_features[i]
            }
            return tracks
        })
        .then(function (tracks) {
            let artistIdsList = tracks.map(x => x.artistIds[0])
            // let artistIds = [].concat.apply([], artistIdsList);
            console.log(artistIdsList)
            return s.getArtists(artistIdsList)
        })
        .then(function (artistIds) {
            console.log(artistIds)
            for (let i = 0; i < artistIds.length; i++) {
                let artist = artistIds.artists[0]
                tracks[i].mainArtist = {
                    name: artist.name,
                    genres: artist.genres,
                    popularity: artist.popularity,
                    followers: artist.followers,
                    images: artist.images
                }
            }
            let albumIds = tracks.map(x => x.albumId)



            for (let cut = 0; cut < albumIds.length; cut += 20) {
                let slice = albumIds.slice(cut, cut + 20)
                // console.log(slice);
                albumPromises.push(s.getAlbums(slice))
            }

            // return Promise.all(albumPromises).then(function(callback){

            // })

            // return albumPromises
            console.log("done slicing")

            return Promise.all([])
            // // console.log(returnedAlbums)

            // console.log(albumIds)
            // return albumPromises
            // return s.getAlbums(albumIds)
        })
        // .then(function(tracks){
        //     // console.log(tracks)
        // })
        // .then(function(tracks){

        //     // download(JSON.stringify(tracks), "top50.json", "text/plain")
        // })
        .catch(function (error) {
            console.log(error);
        })

}


let finalSpotify = [];

let fixed = []

function combineCSVs(filenames, i) {
    i = i || 0
    d3.csv("top-200/" + filenames[i], function (err, data) {
        for (let item of data) {
            let id = item.URL.split("/").pop();
            let date = [filenames[i].split("-")[3], filenames[i].split("-")[4], filenames[i].split("-")[5]].join("-")
            fixed.push({
                id: id,
                position: item.Position,
                streams: item.Streams,
                date: date
            })
        }
        if (i < filenames.length - 1)
            combineCSVs(filenames, i + 1);
        else {
            console.log(fixed)
            download(JSON.stringify(fixed), "top200.json", "text/plain")
        }
    })
    console.log("DONE" + i)
}

let artistIds = []


function read50FromSpotify(data, position) {

    let sublist = data.slice(position, position + 50)
    
    let ids = sublist.map(x => x.id)

    s.getTracks(ids)
        .then(function (t) {
            let tracks = t.tracks
            artistIds = []
            for (let i = 0; i < tracks.length; i++) {
                let track = tracks[i]
                artistIds.push(track.artists[0].id)
                finalSpotify.push({
                    id: sublist[i].id,
                    position: sublist[i].position,
                    streams: sublist[i].streams,
                    date: sublist[i].streams,
                    name: track.name,
                    artists: track.artists.map(x => {return {id: x.id, name: x.name}}),
                    album: track.album,
                    images: track.images,
                    markets: track.available_markets,
                    explicit: track.explicit,
                    duration: track.duration_ms,
                    popularity: track.popularity
                })
            }

            return s.getAudioFeaturesForTracks(ids);
        }).then(function(f){
            let features = f.audio_features

            for(let i = 0; i < features.length; i++){
                finalSpotify[position+i].features = features[i]
            }

            return s.getArtists(artistIds)

            
        }).then(function(a){
            let artists = a.artists

            for(let i = 0; i < artists.length; i++){
                let artist = artists[i]
                finalSpotify[position+i].genres = artist.genres
                finalSpotify[position+i].followers = artist.followers
            }


            if (position < data.length - 50) {
                console.log("Position -> " + position)
                read50FromSpotify(data, position + 50)
            }
            else{
                download(JSON.stringify(finalSpotify), "testSpotify.json", "text/plain")
            }
        })
    
}


function readAllSpotify() {
    d3.json("top200.json", function (err, data) {
        console.log(data);
        s.setAccessToken(token)
        read50FromSpotify(data, 0)

    })
}


if (tokenIsSet) {
    // combineCSVs(files, 0)
    readAllSpotify()
}
else {
    $.ajax(
        {
            method: "POST",
            url: "https://accounts.spotify.com/api/token",
            headers: {
                'Authorization': 'Basic ' + btoa(clientid + ":" + secret)
            },
            data: {
                "grant_type": "client_credentials",
                "redirect_uri": redirect,
                "client_id": clientid,
            },
            success: function (result) {
                token = result.access_token
                console.log(token)
                expiration = result.expires_in
                readAllSpotify()


            },
        }
    );
}



