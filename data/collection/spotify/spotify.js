var Spotify = require('spotify-web-api-js');
var s = new Spotify();



let clientid = "eb8971d82d674024903bc6488998b737"
let secret = "32c3f68f231e4c23b8cefc27573a6e0e"
let redirect = "http://localhost:8080"
let token = ""
let expiration = 0

let tracks = []

let tokenIsSet = true
token = "BQB1qNRvnhMkgwbVQ8SJFVGupuZMgl6d0mIE1xTmSVQHO3sDxHvyOPh4PmNwbd3nC6n2i0RQ5nLXs6WdvTbcTQ"
let albumPromises = []

function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
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
            tracks =  playlistData.items.map(obj => {
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
        .then(function(tracks){
            console.log(tracks)
            let ids = tracks.map(x => x.songId)
            console.log(ids)
            return s.getAudioFeaturesForTracks(ids);
            
        })
        .then(function(features){
            let L = tracks.length;
            console.log(features)
            console.log(features.audio_features)
            for(let i = 0; i < L; i++){
                tracks[i].features = features.audio_features[i]
            }
            return tracks
        })
        .then(function(tracks){
            let artistIdsList = tracks.map(x => x.artistIds[0])
            // let artistIds = [].concat.apply([], artistIdsList);
            console.log(artistIdsList)
            return s.getArtists(artistIdsList)
        })
        .then(function(artistIds){
            console.log(artistIds)
            for(let i = 0; i < artistIds.length; i++){
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

            

            for(let cut = 0; cut < albumIds.length; cut += 20){
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




if (tokenIsSet) {
    let output = getTopSongs(token)
    let second = Promise.all([output])
    .then(function(result){
        
        return Promise.all(albumPromises).then(function(result){
            console.log(result)
            let albums = result.reverse().reduceRight(function(a,b){
                console.log(a)
                console.log(b)
                return a.concat(b.albums)
            }, [])
            for(let i = 0; i < tracks.length; i++){
                tracks[i].albumData = albums[i]
            }
            console.log(tracks);
            download(JSON.stringify(tracks), "top50withalbums.json", "text/plain")
        })
    })
    .catch()

    second.then(function(output){
        console.log(output)
    })
    
    // console.log(output)
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
                getTopSongs(token)


            },
        }
    );
}



